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

export default function LiquidAuroraProfile({ name, logo, buttons, iconMap }: ThemeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D001A] via-[#0D001A] to-[#001A1A] flex flex-col items-center justify-center p-6">
      <motion.div
        className="w-full max-w-sm relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(124,58,237,0.12)]"
          style={{ padding: "1px", background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(0,243,255,0.4))" }}
        >
          <div className="rounded-2xl p-6 text-center bg-gradient-to-br from-[#0D001A] via-[#0D001A] to-[#001A1A] backdrop-blur-2xl">
            <motion.div
              className="flex justify-center mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="ring-2 ring-purple-500/40 rounded-full p-0.5 shadow-[0_0_25px_rgba(124,58,237,0.2)]">
                {logo}
              </div>
            </motion.div>

            <motion.h1
              className="text-lg font-extralight text-white mb-5 tracking-[0.15em] uppercase drop-shadow-[0_0_6px_rgba(0,243,255,0.15)]"
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
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 text-white/90 hover:border-cyan/40 hover:shadow-[0_0_20px_rgba(0,243,255,0.15)] hover:bg-white/[0.06] transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97, boxShadow: "0 0 25px rgba(124,58,237,0.3)" }}
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-cyan/15 transition-colors">
                      <Icon className="w-5 h-5 text-cyan" />
                    </div>
                    <span className="text-center text-[11px] font-light tracking-wide uppercase">{btn.label}</span>
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
        </div>
      </motion.div>
    </div>
  );
}
