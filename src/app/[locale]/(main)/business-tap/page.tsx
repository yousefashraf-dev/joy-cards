"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Utensils, Star, Wifi, Globe, MessageCircle,
  QrCode, Smartphone, MapPin,
  CreditCard, ChevronRight, List, Camera, ThumbsUp, Sparkles,
} from "lucide-react";
import { WHATSAPP_BUSINESS_MSG } from "@/lib/constants";

function NfcWaves() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="50" stroke="#D4AF37" strokeWidth="1.5" opacity="0.15" />
      <circle cx="60" cy="60" r="38" stroke="#D4AF37" strokeWidth="1.5" opacity="0.25" />
      <circle cx="60" cy="60" r="26" stroke="#D4AF37" strokeWidth="1.5" opacity="0.4" />
      <circle cx="60" cy="60" r="14" stroke="#D4AF37" strokeWidth="2" opacity="0.6" />
      <circle cx="60" cy="60" r="6" fill="#D4AF37" opacity="0.8" />
      <path d="M60 10 C60 10 60 110 60 110" stroke="#D4AF37" strokeWidth="0.8" opacity="0.2" />
      <path d="M10 60 C10 60 110 60 110 60" stroke="#D4AF37" strokeWidth="0.8" opacity="0.2" />
    </svg>
  );
}

