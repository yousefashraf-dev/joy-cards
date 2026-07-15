"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/lib/product-schema";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductDetailModal from "./ProductDetailModal";

export default function ShopProducts() {
  const t = useTranslations("shop");
  const tc = useTranslations("currency");
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products").then((r) => r.ok ? r.json() : []).then((all) => setProducts(all.slice(0, 3))).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-matte-black via-matte-dark/50 to-matte-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("browseTitle")} subtitle={t("browseSub")} />

        {/* Horizontal Scroll Snap for mobile */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-none lg:grid lg:grid-cols-3 lg:gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="min-w-[280px] sm:min-w-[320px] lg:min-w-0 snap-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div
                onClick={() => setSelected(product)}
                className="group cursor-pointer glass bg-white/5 backdrop-blur-md border border-gold/30 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-gold/70 hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] transition-all duration-300 h-full flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-matte-dark">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ShoppingBag className="w-12 h-12 text-slate-muted/20" />
                    </div>
                  )}
                  {product.salePrice && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-gold/20 backdrop-blur-md border border-gold/50">
                      <span className="text-[10px] font-bold text-gold">{t("specialOffer")}</span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-slate-light mb-2">{product.name}</h3>
                  <p className="text-xs text-slate-muted/70 line-clamp-2 mb-4 flex-1">{product.description}</p>
                  <div className="flex items-center gap-3">
                    {product.salePrice ? (
                      <>
                        <span className="text-gold font-bold text-xl">{product.salePrice} {tc("egp")}</span>
                        <span className="text-slate-muted text-sm line-through">{product.price} {tc("egp")}</span>
                      </>
                    ) : (
                      <span className="text-slate-light font-bold text-xl">{product.price} {tc("egp")}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Browse all button */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl glass bg-white/5 backdrop-blur-md border border-gold/40 text-gold font-semibold hover:bg-gold/10 hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] transition-all duration-300"
          >
            {t("browseAll")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      <ProductDetailModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
