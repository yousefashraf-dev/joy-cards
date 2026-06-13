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

export default function NeonRedTrackProfile({ name, logo, buttons, iconMap }: ThemeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A0000] to-[#0D0000] flex flex-col items-center justify-center p-6">
      <motion.div
        className="w-full max-w-sm relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-2xl p-6 text-center border border-red-500/40 shadow-[0_0_30px_rgba(255,49,49,0.2)] bg-gradient-to-b from-[#1A0000] to-[#0D0000]">
          <motion.div
            className="flex justify-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="ring-2 ring-red-500/60 rounded-full p-0.5 shadow-[0_0_25px_rgba(255,49,49,0.35)]">
              {logo}
            </div>
          </motion.div>

          <motion.h1
            className="text-lg font-black text-white mb-5 uppercase tracking-[0.15em] drop-shadow-[0_0_8px_rgba(255,49,49,0.3)]"
            style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
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
                  className="flex flex-col items-center gap-2 p-3 border-2 border-red-500/50 bg-black/60 text-white hover:border-red-500 hover:shadow-[0_0_20px_rgba(255,49,49,0.35)] transition-all duration-300 group uppercase tracking-wider text-xs font-bold rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97, boxShadow: "0 0 25px rgba(255,49,49,0.5)" }}
                >
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                    <Icon className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-center text-xs font-bold tracking-wider">{btn.label}</span>
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
            <Link href="/" className="hover:text-red-500/60 transition-colors">
              Powered by Go Tap
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
