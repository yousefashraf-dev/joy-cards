"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Utensils, Star, Wifi, Globe, MessageCircle,
} from "lucide-react";
import { WHATSAPP_BUSINESS_MSG } from "@/lib/constants";

export default function BusinessTapPage() {
  const t = useTranslations("products.businessTap");

  const services = [
    { icon: Utensils, key: "digitalMenu" },
    { icon: Star, key: "googleReviews" },
    { icon: Wifi, key: "wifiAccess" },
    { icon: Globe, key: "socialHub" },
  ];

  return (
    <>
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-b from-neon-green/5 via-matte-black to-matte-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-xs mb-8">
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
                    className="group glass bg-dark-card/40 border border-white/5 rounded-2xl p-6 hover:border-neon-green/20 hover:bg-dark-card/60 transition-all duration-500"
                  >
                    <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center mb-5 group-hover:bg-neon-green/20 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-neon-green" />
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
                <div className="absolute inset-0 bg-gradient-to-br from-neon-green/20 to-neon-green/5 rounded-3xl rotate-6" />
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

      <section className="py-20 lg:py-28 bg-gradient-to-b from-matte-dark/30 to-matte-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="glass bg-dark-card/60 border border-neon-green/20 rounded-3xl p-12 lg:p-16 max-w-2xl mx-auto">
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
                className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-neon-green to-emerald-500 text-matte-dark font-bold text-lg hover:scale-105 active:scale-95 transition-all duration-200 shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:shadow-[0_0_50px_rgba(45,212,191,0.6)]"
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
