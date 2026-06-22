"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, LogOut, Plus, Shield } from "lucide-react";
import CafeForm from "@/components/admin/CafeForm";
import CafeTable from "@/components/admin/CafeTable";
import type { Cafe } from "@/lib/cafe-schema";
import { getAllCafes } from "@/lib/cafe-schema";

const ADMIN_PASSWORD = "oreo2552000";

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthenticated(sessionStorage.getItem("admin_auth") === "true");
  }, []);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCafe, setEditingCafe] = useState<Cafe | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (authenticated) {
      getAllCafes().then(setCafes).catch(console.error);
    }
  }, [authenticated, refreshKey]);

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

  const handleEdit = useCallback((cafe: Cafe) => {
    setEditingCafe(cafe);
    setShowForm(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setShowForm(false);
    setEditingCafe(null);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    setEditingCafe(null);
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
            <div className="w-16 h-16 rounded-full bg-neon-green/10 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-neon-green" />
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
                className="w-full px-4 py-3 rounded-lg bg-dark-card border border-white/10 text-slate-light placeholder:text-slate-muted/40 focus:outline-none focus:border-neon-green/50 text-center text-lg tracking-widest"
                autoFocus
              />
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <button
                onClick={handleLogin}
                className="w-full py-3 rounded-lg bg-neon-green text-matte-dark font-bold hover:bg-emerald-400 transition-colors duration-200"
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
            <Shield className="w-6 h-6 text-neon-green" />
            <h1 className="text-2xl font-bold text-slate-light">
              {t("dashboardTitle")}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setEditingCafe(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-green text-matte-dark font-semibold hover:bg-emerald-400 transition-colors duration-200 text-sm"
            >
              <Plus className="w-4 h-4" />
              {t("addCafe")}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-card border border-white/10 text-slate-muted hover:text-red-400 hover:border-red-400/30 transition-all duration-200 text-sm"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cafe Form Modal */}
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
                <CafeForm
                  cafe={editingCafe}
                  onSuccess={handleFormSuccess}
                  onCancel={handleFormClose}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cafe Table */}
        <CafeTable
          cafes={cafes}
          onEdit={handleEdit}
          onRefresh={() => setRefreshKey((k) => k + 1)}
        />
      </div>
    </div>
  );
}
