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

export default function GameOfThronesProfile({ name, logo, buttons, iconMap }: ThemeProps) {
  const t = useTranslations("products.profile");

  const bgItems = useMemo(() => generateScatter({
    count: 18,
    sources: ["/game of thronse.png", "/game of thronse2.png"],
    minSize: 50,
    maxSize: 130,
    opacity: 0.28,
  }), []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1C1C1C] via-[#2A2A2A] to-[#1A1A1A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {bgItems.map((item, i) => (
          <img
            key={i}
            src={item.src}
            alt=""
            className="absolute object-contain pointer-events-none"
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
        <div className="rounded-2xl p-6 text-center border border-[#B0B0B0]/20 shadow-[0_0_40px_rgba(192,192,192,0.08)] bg-black/50 backdrop-blur-md">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#C0C0C0]/30 to-transparent mx-auto mb-5" />

          <motion.div
            className="flex justify-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="ring-2 ring-[#C0C0C0]/30 rounded-full p-0.5 shadow-[0_0_20px_rgba(192,192,192,0.12)]">
              {logo}
            </div>
          </motion.div>

          <motion.h1
            className="text-xl font-bold text-[#F0F0F0] mb-5 tracking-widest uppercase drop-shadow-[0_0_4px_rgba(192,192,192,0.15)]"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
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
                    className="flex items-center justify-between gap-3 w-full p-3 rounded-lg bg-black/30 backdrop-blur border border-[#8a8a8a]/20 text-[#E8E8E8] hover:border-[#C0C0C0]/50 hover:shadow-[0_0_20px_rgba(192,192,192,0.15)] hover:bg-black/50 transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97, boxShadow: "0 0 20px rgba(192,192,192,0.2)" }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#8a8a8a]/20 flex items-center justify-center group-hover:bg-[#C0C0C0]/30 transition-all shrink-0">
                      <Icon className="w-5 h-5 text-[#C0C0C0]" />
                    </div>
                    <span className="flex-1 text-center text-xs font-bold text-[#E8E8E8]/90 truncate">{btn.label}</span>
                    <span className="text-[#8a8a8a]/60 group-hover:text-[#C0C0C0] shrink-0">→</span>
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
                  className="flex flex-col items-center gap-2 p-3 rounded-lg bg-black/30 backdrop-blur border border-[#8a8a8a]/20 text-[#E8E8E8] hover:border-[#C0C0C0]/50 hover:shadow-[0_0_20px_rgba(192,192,192,0.15)] hover:bg-black/50 transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97, boxShadow: "0 0 20px rgba(192,192,192,0.2)" }}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#8a8a8a]/20 flex items-center justify-center group-hover:bg-[#C0C0C0]/30 transition-all">
                    <Icon className="w-5 h-5 text-[#C0C0C0]" />
                  </div>
                  <span className="text-center text-xs font-bold text-[#E8E8E8]/90">{btn.label}</span>
                </motion.a>
              );
            })}
          </div>
          )}

          {buttons.length === 0 && (
            <p className="text-[#E8E8E8]/50 text-xs">{t("noLinksAvailable")}</p>
          )}

          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#C0C0C0]/30 to-transparent mx-auto mt-5" />

          <motion.p
            className="mt-4 text-[10px] text-[#E8E8E8]/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link href="/" className="hover:text-[#C0C0C0]/60 transition-colors">
              {t("poweredBy")}
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
