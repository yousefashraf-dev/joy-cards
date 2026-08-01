"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Plus, Minus, X, ArrowLeft, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/lib/product-schema";
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
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    fetch("/api/products").then((r) => r.ok ? r.json() : []).then(setProducts).catch(console.error).finally(() => setLoading(false));
  }, []);

  const getEffectivePrice = (p: Product) => p.salePrice ?? p.price;

  const handleWhatsApp = (product: Product) => {
    const effectivePrice = getEffectivePrice(product);
    const total = effectivePrice * qty;
    const msg = `مساء الخير، حابب أطلب منتج: ${product.name} - عدد: ${qty} قطعة - الإجمالي: ${total} ج.م + مصاريف الشحن.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  const images = selected?.images ?? [];
  const totalImages = images.length;

  const goToPrev = useCallback(() => {
    setActiveImg((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  }, [totalImages]);

  const goToNext = useCallback(() => {
    setActiveImg((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  }, [totalImages]);

  const handleTouchStart = useCallback((e: React.TouchEvent | React.PointerEvent) => {
    touchStartX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent | React.PointerEvent) => {
    touchEndX.current = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
  }, [goToNext, goToPrev]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, goToPrev, goToNext]);

  useEffect(() => {
    if (!lightboxOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

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
          <div className="space-y-14">
            {(() => {
              const sections = [
                { items: products.filter((p) => p.type !== "regular"), title: t("nfcSection") },
                { items: products.filter((p) => p.type === "regular"), title: t("regularSection") },
              ];
              return sections.map(
                (section, sIdx) =>
                  section.items.length > 0 && (
                    <section key={sIdx}>
                      <div className="flex items-center gap-3 mb-6">
                        <span className="w-1.5 h-6 rounded-full bg-gradient-gold" />
                        <h2 className="text-xl font-bold text-gradient-gold">{section.title}</h2>
                        <span className="text-xs text-slate-muted/70 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5">
                          {section.items.length}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {section.items.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div
                  onClick={() => { setSelected(product); setQty(1); setActiveImg(0); }}
                  className="group cursor-pointer glass-card rounded-2xl overflow-hidden h-full flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden bg-matte-dark flex items-center justify-center p-4">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex items-center justify-center">
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
                    </section>
                  )
              );
            })()}
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
            onClick={(e) => { if (e.target === e.currentTarget) { setSelected(null); setLightboxOpen(false); } }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-matte-black/95 backdrop-blur-xl border border-gold/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(198,165,104,0.2)] relative"
            >
              <button onClick={() => { setSelected(null); setLightboxOpen(false); }} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>

              <div
                className="relative h-72 sm:h-80 bg-matte-dark flex items-center justify-center select-none overflow-hidden cursor-zoom-in touch-pan-y"
                onClick={totalImages > 0 ? () => setLightboxOpen(true) : undefined}
                onPointerDown={totalImages > 1 ? handleTouchStart : undefined}
                onPointerUp={totalImages > 1 ? handleTouchEnd : undefined}
                onTouchStart={totalImages > 1 ? handleTouchStart : undefined}
                onTouchEnd={totalImages > 1 ? handleTouchEnd : undefined}
              >
                {totalImages > 0 ? (
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImg}
                      src={images[activeImg]}
                      alt={`${selected.name} ${activeImg + 1}`}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-full object-contain p-4"
                      draggable={false}
                    />
                  </AnimatePresence>
                ) : (
                  <div className="flex items-center justify-center">
                    <ShoppingBag className="w-16 h-16 text-slate-muted/20" />
                  </div>
                )}

                {totalImages > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass bg-black/50 backdrop-blur-md border border-gold/20 flex items-center justify-center text-gold hover:bg-gold/20 hover:border-gold/50 transition-all z-10"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); goToNext(); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass bg-black/50 backdrop-blur-md border border-gold/20 flex items-center justify-center text-gold hover:bg-gold/20 hover:border-gold/50 transition-all z-10"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            i === activeImg
                              ? "bg-gold shadow-[0_0_8px_rgba(198,165,104,0.6)] w-5"
                              : "bg-white/30 hover:bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                <button
                  onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
                  className="absolute bottom-3 right-3 w-10 h-10 rounded-full glass bg-black/50 backdrop-blur-md border border-gold/20 flex items-center justify-center text-gold hover:bg-gold/20 hover:border-gold/50 transition-all z-10"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>

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
                  className="w-full py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-gold/50 text-gold font-bold text-lg hover:bg-white/20 hover:shadow-[0_0_30px_rgba(198,165,104,0.3)] transition-all duration-300"
                >
                  {t("orderNow")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Image Lightbox */}
      <AnimatePresence>
        {lightboxOpen && selected && totalImages > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col"
            onClick={(e) => { if (e.target === e.currentTarget) setLightboxOpen(false); }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-semibold text-gold tabular-nums">
                {activeImg + 1} / {totalImages}
              </span>
              <button
                onClick={() => setLightboxOpen(false)}
                className="w-10 h-10 rounded-full glass bg-white/5 backdrop-blur-md border border-gold/30 flex items-center justify-center text-slate-light hover:text-white hover:bg-gold/20 hover:border-gold/60 transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image area */}
            <div
              className="flex-1 relative flex items-center justify-center overflow-hidden px-2 pb-2 select-none touch-pan-y"
              onPointerDown={totalImages > 1 ? handleTouchStart : undefined}
              onPointerUp={totalImages > 1 ? handleTouchEnd : undefined}
              onTouchStart={totalImages > 1 ? handleTouchStart : undefined}
              onTouchEnd={totalImages > 1 ? handleTouchEnd : undefined}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={images[activeImg]}
                  alt={`${selected.name} ${activeImg + 1}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="max-h-full max-w-full object-contain"
                  draggable={false}
                />
              </AnimatePresence>

              {totalImages > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass bg-white/5 backdrop-blur-md border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/20 hover:border-gold/60 transition-all z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goToNext(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass bg-white/5 backdrop-blur-md border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/20 hover:border-gold/60 transition-all z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom dots */}
            {totalImages > 1 && (
              <div className="flex items-center justify-center gap-2 py-4">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === activeImg
                        ? "bg-gold shadow-[0_0_8px_rgba(198,165,104,0.6)] w-5"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
