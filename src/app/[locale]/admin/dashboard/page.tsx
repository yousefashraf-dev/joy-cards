"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, LogOut, Plus, Shield, ShoppingBag, Store, NotebookText, Upload, Gift, Share2, Copy, Check, ClipboardList } from "lucide-react";
import CafeForm from "@/components/admin/CafeForm";
import CafeTable from "@/components/admin/CafeTable";
import ProductForm from "@/components/admin/ProductForm";
import ProductTable from "@/components/admin/ProductTable";
import MenuForm from "@/components/admin/MenuForm";
import MenuTable from "@/components/admin/MenuTable";
import SurpriseForm from "@/components/admin/SurpriseForm";
import SurpriseTable from "@/components/admin/SurpriseTable";
import OrdersTable from "@/components/admin/OrdersTable";
import CsvImport from "@/components/admin/CsvImport";
import type { Cafe } from "@/lib/cafe-schema";
import type { Product } from "@/lib/product-schema";
import type { MenuDocument } from "@/lib/menu-schema";
import type { Surprise } from "@/lib/surprise-schema";

const ADMIN_PASSWORD = "oreo2552000";

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"cafes" | "products" | "menus" | "import-csv" | "surprises" | "orders">("cafes");

  useEffect(() => {
    setAuthenticated(sessionStorage.getItem("admin_auth") === "true");
  }, []);

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [menus, setMenus] = useState<MenuDocument[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCafe, setEditingCafe] = useState<Cafe | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingMenu, setEditingMenu] = useState<MenuDocument | null>(null);
  const [editingSurprise, setEditingSurprise] = useState<Surprise | null>(null);
  const [surprises, setSurprises] = useState<Surprise[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [copiedCreateLink, setCopiedCreateLink] = useState(false);

  useEffect(() => {
    if (authenticated && activeTab === "cafes") {
      fetch("/api/cafes").then((r) => r.ok ? r.json() : []).then(setCafes).catch(console.error);
    }
  }, [authenticated, activeTab, refreshKey]);

  useEffect(() => {
    if (authenticated && activeTab === "products") {
      fetch("/api/products").then((r) => r.ok ? r.json() : []).then(setProducts).catch(console.error);
    }
  }, [authenticated, activeTab, refreshKey]);

  useEffect(() => {
    if (authenticated && activeTab === "menus") {
      fetch("/api/menus").then((r) => r.ok ? r.json() : []).then(setMenus).catch(console.error);
    }
  }, [authenticated, activeTab, refreshKey]);

  useEffect(() => {
    if (authenticated && activeTab === "surprises") {
      fetch("/api/surprises").then((r) => r.ok ? r.json() : []).then(setSurprises).catch(console.error);
    }
  }, [authenticated, activeTab, refreshKey]);

  const handleLogin = useCallback(() => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true");
      setAuthenticated(true);
      setError("");
    } else {
      setError(t("loginError"));
    }
  }, [password, t]);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("admin_auth");
    router.back();
  }, [router]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleLogin();
    },
    [handleLogin]
  );

  const handleEditCafe = useCallback((cafe: Cafe) => {
    setEditingCafe(cafe);
    setEditingProduct(null);
    setShowForm(true);
  }, []);

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
    setEditingCafe(null);
    setShowForm(true);
  }, []);

  const handleEditMenu = useCallback((menu: MenuDocument) => {
    setEditingMenu(menu);
    setEditingCafe(null);
    setEditingProduct(null);
    setShowForm(true);
  }, []);

  const handleEditSurprise = useCallback((surprise: Surprise) => {
    setEditingSurprise(surprise);
    setShowForm(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setShowForm(false);
    setEditingCafe(null);
    setEditingProduct(null);
    setEditingMenu(null);
    setEditingSurprise(null);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    setEditingCafe(null);
    setEditingProduct(null);
    setEditingMenu(null);
    setEditingSurprise(null);
    setRefreshKey((k) => k + 1);
  }, []);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-matte-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <div className="glass bg-matte-card/80 border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-xl font-bold text-slate-light mb-2">
              {t("loginTitle")}
            </h1>
            <div className="space-y-4 mt-6">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder={t("loginPlaceholder")}
                className="w-full px-4 py-3 rounded-lg bg-dark-card border border-white/10 text-slate-light placeholder:text-slate-muted/40 focus:outline-none focus:border-gold/50 text-center text-lg tracking-widest"
                autoFocus
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                onClick={handleLogin}
                className="w-full py-3 rounded-lg bg-gold text-matte-dark font-bold hover:bg-gold-light transition-colors duration-200"
              >
                {t("loginButton")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-matte-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-gold" />
            <h1 className="text-2xl font-bold text-slate-light">
              {t("dashboardTitle")}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === "surprises" && (
              <button
                onClick={() => {
                  const url = `${window.location.origin}/ar/surprise/create`;
                  navigator.clipboard.writeText(url).then(() => {
                    setCopiedCreateLink(true);
                    setTimeout(() => setCopiedCreateLink(false), 3000);
                  }).catch(() => prompt("انسخ لينك الإنشاء:", url));
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold text-sm transition-all duration-200 ${
                  copiedCreateLink
                    ? "bg-green-500/20 border-green-500/40 text-green-400"
                    : "bg-pink-500/10 border-pink-500/30 text-pink-400 hover:bg-pink-500/20"
                }`}
              >
                {copiedCreateLink ? <><Check className="w-4 h-4" /> تم النسخ!</> : <><Share2 className="w-4 h-4" /> نسخ لينك الإنشاء</>}
              </button>
            )}
            {activeTab !== "orders" && (
              <button
                onClick={() => {
                  setEditingCafe(null);
                  setEditingProduct(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-matte-dark font-semibold hover:bg-gold-light transition-colors duration-200 text-sm"
              >
                <Plus className="w-4 h-4" />
                {activeTab === "cafes" ? t("addCafe") : activeTab === "menus" ? "إضافة منيو" : activeTab === "surprises" ? "إضافة مفاجأة" : t("addProduct")}
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-card border border-white/10 text-slate-muted hover:text-red-400 hover:border-red-400/30 transition-all duration-200 text-sm"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Side Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("cafes")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "cafes"
                ? "bg-gold/20 text-gold border border-gold/40 shadow-[0_0_15px_rgba(198,165,104,0.15)]"
                : "bg-white/5 text-slate-muted border border-white/10 hover:bg-white/10"
            }`}
          >
            <Store className="w-4 h-4" />
            {t("cafesTab")}
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "products"
                ? "bg-gold/20 text-gold border border-gold/40 shadow-[0_0_15px_rgba(198,165,104,0.15)]"
                : "bg-white/5 text-slate-muted border border-white/10 hover:bg-white/10"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {t("productsTab")}
          </button>
          <button
            onClick={() => setActiveTab("menus")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "menus"
                ? "bg-gold/20 text-gold border border-gold/40 shadow-[0_0_15px_rgba(198,165,104,0.15)]"
                : "bg-white/5 text-slate-muted border border-white/10 hover:bg-white/10"
            }`}
          >
            <NotebookText className="w-4 h-4" />
            المنيو الرقمي
          </button>
          <button
            onClick={() => setActiveTab("import-csv")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "import-csv"
                ? "bg-green-500/20 text-green-400 border border-green-500/40 shadow-[0_0_15px_rgba(74,222,128,0.15)]"
                : "bg-white/5 text-slate-muted border border-white/10 hover:bg-white/10"
            }`}
          >
            <Upload className="w-4 h-4" />
            استيراد CSV
          </button>
          <button
            onClick={() => setActiveTab("surprises")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "surprises"
                ? "bg-pink-500/20 text-pink-400 border border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                : "bg-white/5 text-slate-muted border border-white/10 hover:bg-white/10"
            }`}
          >
            <Gift className="w-4 h-4" />
            المفاجآت
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "orders"
                ? "bg-gold/20 text-gold border border-gold/40 shadow-[0_0_15px_rgba(198,165,104,0.15)]"
                : "bg-white/5 text-slate-muted border border-white/10 hover:bg-white/10"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            {t("ordersTab")}
          </button>
        </div>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto"
              onClick={(e) => {
                if (e.target === e.currentTarget) handleFormClose();
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="w-full max-w-2xl mt-8 mb-8"
              >
                {editingSurprise ? (
                  <SurpriseForm
                    surprise={editingSurprise}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormClose}
                  />
                ) : activeTab === "surprises" ? (
                  <SurpriseForm
                    surprise={null}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormClose}
                  />
                ) : editingCafe || (activeTab === "cafes" && !editingProduct && !editingMenu) ? (
                  <CafeForm
                    cafe={editingCafe}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormClose}
                  />
                ) : editingMenu || (activeTab === "menus" && !editingCafe && !editingProduct) ? (
                  <MenuForm
                    menu={editingMenu}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormClose}
                  />
                ) : (
                  <ProductForm
                    product={editingProduct}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormClose}
                  />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        {activeTab === "cafes" ? (
          <CafeTable
            cafes={cafes}
            onEdit={handleEditCafe}
            onRefresh={() => setRefreshKey((k) => k + 1)}
          />
        ) : activeTab === "menus" ? (
          <MenuTable
            menus={menus}
            onEdit={handleEditMenu}
            onRefresh={() => setRefreshKey((k) => k + 1)}
          />
        ) : activeTab === "surprises" ? (
          <SurpriseTable
            surprises={surprises}
            onEdit={handleEditSurprise}
            onRefresh={() => setRefreshKey((k) => k + 1)}
          />
        ) : activeTab === "import-csv" ? (
          <CsvImport onSuccess={() => setRefreshKey((k) => k + 1)} />
        ) : activeTab === "orders" ? (
          <OrdersTable />
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <ProductForm
                product={null}
                onSuccess={handleFormSuccess}
                onCancel={() => {}}
              />
            </div>
            <div>
              <ProductTable
                products={products}
                onEdit={handleEditProduct}
                onRefresh={() => setRefreshKey((k) => k + 1)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
