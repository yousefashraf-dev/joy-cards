"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import SectionHeading from "@/components/ui/SectionHeading";
import { useCatalog } from "@/lib/use-catalog";
import { getShopProducts } from "@/lib/catalog-data";
const SmartOrderModal = dynamic(() => import("./SmartOrderModal"), { ssr: false, loading: () => null });

export default function ShopProducts() {
  const t = useTranslations("shop");
  const tc = useTranslations("currency");
  const locale = useLocale() as "ar" | "en";
  const { products, loading } = useCatalog();
  const [orderId, setOrderId] = useState<string | null>(null);

  const featured = useMemo(
    () => getShopProducts(products).slice(0, 3),
    [products]
  );

  if (loading || featured.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-matte-black via-matte-dark/50 to-matte-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("browseTitle")} subtitle={t("browseSub")} />

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-none lg:grid lg:grid-cols-3 lg:gap-6">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              className="min-w-[280px] sm:min-w-[320px] lg:min-w-0 snap-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="group bg-white/[0.05] border border-gold/30 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-gold/70 hover:shadow-[0_0_25px_rgba(198,165,104,0.25)] transition-all duration-300 h-full flex flex-col">
                <div className="relative h-48 overflow-hidden bg-matte-dark flex items-center justify-center p-4">
                  <img
                    src={product.images?.[0]}
                    alt={product.name[locale]}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-slate-light mb-1">{product.name[locale]}</h3>
                  <ul className="space-y-1 mb-3">
                    {product.features.slice(0, 2).map((f, fi) => (
                      <li key={fi} className="flex items-start gap-1.5 text-[11px] text-slate-muted/90">
                        <Check className="w-3 h-3 text-success mt-0.5 shrink-0" />
                        {f[locale]}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <span className="shrink-0">
                      <span className="text-slate-muted text-xs">{t("from")} </span>
                      <span className="text-gold font-bold text-xl" dir="ltr">
                        {product.base_price} {tc("egp")}
                      </span>
                    </span>
                    <button
                      onClick={() => setOrderId(product.id)}
                      className="px-4 py-2 rounded-xl bg-gradient-gold text-matte-dark font-bold text-xs hover:shadow-[0_0_20px_rgba(198,165,104,0.35)] active:scale-95 transition-all shrink-0"
                    >
                      {t("orderNow")}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-white/5 border border-gold/40 text-gold font-semibold hover:bg-gold/10 hover:shadow-[0_0_25px_rgba(198,165,104,0.2)] transition-all duration-300"
          >
            {t("browseAll")}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </motion.div>
      </div>

      <SmartOrderModal open={!!orderId} onClose={() => setOrderId(null)} initialProductId={orderId} allowProductSwitch />
    </section>
  );
}