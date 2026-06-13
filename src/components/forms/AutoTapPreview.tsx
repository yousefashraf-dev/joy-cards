"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Crown, Flame, Zap, Camera, ThumbsUp, Music2, Ghost, MessageCircle, Phone, Shield, Droplets } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Theme, AutoTapFormData } from "@/lib/types";
import { PLATFORM_OPTIONS } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  Instagram: Camera,
  Facebook: ThumbsUp,
  TikTok: Music2,
  Snapchat: Ghost,
  MessageCircle,
  Phone,
};

const themeButtons: { theme: Theme; icon: React.ElementType; label: string }[] = [
  { theme: "cyber-cyan-drift", icon: Zap, label: "Cyber Cyan Drift" },
  { theme: "neon-red-track", icon: Flame, label: "Neon Red Track" },
  { theme: "auto-nardo-stealth", icon: Shield, label: "Nardo Stealth Luxury" },
  { theme: "classic-royal-silver", icon: Crown, label: "Classic Royal Silver" },
  { theme: "liquid-aurora", icon: Droplets, label: "Liquid Aurora" },
];

interface AutoTapPreviewProps {
  data: AutoTapFormData;
  onThemeChange: (theme: Theme) => void;
}

export default function AutoTapPreview({ data, onThemeChange }: AutoTapPreviewProps) {
  const t = useTranslations("products.forms");

  const effectiveLinks: { icon: string; label: string; url: string }[] = [];

  if (data.profileType === "single" && data.selectedPlatform && data.singlePlatformValue) {
    const platform = PLATFORM_OPTIONS.find((p) => p.id === data.selectedPlatform);
    if (platform) {
      effectiveLinks.push({ icon: platform.icon, label: platform.label, url: "#" });
    }
  } else if (data.profileType === "multiple") {
    for (const [id, val] of Object.entries(data.socialLinks)) {
      if (val.trim()) {
        const platform = PLATFORM_OPTIONS.find((p) => p.id === id);
        effectiveLinks.push({ icon: platform?.icon || "Globe", label: platform?.label || id, url: "#" });
      }
    }
  }

  const themeId = data.theme;
  const isSingle = data.profileType === "single";

  const renderLinks = (singleClass: string, multipleClass: string, linkClass: string, iconClass: string, textClass: string, arrowClass: string) => {
    if (effectiveLinks.length === 0) {
      return (
        <p className="text-xs text-slate-muted/50 text-center">
          No links added yet
        </p>
      );
    }

    if (isSingle) {
      return (
        <div className="space-y-2.5">
          {effectiveLinks.map((link, i) => {
            const Icon = iconMap[link.icon] || Camera;
            return (
              <motion.a
                key={`${link.label}-${i}`}
                href="#"
                className={singleClass}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={iconClass}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={textClass}>{link.label}</span>
                <span className={arrowClass}>→</span>
              </motion.a>
            );
          })}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-2">
        {effectiveLinks.map((link, i) => {
          const Icon = iconMap[link.icon] || Camera;
          return (
            <motion.a
              key={`${link.label}-${i}`}
              href="#"
              className={multipleClass}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className={iconClass}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={textClass}>{link.label}</span>
            </motion.a>
          );
        })}
      </div>
    );
  };

  const avatarCircle = (ringClass: string) => (
    <div className="flex justify-center mb-4">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center overflow-hidden ${ringClass}`}>
        {data.logo ? (
          <Image src={data.logo} alt="Logo" width={80} height={80} className="w-full h-full object-cover rounded-full" unoptimized />
        ) : (
          <span className={`text-xl font-bold ${ringClass.includes("cyan") ? "text-cyan" : ringClass.includes("red") ? "text-red-500" : ringClass.includes("nardo") ? "text-nardo/50" : ringClass.includes("silver") ? "text-silver/60" : "text-white/60"} drop-shadow-[0_0_6px_rgba(0,243,255,0.5)]`}>
            {data.customerName ? data.customerName.charAt(0).toUpperCase() : "?"}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="lg:sticky lg:top-24 lg:self-start" dir="ltr">
      <div className="float-card bg-white/[0.03] border border-white/10 p-5">
        <p className="text-xs text-slate-muted/60 text-center mb-3">
          {t("helper.previewGuide")}
        </p>

        <div className="flex gap-2 mb-5 justify-center flex-wrap">
          {themeButtons.map(({ theme, icon: Icon, label }) => (
            <motion.button
              key={theme}
              type="button"
              onClick={() => onThemeChange(theme)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                data.theme === theme
                  ? "bg-cyan/15 border border-cyan/40 text-cyan shadow-[0_0_12px_rgba(0,243,255,0.2)]"
                  : "bg-white/5 border border-white/10 text-slate-muted hover:border-white/30"
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </motion.button>
          ))}
        </div>

        <motion.div
          key={themeId}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Theme 1: Cyber Cyan Drift — Ultra-modern floating glass with cyan neon */}
          {themeId === "cyber-cyan-drift" && (
            <div className="rounded-2xl p-6 text-center bg-gradient-to-br from-[#0D1A1A] to-[#001A1A] border border-cyan/30 shadow-[0_0_30px_rgba(0,243,255,0.15)] relative overflow-hidden">
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 30% 50%, rgba(0,243,255,0.3) 0%, transparent 60%)`,
                }}
              />
              <div className="relative z-10">
                {avatarCircle("ring-2 ring-cyan/60 shadow-[0_0_20px_rgba(0,243,255,0.25)]")}
                <h3 className="text-lg font-black text-white mb-5 uppercase tracking-[0.15em] drop-shadow-[0_0_8px_rgba(0,243,255,0.3)]"
                  style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
                >
                  {data.stickerName || data.customerName || "YOUR NAME"}
                </h3>
                {renderLinks(
                  "flex items-center gap-3 w-full p-3 rounded-xl bg-white/[0.04] backdrop-blur-md border border-cyan/20 text-white/90 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,243,255,0.25)] hover:bg-white/[0.08] transition-all duration-300 group"
                    + (isSingle ? "" : ""),
                  "flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/[0.04] backdrop-blur-md border border-cyan/20 text-white/90 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,243,255,0.25)] hover:bg-white/[0.08] transition-all duration-300 group",
                  "flex items-center gap-3 w-full p-3 rounded-xl bg-white/[0.04] backdrop-blur-md border border-cyan/20 text-white/90 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,243,255,0.25)] hover:bg-white/[0.08] transition-all duration-300 group",
                  "w-8 h-8 rounded-full bg-cyan/15 flex items-center justify-center group-hover:bg-cyan/25 transition-colors",
                  "flex-1 text-start text-xs font-bold tracking-wider",
                  "text-cyan/60 group-hover:text-cyan"
                )}
              </div>
            </div>
          )}

          {/* Theme 2: Neon Red Track — High-contrast aggressive performance */}
          {themeId === "neon-red-track" && (
            <div className="rounded-2xl p-6 text-center border border-red-500/40 bg-gradient-to-b from-[#1A0000] to-[#0D0000] shadow-[0_0_30px_rgba(255,49,49,0.2)]">
              {avatarCircle("ring-2 ring-red-500/60 shadow-[0_0_25px_rgba(255,49,49,0.35)]")}
              <h3 className="text-lg font-black text-white mb-5 uppercase tracking-[0.15em] drop-shadow-[0_0_8px_rgba(255,49,49,0.3)]"
                style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
              >
                {data.stickerName || data.customerName || "YOUR NAME"}
              </h3>
              {renderLinks(
                "flex items-center gap-3 w-full p-3 border-2 border-red-500/50 bg-black/60 text-white hover:border-red-500 hover:shadow-[0_0_20px_rgba(255,49,49,0.35)] transition-all duration-300 group uppercase tracking-wider text-xs font-bold"
                  + (isSingle ? " rounded-lg" : ""),
                "flex flex-col items-center gap-1.5 p-2.5 border-2 border-red-500/50 bg-black/60 text-white hover:border-red-500 hover:shadow-[0_0_20px_rgba(255,49,49,0.35)] transition-all duration-300 group uppercase tracking-wider text-[10px] font-bold rounded-lg"
                  + (!isSingle ? "" : ""),
                "flex items-center gap-3 w-full p-3 border-2 border-red-500/50 bg-black/60 text-white hover:border-red-500 hover:shadow-[0_0_20px_rgba(255,49,49,0.35)] transition-all duration-300 group uppercase tracking-wider text-xs font-bold rounded-lg",
                "w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors",
                "flex-1 text-start text-xs font-bold tracking-wider",
                "text-red-500/60 group-hover:text-red-500"
              )}
            </div>
          )}

          {/* Theme 3: Nardo Stealth Luxury — Nardo Grey borders, frosted glass, minimal */}
          {themeId === "auto-nardo-stealth" && (
            <div className="rounded-2xl p-6 text-center bg-white/[0.03] backdrop-blur-2xl border border-nardo/20 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 end-0 w-32 h-32 bg-nardo/[0.03] rounded-full -me-16 -mt-16" />
              <div className="absolute bottom-0 start-0 w-24 h-24 bg-white/[0.02] rounded-full -ms-12 -mb-12" />
              <div className="relative z-10">
                {avatarCircle("ring-2 ring-nardo/30 shadow-[0_0_20px_rgba(192,192,192,0.12)]")}
                <h3 className="text-xl font-semibold text-white mb-5 tracking-wide"
                  style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 500 }}
                >
                  {data.stickerName || data.customerName || "Your Name"}
                </h3>
                {renderLinks(
                  "flex items-center gap-3 w-full p-3 rounded-full bg-white/[0.04] backdrop-blur border border-nardo/15 text-slate-light hover:border-nardo/40 hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(192,192,192,0.1)] transition-all duration-300 group"
                    + (isSingle ? "" : ""),
                  "flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/[0.04] backdrop-blur border border-nardo/15 text-slate-light hover:border-nardo/40 hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(192,192,192,0.1)] transition-all duration-300 group",
                  "flex items-center gap-3 w-full p-3 rounded-full bg-white/[0.04] backdrop-blur border border-nardo/15 text-slate-light hover:border-nardo/40 hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(192,192,192,0.1)] transition-all duration-300 group",
                  "w-8 h-8 rounded-full bg-nardo/10 flex items-center justify-center group-hover:bg-nardo/20 transition-colors",
                  "flex-1 text-start text-xs font-medium text-slate-muted group-hover:text-slate-light",
                  "text-nardo/40 group-hover:text-nardo"
                )}
              </div>
            </div>
          )}

          {/* Theme 4: Classic Royal Silver — Timeless metallic, serif fonts */}
          {themeId === "classic-royal-silver" && (
            <div className="rounded-2xl p-6 text-center border border-silver/20 bg-gradient-to-b from-[#1A1A1A] to-[#222222] shadow-[0_0_30px_rgba(192,192,192,0.06)]">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-silver/30 to-transparent mx-auto mb-5" />
              {avatarCircle("border-2 border-silver/25 shadow-[0_0_18px_rgba(192,192,192,0.1)]")}
              <h3 className="text-lg mb-5 tracking-wide text-slate-light"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 600 }}
              >
                {data.stickerName || data.customerName || "Your Name"}
              </h3>
              {renderLinks(
                "flex items-center gap-3 w-full p-3 rounded-md border border-silver/15 bg-[#1E1E1E] text-slate-light hover:border-silver/40 hover:bg-[#252525] transition-all duration-300 group"
                  + (isSingle ? "" : ""),
                "flex flex-col items-center gap-1.5 p-2.5 rounded-md border border-silver/15 bg-[#1E1E1E] text-slate-light hover:border-silver/40 hover:bg-[#252525] transition-all duration-300 group",
                "flex items-center gap-3 w-full p-3 rounded-md border border-silver/15 bg-[#1E1E1E] text-slate-light hover:border-silver/40 hover:bg-[#252525] transition-all duration-300 group",
                "w-8 h-8 rounded-full bg-silver/10 flex items-center justify-center group-hover:bg-silver/20 transition-colors",
                "flex-1 text-start text-xs font-medium tracking-wide"
                  + (isSingle ? "" : " text-center"),
                "text-silver/30 group-hover:text-silver"
              )}
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-silver/30 to-transparent mx-auto mt-5" />
            </div>
          )}

          {/* Theme 5: Liquid Aurora — Purple-to-cyan gradient, fluid glass */}
          {themeId === "liquid-aurora" && (
            <div className="rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(124,58,237,0.12)]"
              style={{ padding: "1px", background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(0,243,255,0.4))" }}
            >
              <div className="rounded-2xl p-6 text-center bg-gradient-to-br from-[#0D001A] via-[#0D001A] to-[#001A1A] backdrop-blur-2xl">
                {avatarCircle("ring-2 ring-purple-500/40 shadow-[0_0_25px_rgba(124,58,237,0.2)]")}
                <h3 className="text-lg font-extralight text-white mb-5 tracking-[0.15em] uppercase drop-shadow-[0_0_6px_rgba(0,243,255,0.15)]">
                  {data.stickerName || data.customerName || "your name"}
                </h3>
                {renderLinks(
                  "flex items-center gap-3 w-full p-3 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 text-white/90 hover:border-cyan/40 hover:shadow-[0_0_20px_rgba(0,243,255,0.15)] hover:bg-white/[0.06] transition-all duration-300 group"
                    + (isSingle ? "" : ""),
                  "flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 text-white/90 hover:border-cyan/40 hover:shadow-[0_0_20px_rgba(0,243,255,0.15)] hover:bg-white/[0.06] transition-all duration-300 group",
                  "flex items-center gap-3 w-full p-3 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 text-white/90 hover:border-cyan/40 hover:shadow-[0_0_20px_rgba(0,243,255,0.15)] hover:bg-white/[0.06] transition-all duration-300 group",
                  "w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-cyan/15 transition-colors",
                  "flex-1 text-start text-[11px] font-light tracking-wide uppercase",
                  "text-cyan/40 group-hover:text-cyan"
                )}
              </div>
            </div>
          )}

          {/* Powered by GoTap */}
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-[10px] text-slate-muted/40 hover:text-cyan/60 transition-colors duration-200"
            >
              Powered by Go Tap
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
