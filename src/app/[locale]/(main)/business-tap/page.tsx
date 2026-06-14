"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Store, Utensils, Star, Smartphone, Wifi, CreditCard, MessageCircle,
} from "lucide-react";
import { WHATSAPP_ORDERS_LINK } from "@/lib/constants";

export default function BusinessTapPage() {
  const t = useTranslations("products.businessTap");

  const features = [
    { icon: Utensils, key: "digitalMenu" },
    { icon: Star, key: "googleReviews" },
    { icon: Smartphone, key: "tapToOrder" },
    { icon: Store, key: "businessProfile" },
  ];

  const services = [
    { icon: Utensils, key: "digitalMenu" },
    { icon: Star, key: "googleReviews" },
    { icon: Smartphone, key: "tapToOrder" },
    { icon: Store, key: "businessProfile" },
    { icon: Wifi, key: "wifiAccess" },
    { icon: CreditCard, key: "instaPay" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-28 pb-12 lg:pt-36 lg:pb-16 bg-gradient-to-b from-neon-green/5 via-matte-black to-matte-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-xs mb-6">
                <Store className="w-4 h-4" />
                <span>{t("badge")}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-light mb-6">{t("title")}</h1>
              <p className="text-slate-muted text-base md:text-lg leading-relaxed mb-8">{t("desc")}</p>

              <div className="mb-8 p-5 rounded-2xl glass bg-dark-card/60 border border-neon-green/20">
                <p className="text-sm text-slate-light font-semibold mb-3">
                  {t("customOrder")}
                </p>
                <a
                  href={WHATSAPP_ORDERS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20 hover:scale-105 active:scale-95 transition-all duration-200 text-sm font-semibold"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t("contactUs")}</span>
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {features.map(({ icon: Icon, key }) => (
                  <div key={key} className="flex items-center gap-3 p-3 rounded-xl bg-dark-card border border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-neon-green" />
                    </div>
                    <span className="text-sm text-slate-light">{t(`features.${key}`)}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="hidden lg:flex items-center justify-center"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-72 h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-green/20 to-neon-green/5 rounded-3xl rotate-6" />
                <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10">
                  <Image
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"
                    alt="Fine dining restaurant NFC tag"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-20 bg-matte-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-light mb-3">
                {t("title")}
              </h2>
              <p className="text-slate-muted text-sm">
                {t("servicesDesc")}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(({ icon: Icon, key }, index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="glass bg-dark-card/50 border border-white/5 rounded-2xl p-5 hover:border-neon-green/20 hover:bg-dark-card/70 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center mb-4 group-hover:bg-neon-green/20 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-neon-green" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-light mb-1">
                    {t(`services.${key}`)}
                  </h3>
                  <p className="text-xs text-slate-muted/70 leading-relaxed">
                    {t(`features.${key}`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


    </>
  );
}
