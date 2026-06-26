"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Plus, Minus, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/lib/product-schema";
import { getAllProducts } from "@/lib/product-schema";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ShopPage() {
  const t = useTranslations("shop");
  const tc = useTranslations("currency");
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAllProducts().then(setProducts).catch(console.error).finally(() => setLoading(false));
  }, []);

  const getEffectivePrice = (p: Product) => p.salePrice ?? p.price;

  const handleWhatsApp = (product: Product) => {
    const effectivePrice = getEffectivePrice(product);
    const total = effectivePrice * qty;
    const msg = `مساء الخير، حابب أطلب منتج: ${product.name} - عدد: ${qty} قطعة - الإجمالي: ${total} ج.م + مصاريف الشحن.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-matte-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-muted hover:text-gold transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t("backHome")}
        </Link>

        <SectionHeading title={t("shopTitle")} subtitle={t("shopSub")} />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-slate-muted/20 mx-auto mb-4" />
            <p className="text-slate-muted">{t("empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div
                  onClick={() => { setSelected(product); setQty(1); setActiveImg(0); }}
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
        )}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-50"
            onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-navy/95 backdrop-blur-xl border border-gold/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.2)] relative"
            >
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>

              <div className="relative h-56 bg-matte-dark">
                {selected.images && selected.images.length > 0 ? (
                  <>
                    <div ref={carouselRef} onScroll={(e) => {
                      const el = e.currentTarget;
                      const idx = Math.round(el.scrollLeft / el.clientWidth);
                      setActiveImg(idx);
                    }} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none h-full">
                      {selected.images.map((url, i) => (
                        <img key={i} src={url} alt={`${selected.name} ${i + 1}`}
                          className="snap-center shrink-0 w-full h-full object-cover" />
                      ))}
                    </div>
                    {selected.images.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {selected.images.map((_, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${i === activeImg ? 'bg-white' : 'bg-white/40'}`} />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ShoppingBag className="w-16 h-16 text-slate-muted/20" />
                  </div>
                )}
                {selected.salePrice && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-gold/20 backdrop-blur-md border border-gold/50 z-10">
                    <span className="text-xs font-bold text-gold">{t("specialOffer")}</span>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-5">
                <h2 className="text-2xl font-bold text-slate-light">{selected.name}</h2>
                <p className="text-sm text-slate-muted/80 leading-relaxed">{selected.description}</p>

                <div className="flex items-center gap-3">
                  {selected.salePrice ? (
                    <>
                      <span className="text-gold font-bold text-2xl">{selected.salePrice} {tc("egp")}</span>
                      <span className="text-slate-muted text-lg line-through">{selected.price} {tc("egp")}</span>
                    </>
                  ) : (
                    <span className="text-slate-light font-bold text-2xl">{selected.price} {tc("egp")}</span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-muted">{t("quantity")}</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-xl bg-white/5 border border-gold/30 flex items-center justify-center text-gold hover:bg-white/10 transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-bold text-gold min-w-[40px] text-center">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="w-10 h-10 rounded-xl bg-white/5 border border-gold/30 flex items-center justify-center text-gold hover:bg-white/10 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-sm text-slate-muted">
                  {t("total")}: <span className="text-gold font-bold">{getEffectivePrice(selected) * qty} {tc("egp")}</span> + {t("shipping")}
                </div>

                <button
                  onClick={() => handleWhatsApp(selected)}
                  className="w-full py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-gold/50 text-gold font-bold text-lg hover:bg-white/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300"
                >
                  {t("orderNow")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
