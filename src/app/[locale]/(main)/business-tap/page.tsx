"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Store, Utensils, Star, Smartphone, Wifi, CreditCard } from "lucide-react";
import BaseForm from "@/components/forms/BaseForm";
import FormC_BusinessTap from "@/components/forms/FormC_BusinessTap";

export default function BusinessTapPage() {
  const t = useTranslations("products.businessTap");

  const features = [
    { icon: Utensils, key: "digitalMenu" },
    { icon: Star, key: "googleReviews" },
    { icon: Smartphone, key: "tapToOrder" },
    { icon: Store, key: "businessProfile" },
  ];

  const marketingItems = [
    { icon: Utensils, text: "Place your complete menu on every table with a single tap" },
    { icon: Wifi, text: "Wi-Fi password sticker for instant guest access" },
    { icon: CreditCard, text: "InstaPay sticker for instant payment transfers" },
  ];

  const productSection = (
    <>
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

      <section className="py-8 lg:py-10 bg-matte-dark/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass bg-matte-card/60 border border-neon-green/20 rounded-2xl p-6 lg:p-8"
          >
            <h3 className="text-lg font-semibold text-neon-green mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              {t("marketing")}
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {marketingItems.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 p-3 rounded-xl bg-dark-card border border-white/5">
                  <div className="w-9 h-9 rounded-lg bg-neon-green/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-neon-green" />
                  </div>
                  <p className="text-xs text-slate-muted leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );

  return (
    <BaseForm
      productType="business-tap"
      productSection={productSection}
      specificFields={({ data, onChange, errors }) => (
        <FormC_BusinessTap data={data} onChange={onChange} errors={errors} />
      )}
    />
  );
}
