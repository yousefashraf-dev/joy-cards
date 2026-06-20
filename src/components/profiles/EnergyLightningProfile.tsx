"use client";

import { motion } from "framer-motion";
import type { ProfileButton } from "@/lib/types";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface ThemeProps {
  name: string;
  logo: React.ReactNode;
  buttons: ProfileButton[];
  iconMap: Record<string, React.ElementType>;
}

export default function EnergyLightningProfile({ name, logo, buttons, iconMap }: ThemeProps) {
  const t = useTranslations("products.profile");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1A237E]/40 to-[#0A0E27] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(0,243,255,0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(213,0,0,0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(26,35,126,0.3) 0%, transparent 70%)
          `,
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent opacity-50" />
      <div className="absolute top-1/4 -left-10 w-40 h-40 rounded-full bg-cyan/5 blur-3xl" />
      <div className="absolute bottom-1/4 -right-10 w-40 h-40 rounded-full bg-red-600/5 blur-3xl" />

      <motion.div
        className="w-full max-w-sm relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-2xl p-6 text-center border border-cyan/20 shadow-[0_0_40px_rgba(0,243,255,0.12),0_0_80px_rgba(0,243,255,0.06)] bg-gradient-to-b from-[#0F1440] via-[#1A237E]/30 to-[#0A0E27] backdrop-blur-sm">
          <motion.div
            className="flex justify-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="ring-2 ring-cyan/60 rounded-full p-0.5 shadow-[0_0_30px_rgba(0,243,255,0.35)]">
              {logo}
            </div>
          </motion.div>

          <motion.h1
            className="text-xl font-black text-white mb-2 uppercase tracking-[0.15em] drop-shadow-[0_0_12px_rgba(0,243,255,0.3)]"
            style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {name}
          </motion.h1>

          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-8 h-[2px] bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />
            <motion.span
              className="text-[9px] text-cyan/60 font-black tracking-[0.4em] uppercase"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              energy
            </motion.span>
            <span className="w-8 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
          </div>

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
                    className="flex items-center justify-between gap-3 w-full p-3 rounded-xl bg-white/[0.04] backdrop-blur-md border border-cyan/20 text-[#ECEFF1] hover:border-cyan/60 hover:shadow-[0_0_25px_rgba(0,243,255,0.3)] hover:bg-white/[0.08] transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97, boxShadow: "0 0 30px rgba(0,243,255,0.45)" }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan/20 to-red-600/10 flex items-center justify-center group-hover:from-cyan/30 group-hover:to-red-600/20 transition-all duration-300 shrink-0">
                      <Icon className="w-5 h-5 text-cyan" />
                    </div>
                    <span className="flex-1 text-center text-xs font-bold tracking-wider text-[#ECEFF1]">{btn.label}</span>
                    <span className="text-cyan/60 group-hover:text-cyan shrink-0">→</span>
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
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.04] backdrop-blur-md border border-cyan/20 text-[#ECEFF1] hover:border-cyan/60 hover:shadow-[0_0_25px_rgba(0,243,255,0.3)] hover:bg-white/[0.08] transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97, boxShadow: "0 0 25px rgba(0,243,255,0.45)" }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan/20 to-red-600/10 flex items-center justify-center group-hover:from-cyan/30 group-hover:to-red-600/20 transition-all duration-300">
                    <Icon className="w-5 h-5 text-cyan" />
                  </div>
                  <span className="text-center text-xs font-bold tracking-wider text-[#ECEFF1]">{btn.label}</span>
                </motion.a>
              );
            })}
          </div>
          )}

          {buttons.length === 0 && (
            <p className="text-cyan/40 text-xs">{t("noLinksAvailable")}</p>
          )}

          <motion.p
            className="mt-4 text-[10px] text-cyan/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link href="/" className="hover:text-cyan/60 transition-colors">
              {t("poweredBy")}
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
