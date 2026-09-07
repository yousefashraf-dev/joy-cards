"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ShoppingBag, MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useCatalog } from "@/lib/use-catalog";
import { getShopProducts } from "@/lib/catalog-data";
const SmartOrderModal = dynamic(() => import("@/components/shop/SmartOrderModal"), { ssr: false, loading: () => null });

export default function StickyCta() {
  const t = useTranslations("stickyCta");
  const tc = useTranslations("currency");
  const locale = useLocale() as "ar" | "en";
  const { products } = useCatalog();
  const [open, setOpen] = useState(false);

  const featured = getShopProducts(products)[0] ?? null;

  if (!featured) return null;

  const basePrice = featured.base_price;

  return (
    <>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-0 inset-x-0 z-40 px-3 pb-3 sm:px-4 pointer-events-none"
      >
        <div className="pointer-events-auto max-w-lg mx-auto flex items-center gap-3 rounded-2xl border border-gold/30 bg-matte-dark/95 px-3.5 py-2.5 shadow-[0_-4px_30px_rgba(0,0,0,0.5)]">
          <div className="w-11 h-11 rounded-xl bg-matte-dark border border-gold/20 overflow-hidden flex items-center justify-center shrink-0">
            {featured.images?.[0] ? (
              <img src={featured.images[0]} alt={featured.name[locale]} className="w-full h-full object-contain p-0.5" />
            ) : (
              <ShoppingBag className="w-5 h-5 text-slate-muted/40" />
            )}
          </div>
          <div className="flex-1 min-w-0 leading-tight">
            <p className="text-sm font-bold text-slate-light truncate">{featured.name[locale]}</p>
            <p className="text-[11px] text-slate-muted">
              {t("from")} <span className="text-gold font-bold" dir="ltr">{basePrice} {tc("egp")}</span> · {t("tagline")}
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-gold text-matte-dark font-black text-sm hover:shadow-[0_0_25px_rgba(198,165,104,0.4)] active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            {t("orderNow")}
          </button>
        </div>
      </motion.div>

      <SmartOrderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}