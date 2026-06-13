"use client";

import { motion } from "framer-motion";
import type { ProfileButton } from "@/lib/types";
import Link from "next/link";

interface ThemeProps {
  name: string;
  logo: React.ReactNode;
  buttons: ProfileButton[];
  iconMap: Record<string, React.ElementType>;
}

export default function NardoStealthProfile({ name, logo, buttons, iconMap }: ThemeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1A1A] via-[#1A1A1A] to-[#0D0D0D] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 end-0 w-32 h-32 bg-nardo/[0.03] rounded-full -me-16 -mt-16" />
      <div className="absolute bottom-0 start-0 w-24 h-24 bg-white/[0.02] rounded-full -ms-12 -mb-12" />
      <motion.div
        className="w-full max-w-sm relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-2xl p-6 text-center bg-white/[0.03] backdrop-blur-2xl border border-nardo/20 shadow-xl">
          <motion.div
            className="flex justify-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="ring-2 ring-nardo/30 rounded-full p-0.5 shadow-[0_0_20px_rgba(192,192,192,0.12)]">
              {logo}
            </div>
          </motion.div>

          <motion.h1
            className="text-xl font-semibold text-white mb-5 tracking-wide"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 500 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {name}
          </motion.h1>

          <div className="space-y-2.5">
            {buttons.map((btn, i) => {
              const Icon = iconMap[btn.icon] || iconMap.Globe;
              return (
                <motion.a
                  key={btn.url}
                  href={btn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full p-3 rounded-full bg-white/[0.04] backdrop-blur border border-nardo/15 text-slate-light hover:border-nardo/40 hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(192,192,192,0.1)] transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97, boxShadow: "0 0 20px rgba(192,192,192,0.2)" }}
                >
                  <div className="w-8 h-8 rounded-full bg-nardo/10 flex items-center justify-center group-hover:bg-nardo/20 transition-colors">
                    <Icon className="w-4 h-4 text-nardo" />
                  </div>
                  <span className="flex-1 text-start text-xs font-medium text-slate-muted group-hover:text-slate-light">{btn.label}</span>
                  <span className="text-nardo/40 group-hover:text-nardo transition-colors">→</span>
                </motion.a>
              );
            })}
          </div>

          {buttons.length === 0 && (
            <p className="text-slate-muted/50 text-xs">No links available</p>
          )}

          <motion.p
            className="mt-4 text-[10px] text-slate-muted/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link href="/" className="hover:text-nardo/60 transition-colors">
              Powered by Go Tap
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
