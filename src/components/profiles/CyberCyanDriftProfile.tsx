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

export default function CyberCyanDriftProfile({ name, logo, buttons, iconMap }: ThemeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1A1A] to-[#001A1A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 30% 50%, rgba(0,243,255,0.3) 0%, transparent 60%)",
        }}
      />
      <motion.div
        className="w-full max-w-sm relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-2xl p-6 text-center border border-cyan/30 shadow-[0_0_30px_rgba(0,243,255,0.15)] bg-gradient-to-br from-[#0D1A1A] to-[#001A1A]">
          <motion.div
            className="flex justify-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="ring-2 ring-cyan/60 rounded-full p-0.5 shadow-[0_0_20px_rgba(0,243,255,0.25)]">
              {logo}
            </div>
          </motion.div>

          <motion.h1
            className="text-lg font-black text-white mb-5 uppercase tracking-[0.15em] drop-shadow-[0_0_8px_rgba(0,243,255,0.3)]"
            style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
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
                  className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/[0.04] backdrop-blur-md border border-cyan/20 text-white/90 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,243,255,0.25)] hover:bg-white/[0.08] transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97, boxShadow: "0 0 25px rgba(0,243,255,0.4)" }}
                >
                  <div className="w-8 h-8 rounded-full bg-cyan/15 flex items-center justify-center group-hover:bg-cyan/25 transition-colors">
                    <Icon className="w-4 h-4 text-cyan" />
                  </div>
                  <span className="flex-1 text-start text-xs font-bold tracking-wider">{btn.label}</span>
                  <span className="text-cyan/60 group-hover:text-cyan transition-colors">→</span>
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
            <Link href="/" className="hover:text-cyan/60 transition-colors">
              Powered by Go Tap
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
