"use client";

import { motion } from "framer-motion";
import type { ProfileButton } from "@/lib/types";

interface ThemeProps {
  name: string;
  logo: React.ReactNode;
  buttons: ProfileButton[];
  iconMap: Record<string, React.ElementType>;
}

export default function SportyCarbonProfile({ name, logo, buttons, iconMap }: ThemeProps) {
  return (
    <div className="min-h-screen carbon-fiber flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-b from-neon-green/5 via-transparent to-transparent pointer-events-none" />

      <motion.div
        className="w-full max-w-sm relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 border border-neon-green/20 shadow-2xl shadow-neon-green/10 text-center">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="ring-2 ring-neon-green/40 rounded-full p-0.5 shadow-lg shadow-neon-green/20">
              {logo}
            </div>
          </motion.div>

          <motion.h1
            className="text-2xl font-bold text-white mb-8 drop-shadow-[0_0_8px_rgba(57,255,20,0.3)]"
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
                    className="flex items-center justify-between gap-3 w-full p-3 rounded-lg bg-black/60 border border-neon-green/20 text-white hover:border-neon-green/50 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96, boxShadow: "0 0 25px rgba(57,255,20,0.35)" }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center group-hover:bg-neon-green/20 transition-colors shrink-0">
                      <Icon className="w-5 h-5 text-neon-green" />
                    </div>
                    <span className="flex-1 text-center text-sm font-semibold tracking-wide">{btn.label}</span>
                    <span className="text-neon-green/60 group-hover:text-neon-green shrink-0">→</span>
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
                  className="flex flex-col items-center gap-2 p-3 rounded-lg bg-black/60 border border-neon-green/20 text-white hover:border-neon-green/50 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96, boxShadow: "0 0 25px rgba(57,255,20,0.35)" }}
                >
                  <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center group-hover:bg-neon-green/20 transition-colors">
                    <Icon className="w-5 h-5 text-neon-green" />
                  </div>
                  <span className="text-center text-sm font-semibold tracking-wide">{btn.label}</span>
                </motion.a>
              );
            })}
          </div>
          )}

          {buttons.length === 0 && (
            <p className="text-slate-muted/60 text-sm">No links available</p>
          )}

          <motion.p
            className="mt-8 text-xs text-slate-muted/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Powered by GoTap
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