function SocialLinksMockup() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-matte-dark text-lg font-black shadow-lg shadow-gold/30">
        R
      </div>
      <p className="text-sm font-bold text-slate-light">كافيه روما</p>
      <p className="text-[10px] text-slate-muted/50 -mt-1">Cafe Roma</p>
      <div className="flex gap-2.5 mt-1">
        {[
          { icon: Camera, color: "text-gold" },
          { icon: ThumbsUp, color: "text-gold" },
          { icon: MapPin, color: "text-gold/70" },
          { icon: MessageCircle, color: "text-gold" },
        ].map(({ icon: Icon, color }, i) => (
          <div key={i} className={`w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
        ))}
      </div>
      <div className="w-full mt-2 space-y-1.5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gold/10 border border-gold/20">
          <CreditCard className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] text-gold font-semibold">InstaPay · 010xxxxxxx</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <MapPin className="w-3.5 h-3.5 text-gold/60" />
          <span className="text-[10px] text-slate-muted">رئيسي · القاهرة</span>
        </div>
      </div>
    </div>
  );
}

function MenuMockup() {
  const sections = [
    { name: "SALAD", items: ["Caesar Chicken", "Greek Feta", "Mix Garden"] },
    { name: "PIZZA", items: ["Pepperoni", "Margherita", "Truffle Mushroom"] },
    { name: "PASTA", items: ["Alfredo Chicken", "Pomodoro Shrimp", "Carbonara"] },
  ];
  return (
    <div className="w-full space-y-3">
      {sections.map((sec, i) => (
        <div key={i}>
          <div className="flex items-center gap-2 mb-1.5">
            <ChevronRight className="w-3 h-3 text-gold" />
            <span className="text-[11px] font-bold text-gold tracking-wider uppercase">{sec.name}</span>
            <div className="h-px flex-1 bg-gold/20" />
          </div>
          <div className="space-y-1">
            {sec.items.map((item, j) => (
              <div key={j} className="flex items-center gap-2 px-2">
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-xs text-slate-light/80">{item}</span>
                <span className="text-[8px] text-slate-muted/30 ml-auto">——</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BusinessTapPage() {
  const t = useTranslations("products.businessTap");

  const services = [
    { icon: Utensils, key: "digitalMenu" },
    { icon: Star, key: "googleReviews" },
    { icon: Wifi, key: "wifiAccess" },
    { icon: Globe, key: "socialHub" },
  ];

  const steps = [
    { icon: null, key: "step1", customIcon: "qr" },
    { icon: null, key: "step2", customIcon: "links" },
    { icon: null, key: "step3", customIcon: "menu" },
  ];

  return (
    <>
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-b from-gold/5 via-matte-black to-matte-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs mb-8">
                <span>{t("badge")}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-light mb-6 leading-tight">
                {t("title")}
              </h1>
              <p className="text-slate-muted text-base md:text-lg leading-relaxed mb-14 max-w-xl">
                {t("desc")}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map(({ icon: Icon, key }, index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                    className="group glass-card rounded-2xl p-6 hover:border-gold/30 transition-all duration-500"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-light mb-3">
                      {t(`services.${key}`)}
                    </h3>
                    <p className="text-sm text-slate-muted/80 leading-relaxed">
                      {t(`features.${key}`)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="hidden lg:flex items-center justify-center"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-80 h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-gold/5 rounded-3xl rotate-6" />
                <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10">
                  <Image
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"
                    alt="Fine dining restaurant NFC tag"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section: How It Works */}
      <section className="py-20 lg:py-28 bg-matte-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14 lg:mb-18"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-light mb-4 leading-tight">
              {t("featureSection.title")}
            </h2>
            <p className="text-slate-muted text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
              {t("featureSection.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* Step 1: QR + NFC */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group glass-card rounded-2xl p-6 lg:p-8 hover:border-gold/30 transition-all duration-500 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="relative w-16 h-16 shrink-0">
                  <div className="absolute inset-0 bg-gold/10 rounded-xl group-hover:bg-gold/20 transition-colors duration-300" />
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <NfcWaves />
                    </div>
                    <QrCode className="w-6 h-6 text-gold relative z-10" />
                  </div>
                </div>
                <Smartphone className="w-7 h-7 text-gold/40" />
              </div>
              <h3 className="text-lg font-bold text-slate-light mb-3">
                {t("featureSection.step1Title")}
              </h3>
              <p className="text-sm text-slate-muted/80 leading-relaxed flex-1">
                {t("featureSection.step1Desc")}
              </p>
            </motion.div>

            {/* Step 2: Social Links & Payment Hub */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group glass-card rounded-2xl p-6 lg:p-8 hover:border-gold/30 transition-all duration-500 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="flex -space-x-2">
                  <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <Camera className="w-4 h-4 text-gold" />
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <ThumbsUp className="w-4 h-4 text-gold" />
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-gold" />
                  </div>
                </div>
                <div className="h-px flex-1 bg-gold/20" />
                <Globe className="w-5 h-5 text-gold/40" />
              </div>
              <h3 className="text-lg font-bold text-slate-light mb-3">
                {t("featureSection.step2Title")}
              </h3>
              <p className="text-sm text-slate-muted/80 leading-relaxed flex-1">
                {t("featureSection.step2Desc")}
              </p>

              {/* Mockup Card */}
              <div className="mt-5 p-4 rounded-xl bg-matte-black/60 border border-white/5">
                <SocialLinksMockup />
              </div>
            </motion.div>

            {/* Step 3: Smart Digital Menu */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group glass-card rounded-2xl p-6 lg:p-8 hover:border-gold/30 transition-all duration-500 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                  <List className="w-6 h-6 text-gold" />
                </div>
                <div className="h-px flex-1 bg-gold/20" />
                <Utensils className="w-5 h-5 text-gold/40" />
              </div>
              <h3 className="text-lg font-bold text-slate-light mb-3">
                {t("featureSection.step3Title")}
              </h3>
              <p className="text-sm text-slate-muted/80 leading-relaxed flex-1">
                {t("featureSection.step3Desc")}
              </p>

              {/* Menu Mockup */}
              <div className="mt-5 p-4 rounded-xl bg-matte-black/60 border border-white/5">
                <MenuMockup />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-to-b from-matte-dark/30 to-matte-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="glass bg-dark-card/60 border border-gold/20 rounded-3xl p-12 lg:p-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-light mb-6">
                {t("title")}
              </h2>
              <p className="text-slate-muted text-base md:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                {t("marketing")}
              </p>
              <a
                href={WHATSAPP_BUSINESS_MSG}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-gold text-matte-dark font-bold text-lg hover:scale-105 active:scale-95 transition-all duration-200 glow-gold hover:glow-gold-strong"
              >
                <MessageCircle className="w-6 h-6" />
                <span>{t("cta")}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
