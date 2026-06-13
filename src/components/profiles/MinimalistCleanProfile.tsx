"use client";

import { motion } from "framer-motion";
import type { ProfileButton } from "@/lib/types";

interface ThemeProps {
  name: string;
  logo: React.ReactNode;
  buttons: ProfileButton[];
  iconMap: Record<string, React.ElementType>;
}

export default function MinimalistCleanProfile({ name, logo, buttons, iconMap }: ThemeProps) {
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

          <div className="space-y-2">
            {buttons.map((btn, i) => {
              const Icon = iconMap[btn.icon] || iconMap.Globe;
              return (
                <motion.a
                  key={btn.url}
                  href={btn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 w-full p-3.5 rounded-sm border border-slate-200 text-slate-700 hover:border-slate-400 hover:shadow-sm transition-all duration-200 group"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="w-9 h-9 rounded-sm bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    <Icon className="w-4 h-4 text-slate-500" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-start text-slate-600">{btn.label}</span>
                  <span className="text-slate-300 group-hover:text-slate-500 transition-colors text-sm">→</span>
                </motion.a>
              );
            })}
          </div>

          {buttons.length === 0 && (
            <p className="text-slate-400 text-sm">No links available</p>
          )}

          <motion.p
            className="mt-8 text-xs text-slate-400"
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
