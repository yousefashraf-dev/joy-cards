"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus } from "lucide-react";
import type { Product } from "@/lib/product-schema";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const t = useTranslations("shop");
  const tc = useTranslations("currency");
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const getEffectivePrice = (p: Product) => p.salePrice ?? p.price;

  const handleWhatsApp = (product: Product) => {
    const effectivePrice = getEffectivePrice(product);
    const total = effectivePrice * qty;
    const msg = `مساء الخير، حابب أطلب منتج: ${product.name} - عدد: ${qty} قطعة - الإجمالي: ${total} ج.م + مصاريف الشحن.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-50"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-navy/95 backdrop-blur-xl border border-gold/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.2)]"
          >
            <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>

            <div className="relative h-56 bg-matte-dark">
              {product.images && product.images.length > 0 ? (
                <>
                  <div ref={carouselRef} onScroll={(e) => {
                    const el = e.currentTarget;
                    const idx = Math.round(el.scrollLeft / el.clientWidth);
                    setActiveImg(idx);
                  }} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none h-full">
                    {product.images.map((url, i) => (
                      <img key={i} src={url} alt={`${product.name} ${i + 1}`}
                        className="snap-center shrink-0 w-full h-full object-cover" />
                    ))}
                  </div>
                  {product.images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {product.images.map((_, i) => (
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
              {product.salePrice && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-gold/20 backdrop-blur-md border border-gold/50 z-10">
                  <span className="text-xs font-bold text-gold">{t("specialOffer")}</span>
                </div>
              )}
            </div>

            <div className="p-6 space-y-5">
              <h2 className="text-2xl font-bold text-slate-light">{product.name}</h2>
              <p className="text-sm text-slate-muted/80 leading-relaxed">{product.description}</p>

              <div className="flex items-center gap-3">
                {product.salePrice ? (
                  <>
                    <span className="text-gold font-bold text-2xl">{product.salePrice} {tc("egp")}</span>
                    <span className="text-slate-muted text-lg line-through">{product.price} {tc("egp")}</span>
                  </>
                ) : (
                  <span className="text-slate-light font-bold text-2xl">{product.price} {tc("egp")}</span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-muted">{t("quantity")}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-gold/30 flex items-center justify-center text-gold hover:bg-white/10 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-bold text-gold min-w-[40px] text-center">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-gold/30 flex items-center justify-center text-gold hover:bg-white/10 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-slate-muted">
                {t("total")}: <span className="text-gold font-bold">{getEffectivePrice(product) * qty} {tc("egp")}</span> + {t("shipping")}
              </div>

              <button
                onClick={() => handleWhatsApp(product)}
                className="w-full py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-gold/50 text-gold font-bold text-lg hover:bg-white/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300"
              >
                {t("orderNow")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
