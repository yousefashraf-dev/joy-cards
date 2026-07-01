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

export default function SpidermanProfile({ name, logo, buttons, iconMap }: ThemeProps) {
  const t = useTranslations("products.profile");

  const cornerItems = useMemo(() => [
    { top: "-8%", left: "-5%", className: "absolute w-32 h-32 max-sm:w-20 max-sm:h-20 rotate-12 opacity-45 max-sm:opacity-20 object-contain" },
    { top: "auto", bottom: "-8%", left: "-5%", className: "absolute w-32 h-32 max-sm:w-20 max-sm:h-20 -rotate-12 opacity-45 max-sm:opacity-20 object-contain" },
    { top: "-8%", right: "-5%", className: "absolute w-32 h-32 max-sm:w-20 max-sm:h-20 -rotate-[30deg] opacity-45 max-sm:opacity-20 object-contain" },
    { top: "auto", bottom: "-8%", right: "-5%", className: "absolute w-32 h-32 max-sm:w-20 max-sm:h-20 rotate-[30deg] opacity-45 max-sm:opacity-20 object-contain" },
  ], []);

  const smallItems = useMemo(() => generateScatter({
    count: 16,
    sources: ["/spider_2-removebg-preview.png"],
    minSize: 40,
    maxSize: 80,
    opacity: 0.28,
  }), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 via-slate-900 to-blue-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {cornerItems.map((item, i) => (
          <img key={`c-${i}`} src="/spider-removebg-preview.png" alt="" className={item.className}
            style={{ top: item.top, left: item.left, right: item.right as string | undefined, bottom: item.bottom as string | undefined } as React.CSSProperties} />
        ))}
        {smallItems.map((item, i) => (
          <img key={`s-${i}`} src={item.src} alt="" className="absolute object-contain pointer-events-none" style={{ top: item.top, left: item.left, ...item.style }} />
        ))}
      </div>

      <motion.div
        className="w-full max-w-sm relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-2xl p-6 text-center border border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.2)] bg-black/40 backdrop-blur-md">
          <motion.div
            className="flex justify-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="ring-2 ring-red-500/60 rounded-full p-0.5 shadow-[0_0_25px_rgba(220,38,38,0.35)]">
              {logo}
            </div>
          </motion.div>

          <motion.h1
            className="text-xl font-black text-white mb-5 uppercase tracking-[0.1em] drop-shadow-[0_0_8px_rgba(220,38,38,0.3)]"
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
                    className="flex items-center justify-between gap-3 w-full p-3 rounded-xl bg-white/[0.04] backdrop-blur-md border border-red-500/30 text-white/95 hover:border-blue-500/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:bg-white/[0.08] transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97, boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/20 to-blue-500/20 flex items-center justify-center group-hover:from-red-500/30 group-hover:to-blue-500/30 transition-all shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="flex-1 text-center text-xs font-bold text-white/90 truncate">{btn.label}</span>
                    <span className="text-red-400/60 group-hover:text-blue-400 shrink-0">→</span>
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
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.04] backdrop-blur-md border border-red-500/30 text-white/95 hover:border-blue-500/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:bg-white/[0.08] transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97, boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/20 to-blue-500/20 flex items-center justify-center group-hover:from-red-500/30 group-hover:to-blue-500/30 transition-all">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-center text-xs font-bold text-white/90">{btn.label}</span>
                </motion.a>
              );
            })}
          </div>
          )}

          {buttons.length === 0 && (
            <p className="text-white/50 text-xs">{t("noLinksAvailable")}</p>
          )}

          <motion.p
            className="mt-4 text-[10px] text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link href="/" className="hover:text-blue-400/60 transition-colors">
              {t("poweredBy")}
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
