"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Car, Droplets, Zap, Wind, Info } from "lucide-react";
import type { AutoTapFormData, Theme } from "@/lib/types";
import AutoTapForm from "@/components/forms/AutoTapForm";
import AutoTapPreview from "@/components/forms/AutoTapPreview";

const INITIAL_DATA: AutoTapFormData = {
  customerName: "",
  phone: "",
  addressDetail: "",
  orderNotes: "",
  profileType: "single",
  selectedPlatform: "",
  singlePlatformValue: "",
  socialLinks: {},
  logo: "",
  logoWidthCm: "",
  stickerName: "",
  displayName: "",
  theme: "neon-red-track",
};

export default function AutoTapPage() {
  const t = useTranslations("products.autoTap");
  const p = useTranslations("products.pricing");
  const at = useTranslations("products.autoTap");
  const [formData, setFormData] = useState<AutoTapFormData>(INITIAL_DATA);

  const handleFieldChange = useCallback(
    (key: string, value: string | boolean | Record<string, string>) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleThemeChange = useCallback(
    (theme: Theme) => {
      setFormData((prev) => ({ ...prev, theme }));
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
      {/* Pricing Disclaimer */}
      <section className="pt-28 pb-4 lg:pt-36 lg:pb-6 bg-gradient-to-b from-neon-green/5 via-matte-black to-matte-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass bg-matte-card/60 border border-nardo/20 rounded-2xl p-5 lg:p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-nardo" />
              <h2 className="text-sm font-bold text-nardo uppercase tracking-wider">
                {p("title")}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-green" />
                  <p className="text-slate-light font-medium">{p("single")}</p>
                </div>
                <p className="text-xs text-slate-muted/70 ps-4">{p("singleDesign")}</p>
                <p className="text-xs text-nardo/70 ps-4">+ {p("shippingCairo")}</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-green" />
                  <p className="text-slate-light font-medium">{p("multiple")}</p>
                </div>
                <p className="text-xs text-slate-muted/70 ps-4">{p("multipleDesign")}</p>
                <p className="text-xs text-nardo/70 ps-4">+ {p("shippingCairo")}</p>
              </div>
              <div className="flex items-center">
                <p className="text-xs text-nardo/80 font-medium">{p("duration")}</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-muted/40 mt-2">{p("disclaimer")}</p>
            <p className="text-[10px] text-white/30 mt-1">
              <span className="text-nardo/60">★</span>{" "}
              {at("windowNotice")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="pb-12 lg:pb-16 bg-gradient-to-b from-neon-green/5 via-matte-black to-matte-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-xs mb-6">
                <Car className="w-4 h-4" />
                <span>{at("badge")}</span>
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
                    className="flex items-center gap-3 p-3 rounded-xl bg-dark-card border border-white/5"
                  >
                    <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-neon-green" />
                    </div>
                    <span className="text-sm text-slate-light">
                      {at(`features.${key}`)}
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
                <div className="absolute inset-0 bg-gradient-to-br from-neon-green/20 to-neon-green/5 rounded-3xl rotate-6" />
                <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10">
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

      {/* Form + Preview Section */}
      <section className="py-12 lg:py-16 bg-matte-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid lg:grid-cols-5 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Mobile Preview (above form on small screens) */}
            <div className="lg:hidden lg:col-span-2 order-first">
              <AutoTapPreview data={formData} onThemeChange={handleThemeChange} />
            </div>

            {/* Form */}
            <div className="lg:col-span-3 glass bg-dark-card/50 border border-white/5 rounded-2xl p-6 lg:p-8">
              <AutoTapForm
                data={formData}
                onChange={handleFieldChange}
                onSubmitComplete={handleSubmitComplete}
              />
            </div>

            {/* Desktop Preview (right side, sticky) */}
            <div className="hidden lg:block lg:col-span-2">
              <AutoTapPreview data={formData} onThemeChange={handleThemeChange} />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
