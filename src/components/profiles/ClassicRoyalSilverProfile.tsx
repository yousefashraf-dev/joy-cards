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

export default function ClassicRoyalSilverProfile({ name, logo, buttons, iconMap }: ThemeProps) {
  const t = useTranslations("products.profile");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1A1A] to-[#222222] flex flex-col items-center justify-center p-6">
      <motion.div
        className="w-full max-w-sm relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-2xl p-6 text-center border border-silver/20 shadow-[0_0_30px_rgba(192,192,192,0.06)] bg-gradient-to-b from-[#1A1A1A] to-[#222222]">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-silver/30 to-transparent mx-auto mb-5" />

          <motion.div
            className="flex justify-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="border-2 border-silver/25 rounded-full p-0.5 shadow-[0_0_18px_rgba(192,192,192,0.1)]">
              {logo}
            </div>
          </motion.div>

          <motion.h1
            className="text-lg mb-5 tracking-wide text-slate-light"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 600 }}
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
                    className="flex items-center justify-between gap-3 w-full p-3 rounded-md border border-silver/15 bg-[#1E1E1E] text-slate-light hover:border-silver/40 hover:bg-[#252525] transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97, boxShadow: "0 0 20px rgba(192,192,192,0.15)" }}
                  >
                    <div className="w-10 h-10 rounded-full bg-silver/10 flex items-center justify-center group-hover:bg-silver/20 transition-colors shrink-0">
                      <Icon className="w-5 h-5 text-silver" />
                    </div>
                    <span className="flex-1 text-center text-xs font-medium tracking-wide">{btn.label}</span>
                    <span className="text-silver/40 group-hover:text-silver shrink-0">→</span>
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
                  className="flex flex-col items-center gap-2 p-3 rounded-md border border-silver/15 bg-[#1E1E1E] text-slate-light hover:border-silver/40 hover:bg-[#252525] transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97, boxShadow: "0 0 20px rgba(192,192,192,0.15)" }}
                >
                  <div className="w-10 h-10 rounded-full bg-silver/10 flex items-center justify-center group-hover:bg-silver/20 transition-colors">
                    <Icon className="w-5 h-5 text-silver" />
                  </div>
                  <span className="text-center text-xs font-medium tracking-wide">{btn.label}</span>
                </motion.a>
              );
            })}
          </div>
          )}

          {buttons.length === 0 && (
            <p className="text-slate-muted/50 text-xs">{t("noLinksAvailable")}</p>
          )}

          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-silver/30 to-transparent mx-auto mt-5" />

          <motion.p
            className="mt-4 text-[10px] text-slate-muted/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link href="/" className="hover:text-silver/60 transition-colors">
              {t("poweredBy")}
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
