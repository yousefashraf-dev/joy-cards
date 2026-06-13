"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Crown, Flame, Sparkles, Shield, Zap } from "lucide-react";
import type { Theme, ProductType } from "@/lib/types";
import { PRODUCT_THEMES, ALL_THEMES } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  Crown, Flame, Sparkles, Shield, Zap,
};

interface ThemeSelectorProps {
  value: Theme;
  onChange: (theme: Theme) => void;
  productType: ProductType;
}

export default function ThemeSelector({ value, onChange, productType }: ThemeSelectorProps) {
  const t = useTranslations("products.forms.themeOptions");

  const productThemeIds = PRODUCT_THEMES[productType];
  const themes = productThemeIds
    .map((id) => ALL_THEMES.find((th) => th.id === id))
    .filter(Boolean);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {themes.map((theme) => {
        if (!theme) return null;
        const Icon = iconMap[theme.icon] || Crown;
        const isSelected = value === theme.id;
        const isLight = theme.id === "neon-drift" || theme.id === "cyber-cafe" || theme.id === "midnight-slate" || theme.id === "cyber-cyan-drift";

        return (
          <motion.button
            key={theme.id}
            type="button"
            onClick={() => onChange(theme.id)}
            className={`glass relative rounded-xl p-5 text-left transition-all duration-300 ${
              isLight ? `${theme.gradient} text-slate-800` : `${theme.gradient} text-white`
            } ${
              isSelected
                ? `${theme.border} border-2 shadow-lg ${theme.border === "border-nardo" ? "glow-silver" : theme.border === "border-neon-green" ? "glow-neon" : theme.border === "border-cyan" ? "glow-cyan" : "shadow-slate-400/30"}`
                : "border border-white/10 hover:border-white/30"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Icon className={`w-5 h-5 ${isLight ? "text-slate-600" : "text-nardo"}`} />
              <span className="font-semibold text-sm">{t(`${theme.id}`)}</span>
            </div>
            <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-muted"}`}>
              {t(`${theme.id}Desc`)}
            </p>
            {isSelected && (
              <div className="absolute top-2 end-2 w-5 h-5 rounded-full bg-nardo flex items-center justify-center">
                <span className="text-matte-dark text-xs font-bold">✓</span>
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
