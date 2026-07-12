"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Edit3, Trash2, Tag } from "lucide-react";
import type { Product } from "@/lib/product-schema";
interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onRefresh: () => void;
}

export default function ProductTable({ products, onEdit, onRefresh }: ProductTableProps) {
  const t = useTranslations("admin");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saleInputs, setSaleInputs] = useState<Record<string, string>>({});

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm(t("deleteConfirm"))) return;
    setDeletingId(id);
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      onRefresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert(t("errorOccurred"));
    } finally {
      setDeletingId(null);
    }
  }, [t, onRefresh]);

  const handleApplyDiscount = useCallback(async (product: Product) => {
    const salePriceStr = saleInputs[product.id!];
    if (!salePriceStr || isNaN(Number(salePriceStr))) return;
    try {
      await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salePrice: Number(salePriceStr) }),
      });
      onRefresh();
      setSaleInputs((prev) => ({ ...prev, [product.id!]: "" }));
    } catch (error) {
      console.error("Discount error:", error);
    }
  }, [saleInputs, onRefresh]);

  const handleRemoveDiscount = useCallback(async (product: Product) => {
    try {
      await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salePrice: null }),
      });
      onRefresh();
    } catch (error) {
      console.error("Remove discount error:", error);
    }
  }, [onRefresh]);

  if (products.length === 0) {
    return (
      <div className="glass bg-dark-card/50 border border-white/5 rounded-2xl p-12 text-center">
        <p className="text-slate-muted text-sm">{t("addProduct")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass bg-dark-card/60 border border-white/10 rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-300 group"
        >
          <div className="relative h-40 bg-matte-dark overflow-hidden">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-muted/30">
                <Tag className="w-12 h-12" />
              </div>
            )}
            {product.salePrice && (
              <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-gold/20 backdrop-blur-md border border-gold/40">
                <span className="text-[10px] font-bold text-gold">{t("specialOffer")}</span>
              </div>
            )}
          </div>
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-light truncate">{product.name}</h3>
            <div className="flex items-center gap-2">
              {product.salePrice ? (
                <>
                  <span className="text-gold font-bold text-lg">{product.salePrice} EGP</span>
                  <span className="text-slate-muted text-xs line-through">{product.price} EGP</span>
                </>
              ) : (
                <span className="text-slate-light font-bold text-lg">{product.price} EGP</span>
              )}
            </div>
            {product.category && (
              <span className="inline-block px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-muted border border-white/10">
                {product.category}
              </span>
            )}

            <div className="flex items-center gap-2 pt-2">
              <input
                type="number"
                value={saleInputs[product.id!] || ""}
                onChange={(e) => setSaleInputs((prev) => ({ ...prev, [product.id!]: e.target.value }))}
                placeholder={t("salePrice")}
                className="flex-1 px-2 py-1.5 rounded-lg bg-dark-card border border-white/10 text-xs text-slate-light placeholder:text-slate-muted/40 focus:outline-none focus:border-gold/50"
              />
              <button
                onClick={() => handleApplyDiscount(product)}
                className="px-2.5 py-1.5 rounded-lg bg-gold/20 text-gold text-xs font-semibold hover:bg-gold/30 transition-colors border border-gold/30"
              >
                {t("applyDiscount")}
              </button>
            </div>

            {product.salePrice && (
              <button
                onClick={() => handleRemoveDiscount(product)}
                className="text-[10px] text-red-400/70 hover:text-red-400 transition-colors"
              >
                {t("removeDiscount")}
              </button>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <button onClick={() => onEdit(product)} className="p-1.5 rounded-lg text-slate-muted hover:text-gold hover:bg-gold/10 transition-all">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => product.id && handleDelete(product.id)} disabled={deletingId === product.id}
                className="p-1.5 rounded-lg text-slate-muted hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-50">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
