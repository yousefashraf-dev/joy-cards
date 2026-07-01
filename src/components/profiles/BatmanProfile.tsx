"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { ProfileButton } from "@/lib/types";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { generateScatter } from "@/lib/scatterBackground";

interface ThemeProps {
  name: string;
  logo: React.ReactNode;
  buttons: ProfileButton[];
  iconMap: Record<string, React.ElementType>;
}

export default function BatmanProfile({ name, logo, buttons, iconMap }: ThemeProps) {
  const t = useTranslations("products.profile");

  const bgItems = useMemo(() => generateScatter({
    count: 18,
    sources: ["/Batman-removebg-preview.png"],
    minSize: 40,
    maxSize: 90,
    opacity: 0.30,
  }), []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {bgItems.map((item, i) => (
          <img
            key={i}
            src={item.src}
            alt=""
            className="absolute object-contain pointer-events-none filter brightness-0 invert-[0.85] sepia-[1] saturate-[5000%] hue-rotate-[15deg]"
            style={{ top: item.top, left: item.left, ...item.style }}
          />
        ))}
      </div>

      <motion.div
        className="w-full max-w-sm relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-2xl p-6 text-center bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <motion.div
            className="flex justify-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="ring-2 ring-yellow-400/60 rounded-full p-0.5 shadow-[0_0_25px_rgba(250,204,21,0.2)]">
              {logo}
            </div>
          </motion.div>

          <motion.h1
            className="text-xl font-black text-white mb-5 uppercase tracking-[0.15em]"
            style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {name}
          </motion.h1>

          {buttons.length === 1 ? (
            <div className="space-y-2.5">
              {buttons.map((btn) => {
                const Icon = iconMap[btn.icon] || iconMap.Globe;
                return (
                  <motion.a
                    key={btn.url}
                    href={btn.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 w-full p-3 rounded-xl bg-white/[0.04] backdrop-blur border border-white/10 text-white/90 hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(250,204,21,0.15)] hover:bg-white/[0.08] transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97, boxShadow: "0 0 20px rgba(250,204,21,0.2)" }}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors shrink-0">
                      <Icon className="w-5 h-5 text-white/80 group-hover:text-yellow-400" />
                    </div>
                    <span className="flex-1 text-center text-xs font-bold text-white/80 group-hover:text-white truncate">{btn.label}</span>
                    <span className="text-white/30 group-hover:text-yellow-400 shrink-0">→</span>
                  </motion.a>
                );
              })}
            </div>
          ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {buttons.map((btn, i) => {
              const Icon = iconMap[btn.icon] || iconMap.Globe;
              return (
                <motion.a
                  key={btn.url}
                  href={btn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.04] backdrop-blur border border-white/10 text-white/90 hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(250,204,21,0.15)] hover:bg-white/[0.08] transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97, boxShadow: "0 0 20px rgba(250,204,21,0.2)" }}
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors">
                    <Icon className="w-5 h-5 text-white/80 group-hover:text-yellow-400" />
                  </div>
                  <span className="text-center text-xs font-bold text-white/80 group-hover:text-white">{btn.label}</span>
                </motion.a>
              );
            })}
          </div>
          )}

          {buttons.length === 0 && (
            <p className="text-white/40 text-xs">{t("noLinksAvailable")}</p>
          )}

          <motion.p
            className="mt-4 text-[10px] text-white/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link href="/" className="hover:text-yellow-400/60 transition-colors">
              {t("poweredBy")}
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
