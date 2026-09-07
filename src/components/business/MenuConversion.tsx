"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  FileText, Palette, QrCode, RefreshCcw, LayoutGrid,
  X, Check, MessageCircle, ArrowLeft,
} from "lucide-react";
import dynamic from "next/dynamic";
const SmartOrderModal = dynamic(() => import("@/components/shop/SmartOrderModal"), { ssr: false, loading: () => null });

const stepIcons = [FileText, Palette, QrCode, RefreshCcw, LayoutGrid];

export default function MenuConversion() {
  const t = useTranslations("businessTap.menuConversion");
  const locale = useLocale() as "ar" | "en";
  const [open, setOpen] = useState(false);

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-matte-black to-matte-dark/40 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 lg:mb-18"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs mb-6">
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>{t("title")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-light mb-4 leading-tight">
            {t("title")}
          </h2>
          <p className="text-slate-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* 5 Steps Timeline */}
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute inset-y-0 start-[26px] w-px bg-gradient-to-b from-gold/60 via-gold/30 to-transparent hidden sm:block" />
          <div className="space-y-6" dir={locale === "ar" ? "rtl" : "ltr"}>
            {[...Array(5)].map((_, i) => {
              const Icon = stepIcons[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: locale === "ar" ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group flex items-start gap-5"
                >
                  <div className="relative z-10 shrink-0 w-[52px] h-[52px] rounded-2xl bg-matte-dark border border-gold/40 flex items-center justify-center group-hover:shadow-[0_0_25px_rgba(198,165,104,0.3)] transition-all duration-300">
                    <Icon className="w-6 h-6 text-gold" />
                    <span className="absolute -top-2 -end-2 w-6 h-6 rounded-full bg-gradient-gold text-matte-dark text-[11px] font-black flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <div className="glass-card rounded-2xl p-5 flex-1 hover:border-gold/30 transition-all duration-300">
                    <h3 className="text-base font-bold text-slate-light mb-1.5">
                      {t(`step${i + 1}Title`)}
                    </h3>
                    <p className="text-sm text-slate-muted leading-relaxed">
                      {t(`step${i + 1}Desc`)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Before / After */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mt-16 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card rounded-2xl p-6 lg:p-8 border-white/5"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
              <X className="w-6 h-6 text-red-400/80" />
            </div>
            <h3 className="text-lg font-bold text-slate-muted mb-2">{t("beforeTitle")}</h3>
            <p className="text-sm text-slate-muted/70 leading-relaxed">{t("beforeDesc")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl p-6 lg:p-8 border border-gold/40 bg-gold/[0.06] shadow-[0_0_40px_rgba(198,165,104,0.12)] relative overflow-hidden"
          >
            <div className="absolute -top-20 -end-20 w-52 h-52 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center mb-5">
              <Check className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-lg font-bold text-gold mb-2">{t("afterTitle")}</h3>
            <p className="text-sm text-slate-light/80 leading-relaxed">{t("afterDesc")}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-14"
        >
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-gold text-matte-dark font-bold text-lg hover:scale-105 active:scale-95 transition-all duration-200 glow-gold hover:glow-gold-strong"
          >
            <MessageCircle className="w-6 h-6" />
            <span>{t("cta")}</span>
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
          </button>
          <p className="text-xs text-slate-muted/70 mt-5 max-w-md mx-auto leading-relaxed">
            {t("note")}
          </p>
        </motion.div>
      </div>

      <SmartOrderModal open={open} onClose={() => setOpen(false)} mode="menu" />
    </section>
  );
}