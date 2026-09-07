"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ShoppingBag, Check, Crown } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog-schema";
import { categoryHasColors } from "@/lib/catalog-schema";
import dynamic from "next/dynamic";
import { useCatalog } from "@/lib/use-catalog";
import { getShopProducts } from "@/lib/catalog-data";
const SmartOrderModal = dynamic(() => import("./SmartOrderModal"), { ssr: false, loading: () => null });

export default function ShopCatalog() {
  const t = useTranslations("shop");
  const tc = useTranslations("currency");
  const { products, loading } = useCatalog();
  const locale = useLocale() as "ar" | "en";
  const [orderProductId, setOrderProductId] = useState<string | null>(null);

  const sorted = useMemo(() => getShopProducts(products), [products]);

  const maxDiscount = (p: CatalogProduct) =>
    Math.max(...p.discount_tiers.map((tier) => tier.discountPercent));

  const isFirst = (p: CatalogProduct) => p.id === sorted[0]?.id;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card-solid rounded-2xl overflow-hidden animate-pulse">
            <div className="h-52 bg-white/5" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-2/3 bg-white/10 rounded-full" />
              <div className="h-3 w-full bg-white/5 rounded-full" />
              <div className="h-3 w-3/4 bg-white/5 rounded-full" />
              <div className="h-8 w-full bg-gold/10 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="w-16 h-16 text-slate-muted/20 mx-auto mb-4" />
        <p className="text-slate-muted">{t("empty")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((product, i) => {
          const hasColors = categoryHasColors(product.category) && !!product.available_colors?.length;
          const discount = maxDiscount(product);
          return (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group card-solid rounded-2xl overflow-hidden h-full flex flex-col hover:border-gold/40 hover:shadow-[0_0_35px_rgba(198,165,104,0.15)] transition-all duration-500"
            >
              <div className="relative h-56 overflow-hidden bg-matte-dark flex items-center justify-center p-4">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name[locale]}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-slate-muted/20" />
                  </div>
                )}
                {isFirst(product) && (
                  <span className="absolute top-3 start-3 px-2.5 py-1 rounded-lg bg-gold/20 border border-gold/50 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-gold" />
                    <span className="text-[10px] font-bold text-gold">{t("bestseller")}</span>
                  </span>
                )}
                {discount > 0 && (
                  <span className="badge-discount absolute top-3 end-3">{t("discountBadge", { p: discount })}</span>
                )}
                {hasColors && product.available_colors && (
                  <div className="absolute bottom-2.5 end-2.5 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 border border-white/10">
                    {product.available_colors.slice(0, 4).map((c) => (
                      <span key={c} className={`w-2.5 h-2.5 rounded-full border border-white/20 ${c === "transparent" ? "swatch-transparent" : c === "silver" ? "swatch-silver" : c === "black" ? "swatch-black" : "swatch-white"}`} />
                    ))}
                    <span className="text-[9px] text-slate-muted font-semibold">{t("colorHint")}</span>
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-light mb-1">{product.name[locale]}</h3>
                <p className="text-xs text-gold/80 font-semibold mb-2">{product.tagline[locale]}</p>
                <ul className="space-y-1.5 mb-4 flex-1">
                  {product.features.slice(0, 3).map((f, fi) => (
                    <li key={fi} className="flex items-start gap-1.5 text-xs text-slate-muted/90">
                      <Check className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
                      {f[locale]}
                    </li>
                  ))}
                </ul>

                <div className="rounded-xl border border-white/10 bg-black/30 p-3 space-y-2 mb-4">
                  <p className="text-[10px] font-bold text-slate-muted uppercase tracking-wide">{t("pricingTitle")}</p>
                  {product.discount_tiers.map((tier) => {
                    const unit = Math.round(product.base_price * (1 - tier.discountPercent / 100));
                    return (
                      <div key={tier.minQty} className="flex items-center justify-between text-sm">
                        <span className="text-slate-muted">
                          {tier.minQty === 1 ? t("tierSingular") : t("tierCount", { min: tier.minQty })}
                        </span>
                        <span className="flex items-center gap-2">
                          {tier.discountPercent > 0 ? (
                            <span className="text-[10px] font-bold text-success">{t("discountBadge", { p: tier.discountPercent })}</span>
                          ) : (
                            <span className="text-[10px] text-slate-muted/60">{t("noDiscount")}</span>
                          )}
                          <span className="font-bold text-slate-light" dir="ltr">
                            {unit} {tc("egp")}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setOrderProductId(product.id)}
                  className="w-full py-3 rounded-xl bg-gradient-gold text-matte-dark font-black text-sm hover:shadow-[0_0_30px_rgba(198,165,104,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {t("orderNow")}
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>

      <p className="text-center text-xs text-slate-muted/70 mt-6">
        {t("contactForShipping")}
      </p>

      <SmartOrderModal
        open={!!orderProductId}
        onClose={() => setOrderProductId(null)}
        initialProductId={orderProductId}
        allowProductSwitch
      />
    </>
  );
}