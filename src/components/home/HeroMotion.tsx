"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Smartphone, ArrowDown } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function HeroMotion() {
  const t = useTranslations("hero");

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-gold/10 via-matte-black to-matte-black" />
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gold/15 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* NFC Glowing Circle + Smartphone Animation */}
        <div className="flex items-center justify-center gap-8 md:gap-16 mb-12 h-64">
          {/* NFC Circle */}
          <motion.div
            className="relative w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="absolute inset-0 rounded-full bg-gold/20 animate-pulse shadow-[0_0_60px_rgba(198,165,104,0.3)]" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-[0_0_40px_rgba(198,165,104,0.5)]">
              <span className="text-matte-dark font-black text-2xl md:text-3xl tracking-wider">NFC</span>
            </div>
          </motion.div>

          {/* Smartphone SVG Mockup */}
          <motion.div
            className="relative w-24 h-48 md:w-28 md:h-56"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-[0_0_30px_rgba(198,165,104,0.2)]">
              <rect x="5" y="5" width="90" height="190" rx="12" fill="#1A1A1A" stroke="rgba(198,165,104,0.3)" strokeWidth="2" />
              <rect x="12" y="14" width="76" height="155" rx="2" fill="#0D0D0D" />
              {/* Screen content - initially dim, lights up on contact */}
              <motion.g
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2.2 }}
              >
                {/* Screen glow effect */}
                <motion.rect
                  x="12" y="14" width="76" height="155" rx="2"
                  fill="rgba(198,165,104,0.05)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.15, 0.05, 0.1] }}
                  transition={{ duration: 1, delay: 2.2, repeat: Infinity, repeatDelay: 3 }}
                />
                {/* Status bar */}
                <rect x="18" y="20" width="64" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
                <circle cx="72" cy="23" r="2" fill="rgba(198,165,104,0.6)" />
                {/* App icon */}
                <circle cx="50" cy="55" r="12" fill="rgba(198,165,104,0.2)" stroke="rgba(198,165,104,0.4)" strokeWidth="1" />
                <text x="50" y="59" textAnchor="middle" fill="#D4AF37" fontSize="10" fontWeight="bold" fontFamily="sans-serif">G</text>
                {/* App name */}
                <text x="50" y="80" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="6" fontFamily="sans-serif">GoTap</text>
                {/* Pulsing NFC indicator */}
                <motion.circle
                  cx="50" cy="105" r="8"
                  fill="none" stroke="rgba(198,165,104,0.5)" strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, delay: 2.2, repeat: Infinity }}
                />
                <text x="50" y="108" textAnchor="middle" fill="rgba(198,165,104,0.6)" fontSize="5" fontFamily="sans-serif">NFC</text>
                {/* Bottom bar */}
                <rect x="35" y="158" width="30" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
              </motion.g>
              {/* Home button */}
              <circle cx="50" cy="180" r="5" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            </svg>
          </motion.div>
        </div>

        {/* Pop-up text after touch */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 2.5, ease: "backOut" }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass bg-gold/10 border border-gold/30 shadow-[0_0_30px_rgba(198,165,104,0.2)]">
            <span className="text-gradient-gold font-bold text-lg md:text-xl">
              {t("tagline")}
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-light leading-tight mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          {t("headline")}
        </motion.h1>

        <motion.p
          className="text-slate-muted text-lg md:text-xl max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          {t("subheadline")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
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
          transition={{ duration: 1, delay: 1.5 }}
        >
          <ArrowDown className="w-6 h-6 text-slate-muted/40 mx-auto animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
