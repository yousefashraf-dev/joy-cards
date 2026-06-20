"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ProfileButton } from "@/lib/types";

interface ThemeProps {
  name: string;
  logo: React.ReactNode;
  buttons: ProfileButton[];
  iconMap: Record<string, React.ElementType>;
}

export default function MinimalistCleanProfile({ name, logo, buttons, iconMap }: ThemeProps) {
  const t = useTranslations("products.profile");
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center p-6">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-white rounded-sm p-8 border border-slate-200 shadow-sm text-center">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="ring-1 ring-slate-200 rounded-full p-0.5">
              {logo}
            </div>
          </motion.div>

          <motion.h1
            className="text-2xl font-bold text-slate-800 mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {name}
          </motion.h1>

          {buttons.length === 1 ? (
            <div className="space-y-2">
              {buttons.map((btn) => {
                const Icon = iconMap[btn.icon] || iconMap.Globe;
                return (
                  <motion.a
                    key={btn.url}
                    href={btn.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 w-full p-3 rounded-sm border border-slate-200 text-slate-700 hover:border-slate-400 hover:shadow-sm transition-all duration-200 group"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97, boxShadow: "0 0 15px rgba(148,163,184,0.2)" }}
                  >
                    <div className="w-10 h-10 rounded-sm bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors shrink-0">
                      <Icon className="w-5 h-5 text-slate-500" />
                    </div>
                    <span className="flex-1 text-center text-sm font-medium text-slate-600">{btn.label}</span>
                    <span className="text-slate-400 group-hover:text-slate-600 shrink-0">→</span>
                  </motion.a>
                );
              })}
            </div>
          ) : (
          <div className="grid grid-cols-2 gap-2">
            {buttons.map((btn, i) => {
              const Icon = iconMap[btn.icon] || iconMap.Globe;
              return (
                <motion.a
                  key={btn.url}
                  href={btn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 rounded-sm border border-slate-200 text-slate-700 hover:border-slate-400 hover:shadow-sm transition-all duration-200 group"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97, boxShadow: "0 0 15px rgba(148,163,184,0.2)" }}
                >
                  <div className="w-10 h-10 rounded-sm bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    <Icon className="w-5 h-5 text-slate-500" />
                  </div>
                  <span className="text-center text-sm font-medium text-slate-600">{btn.label}</span>
                </motion.a>
              );
            })}
          </div>
          )}

          {buttons.length === 0 && (
            <p className="text-slate-400 text-sm">{t("noLinksAvailable")}</p>
          )}

          <motion.p
            className="mt-8 text-xs text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {t("poweredBy")}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
