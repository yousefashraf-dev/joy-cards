"use client";

import { motion } from "framer-motion";
import type { ProfileButton } from "@/lib/types";

interface ThemeProps {
  name: string;
  logo: React.ReactNode;
  buttons: ProfileButton[];
  iconMap: Record<string, React.ElementType>;
}

export default function ClassicLuxuryProfile({ name, logo, buttons, iconMap }: ThemeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#0F172A] to-[#020617] flex flex-col items-center justify-center p-6">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-[#1E293B]/80 backdrop-blur-sm rounded-3xl p-8 border border-white/5 shadow-2xl text-center">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="ring-2 ring-nardo/30 rounded-full p-0.5">
              {logo}
            </div>
          </motion.div>

          <motion.h1
            className="text-2xl font-bold text-slate-light mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {name}
          </motion.h1>

          <div className="grid grid-cols-2 gap-2.5">
            {buttons.map((btn, i) => {
              const Icon = iconMap[btn.icon] || iconMap.Globe;
              return (
                <motion.a
                  key={btn.url}
                  href={btn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#0F172A] border border-nardo/20 text-slate-light hover:border-nardo/50 hover:glow-silver transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97, boxShadow: "0 0 20px rgba(122,122,122,0.25)" }}
                >
                  <div className="w-10 h-10 rounded-xl bg-nardo/10 flex items-center justify-center group-hover:bg-nardo/20 transition-colors">
                    <Icon className="w-5 h-5 text-nardo" />
                  </div>
                  <span className="text-center text-sm font-medium">{btn.label}</span>
                </motion.a>
              );
            })}
          </div>

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
