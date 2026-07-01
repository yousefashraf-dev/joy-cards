"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Car, Droplets, Zap, Wind, Shield } from "lucide-react";
import type { AutoTapFormData } from "@/lib/types";
import { calcBasePrice } from "@/lib/pricing";
import AutoTapForm from "@/components/forms/AutoTapForm";

const INITIAL_DATA: AutoTapFormData = {
  customerName: "",
  phone: "",
  addressDetail: "",
  orderNotes: "",
  stickerType: "icon",
  selectedPlatform: "",
  usernameValue: "",
  socialLinks: {},
  logo: "",
  logoWidthCm: "",
  displayName: "",
  theme: "batman",
};

export default function AutoTapPage() {
  const t = useTranslations("products.autoTap");
  const tc = useTranslations("currency");
  const [formData, setFormData] = useState<AutoTapFormData>(INITIAL_DATA);

  const handleFieldChange = useCallback(
    (key: string, value: string | boolean | Record<string, string>) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSubmitComplete = useCallback(() => {
    setFormData(INITIAL_DATA);
  }, []);

  const features = [
    { icon: Droplets, key: "waterproof" },
    { icon: Zap, key: "instantConnect" },
    { icon: Wind, key: "weatherproof" },
    { icon: Car, key: "carIdentity" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-28 pb-12 lg:pt-36 lg:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-matte-black to-matte-black" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-nardo/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs mb-6">
                <Shield className="w-4 h-4" />
                <span>{t("badge")}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-light mb-6">
                {t("title")}
              </h1>
              <p className="text-slate-muted text-base md:text-lg leading-relaxed mb-8">
                {t("desc")}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {features.map(({ icon: Icon, key }) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <span className="text-sm text-slate-light">
                      {t(`features.${key}`)}
                    </span>
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
                <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-gold/5 rounded-3xl rotate-6" />
                <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(212,175,55,0.15)]">
                  <Image
                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80"
                    alt="Luxury car with NFC sticker"
                    fill
                    sizes="(max-width: 1024px) 0vw, 288px"
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Bar */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass bg-white/5 backdrop-blur-md border border-gold/30 rounded-2xl p-5 lg:p-6 text-center"
          >
            {formData.stickerType ? (
              <>
                <h2 className="text-2xl md:text-3xl font-bold text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.3)] mb-1">
                  {calcBasePrice(formData.stickerType)} {tc("egp")}
                </h2>
                <p className="text-xs text-slate-muted/60">{t("shippingLabel")}</p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.3)] mb-1">
                  {t("iconLabel")} 100 {tc("egp")} | {t("usernameLabel")} 150 {tc("egp")}
                </h2>
                <p className="text-xs text-slate-muted/60">{t("shippingLabel")}</p>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass bg-dark-card/50 border border-white/5 rounded-2xl p-6 lg:p-8">
              <AutoTapForm
                data={formData}
                onChange={handleFieldChange}
                onSubmitComplete={handleSubmitComplete}
              />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
