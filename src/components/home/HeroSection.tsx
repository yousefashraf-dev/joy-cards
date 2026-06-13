"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowDown, Smartphone, Zap } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function HeroSection() {
  const t = useTranslations("hero");

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-nardo/5 via-matte-black to-matte-black" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nardo/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-nardo/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nardo/10 border border-nardo/20 text-nardo text-sm mb-8">
            <Zap className="w-4 h-4" />
            <span>NFC Technology</span>
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-light leading-tight mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {t("headline")}
        </motion.h1>

        <motion.p
          className="text-slate-muted text-lg md:text-xl max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          {t("subheadline")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <PrimaryButton onClick={scrollToProducts}>
            <Smartphone className="w-5 h-5" />
            {t("cta")}
          </PrimaryButton>
        </motion.div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <ArrowDown className="w-6 h-6 text-slate-muted/40 mx-auto animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
