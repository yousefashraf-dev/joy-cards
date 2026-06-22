"use client";

import { useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Camera, ThumbsUp, Music2, Ghost, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Theme, AutoTapFormData } from "@/lib/types";
import { PLATFORM_OPTIONS, PRODUCT_THEMES } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  Instagram: Camera,
  Facebook: ThumbsUp,
  TikTok: Music2,
  Snapchat: Ghost,
  MessageCircle,
  Phone,
};

interface AutoTapPreviewProps {
  data: AutoTapFormData;
  onThemeChange: (theme: Theme) => void;
}

export default function AutoTapPreview({ data, onThemeChange }: AutoTapPreviewProps) {
  const t = useTranslations("products.forms");
  const tp = useTranslations("products.profile");

  const autoTapThemes = PRODUCT_THEMES["auto-tap"];
  const currentIndex = useMemo(
    () => Math.max(0, autoTapThemes.indexOf(data.theme)),
    [autoTapThemes, data.theme]
  );

  const goPrev = useCallback(() => {
    if (currentIndex > 0) onThemeChange(autoTapThemes[currentIndex - 1]);
  }, [currentIndex, autoTapThemes, onThemeChange]);

  const goNext = useCallback(() => {
    if (currentIndex < autoTapThemes.length - 1) onThemeChange(autoTapThemes[currentIndex + 1]);
  }, [currentIndex, autoTapThemes, onThemeChange]);

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

  const batmanBgLogos = useMemo(() => [
    { top: '3%', left: '3%', size: 'w-10', rotate: '-rotate-12' },
    { top: '2%', left: '75%', size: 'w-12', rotate: 'rotate-45' },
    { top: '18%', left: '2%', size: 'w-14', rotate: 'rotate-[60deg]' },
    { top: '15%', left: '78%', size: 'w-18', rotate: '-rotate-45' },
    { top: '35%', left: '3%', size: 'w-12', rotate: 'rotate-[110deg]' },
    { top: '32%', left: '80%', size: 'w-10', rotate: '-rotate-[30deg]' },
    { top: '55%', left: '4%', size: 'w-18', rotate: 'rotate-[25deg]' },
    { top: '52%', left: '76%', size: 'w-14', rotate: '-rotate-[70deg]' },
    { top: '73%', left: '10%', size: 'w-12', rotate: '-rotate-[80deg]' },
    { top: '70%', left: '72%', size: 'w-10', rotate: 'rotate-[15deg]' },
  ], []);

  const spiderBgWebs = useMemo(() => [
    { top: '4%', left: '4%', size: 'w-20', rotate: '-rotate-12' },
    { top: '3%', left: '72%', size: 'w-24', rotate: 'rotate-45' },
    { top: '20%', left: '3%', size: 'w-16', rotate: 'rotate-[60deg]' },
    { top: '18%', left: '74%', size: 'w-28', rotate: '-rotate-45' },
    { top: '38%', left: '5%', size: 'w-24', rotate: 'rotate-[110deg]' },
    { top: '35%', left: '70%', size: 'w-20', rotate: '-rotate-[30deg]' },
    { top: '55%', left: '4%', size: 'w-32', rotate: 'rotate-[25deg]' },
    { top: '52%', left: '68%', size: 'w-28', rotate: '-rotate-[70deg]' },
    { top: '70%', left: '8%', size: 'w-16', rotate: '-rotate-[80deg]' },
    { top: '68%', left: '72%', size: 'w-24', rotate: 'rotate-[15deg]' },
    { top: '82%', left: '35%', size: 'w-20', rotate: '-rotate-[55deg]' },
  ], []);

  const renderLinks = (singleClass: string, multipleClass: string, linkClass: string, iconClass: string, textClass: string, arrowClass: string) => {
    if (effectiveLinks.length === 0) {
      return (
        <p className="text-xs text-slate-muted/50 text-center">
          {t("preview.noLinksAdded")}
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

    if (effectiveLinks.length === 1) {
      const link = effectiveLinks[0];
      const Icon = iconMap[link.icon] || Camera;
      return (
        <div className="space-y-2.5">
          <motion.a
            key={link.label}
            href="#"
            className={singleClass}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={iconClass}>
              <Icon className="w-4 h-4" />
            </div>
            <span className={textClass}>{link.label}</span>
            <span className={arrowClass}>→</span>
          </motion.a>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-3">
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
      <div className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden ${ringClass}`}>
        {data.logo ? (
          <Image src={data.logo} alt="Logo" width={96} height={96} className="w-full h-full object-cover rounded-full" unoptimized />
        ) : (
          <span className={`text-2xl font-bold ${ringClass.includes("cyan") ? "text-cyan" : ringClass.includes("red") ? "text-red-500" : ringClass.includes("nardo") ? "text-nardo/50" : ringClass.includes("silver") ? "text-silver/60" : "text-white/60"} drop-shadow-[0_0_6px_rgba(0,243,255,0.5)]`}>
            {data.customerName ? data.customerName.charAt(0).toUpperCase() : "?"}
          </span>
        )}
      </div>
    </div>
  );

  const arrowBtn =
    "w-10 h-10 rounded-full glass bg-dark-card/80 border border-white/10 flex items-center justify-center text-slate-muted hover:text-slate-light hover:border-nardo/40 hover:bg-white/10 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-dark-card/80 disabled:hover:border-white/10 disabled:hover:text-slate-muted shrink-0";

  return (
    <div dir="ltr">
      <div className="float-card bg-white/[0.03] border border-white/10 p-6">
        <p className="text-xs text-slate-muted/60 text-center mb-4">
          {t("helper.previewGuide")}
        </p>

        <div className="relative flex items-center max-sm:justify-center">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentIndex === 0}
            className={`${arrowBtn} max-sm:absolute max-sm:left-2 max-sm:top-1/2 max-sm:-translate-y-1/2 max-sm:z-20 max-sm:bg-dark-card/90 max-sm:backdrop-blur-sm`}
            aria-label={t("preview.previousTheme")}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0 max-sm:w-[88%] max-sm:max-w-[320px] max-sm:flex-initial max-sm:mx-auto">
            <motion.div
              key={themeId}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              {/* Theme 1: Batman */}
              {themeId === "batman" && (
                <div className="rounded-2xl p-6 text-center bg-neutral-950 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                  {/* Batman logos repeated in background - 10 scattered logos */}
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    {batmanBgLogos.map((item, i) => (
                      <Image
                        key={i}
                        src="/Batman-removebg-preview.png"
                        alt=""
                        width={72}
                        height={72}
                        className={`absolute opacity-30 ${item.size} ${item.rotate} filter brightness-0 invert-[0.85] sepia-[1] saturate-[5000%] hue-rotate-[15deg]`}
                        style={{ top: item.top, left: item.left }}
                        unoptimized
                      />
                    ))}
                  </div>
                  <div className="relative z-10">
                    {avatarCircle("ring-2 ring-white/60 shadow-[0_0_20px_rgba(255,255,255,0.12)]")}
                    <div className="flex justify-center mb-3">
                      <Image src="/Batman-removebg-preview.png" alt="Batman" width={64} height={64} className="w-16 h-16 object-contain filter brightness-0 invert-[0.85] sepia-[1] saturate-[5000%] hue-rotate-[15deg] drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]" unoptimized />
                    </div>
                    <h3 className="text-xl font-black text-white mb-5 uppercase tracking-[0.15em]"
                      style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
                    >
                      {data.displayName || data.customerName || "YOUR NAME"}
                    </h3>
                    {renderLinks(
                      "flex items-center gap-3 w-full p-3 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/10 text-white/90 hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(250,204,21,0.15)] hover:bg-white/[0.08] transition-all duration-300 group",
                      "flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/10 text-white/90 hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(250,204,21,0.15)] hover:bg-white/[0.08] transition-all duration-300 group min-w-0",
                      "flex items-center gap-3 w-full p-3 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/10 text-white/90 hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(250,204,21,0.15)] hover:bg-white/[0.08] transition-all duration-300 group",
                      "w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors",
                      "flex-1 text-start text-xs font-bold text-white/80 group-hover:text-white truncate min-w-0",
                      "text-white/30 group-hover:text-yellow-400"
                    )}
                  </div>
                </div>
              )}

              {/* Theme 2: Spider-Man */}
              {themeId === "spiderman" && (
                <div className="rounded-2xl p-6 text-center bg-gradient-to-br from-red-700 via-slate-900 to-blue-900 border border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.2)] relative overflow-hidden">
                  {/* Spider web 1 (spider-removebg-preview) - 4 corners + Spider web 2 (spider_2-removebg-preview) - 11 scattered */}
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <Image src="/spider-removebg-preview.png" alt="" width={112} height={112} className="absolute -top-8 -right-8 w-28 h-28 opacity-30 rotate-12" unoptimized />
                    <Image src="/spider-removebg-preview.png" alt="" width={112} height={112} className="absolute -bottom-8 -left-8 w-28 h-28 opacity-30 -rotate-12" unoptimized />
                    <Image src="/spider-removebg-preview.png" alt="" width={112} height={112} className="absolute -top-8 -left-8 w-28 h-28 opacity-30 -rotate-[30deg]" unoptimized />
                    <Image src="/spider-removebg-preview.png" alt="" width={112} height={112} className="absolute -bottom-8 -right-8 w-28 h-28 opacity-30 rotate-[30deg]" unoptimized />
                    {spiderBgWebs.map((item, i) => (
                      <Image
                        key={i}
                        src="/spider_2-removebg-preview.png"
                        alt=""
                        width={128}
                        height={128}
                        className={`absolute opacity-25 ${item.size} ${item.rotate}`}
                        style={{ top: item.top, left: item.left }}
                        unoptimized
                      />
                    ))}
                  </div>
                  <div className="relative z-10">
                    {avatarCircle("ring-2 ring-red-500/60 shadow-[0_0_25px_rgba(220,38,38,0.35)]")}
                    <h3 className="text-xl font-black text-white mb-5 uppercase tracking-[0.1em] drop-shadow-[0_0_8px_rgba(220,38,38,0.3)]"
                      style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
                    >
                      {data.displayName || data.customerName || "YOUR NAME"}
                    </h3>
                    {renderLinks(
                      "flex items-center gap-3 w-full p-3 rounded-xl bg-white/[0.04] backdrop-blur-md border border-red-500/30 text-white/95 hover:border-blue-500/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:bg-white/[0.08] transition-all duration-300 group"
                        + (isSingle ? "" : ""),
                      "flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/[0.04] backdrop-blur-md border border-red-500/30 text-white/95 hover:border-blue-500/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:bg-white/[0.08] transition-all duration-300 group min-w-0",
                      "flex items-center gap-3 w-full p-3 rounded-xl bg-white/[0.04] backdrop-blur-md border border-red-500/30 text-white/95 hover:border-blue-500/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:bg-white/[0.08] transition-all duration-300 group",
                      "w-8 h-8 rounded-full bg-gradient-to-br from-red-500/20 to-blue-500/20 flex items-center justify-center group-hover:from-red-500/30 group-hover:to-blue-500/30 transition-all duration-300",
                      "flex-1 text-start text-xs font-bold text-white/90 truncate min-w-0",
                      "text-red-400/60 group-hover:text-blue-400"
                    )}
                  </div>
                </div>
              )}

              {/* Theme 3: Energy Lightning */}
              {themeId === "energy-lightning" && (
                <div className="rounded-2xl p-6 text-center bg-gradient-to-b from-[#0F1440] via-[#1A237E]/30 to-[#0A0E27] border border-cyan/20 shadow-[0_0_40px_rgba(0,243,255,0.12),0_0_80px_rgba(0,243,255,0.06)] relative overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.15]"
                    style={{
                      backgroundImage: `radial-gradient(circle at 20% 20%, rgba(0,243,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(213,0,0,0.15) 0%, transparent 50%)`,
                    }}
                  />
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent opacity-50" />
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent opacity-50" />
                  <div className="absolute top-1/4 -left-10 w-40 h-40 rounded-full bg-cyan/5 blur-3xl" />
                  <div className="absolute bottom-1/4 -right-10 w-40 h-40 rounded-full bg-red-600/5 blur-3xl" />
                  <div className="relative z-10">
                    {avatarCircle("ring-2 ring-cyan/60 shadow-[0_0_30px_rgba(0,243,255,0.35)]")}
                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-[0.15em] drop-shadow-[0_0_12px_rgba(0,243,255,0.3)]"
                      style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
                    >
                      {data.displayName || data.customerName || "YOUR NAME"}
                    </h3>
                    <div className="flex items-center justify-center gap-3 mb-5">
                      <span className="w-8 h-[2px] bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />
                      <span className="text-[9px] text-cyan/60 font-black tracking-[0.4em] uppercase">energy</span>
                      <span className="w-8 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                    </div>
                    {renderLinks(
                      "flex items-center gap-3 w-full p-3 rounded-xl bg-white/[0.04] backdrop-blur-md border border-cyan/20 text-[#ECEFF1] hover:border-cyan/60 hover:shadow-[0_0_25px_rgba(0,243,255,0.3)] hover:bg-white/[0.08] transition-all duration-300 group"
                        + (isSingle ? "" : ""),
"flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/[0.04] backdrop-blur-md border border-cyan/20 text-[#ECEFF1] hover:border-cyan/60 hover:shadow-[0_0_25px_rgba(0,243,255,0.3)] hover:bg-white/[0.08] transition-all duration-300 group min-w-0",
"flex items-center gap-3 w-full p-3 rounded-xl bg-white/[0.04] backdrop-blur-md border border-cyan/20 text-[#ECEFF1] hover:border-cyan/60 hover:shadow-[0_0_25px_rgba(0,243,255,0.3)] hover:bg-white/[0.08] transition-all duration-300 group",
                    "w-8 h-8 rounded-full bg-gradient-to-br from-cyan/20 to-red-600/10 flex items-center justify-center group-hover:from-cyan/30 group-hover:to-red-600/20 transition-all duration-300",
                    "flex-1 text-start text-xs font-bold text-[#ECEFF1] truncate min-w-0",
                    "text-cyan/60 group-hover:text-cyan"
                  )}
                  </div>
                </div>
              )}

              {/* Theme 4: Neon Red Track */}
              {themeId === "neon-red-track" && (
                <div className="rounded-2xl p-6 text-center border border-red-500/40 bg-gradient-to-b from-[#1A0000] to-[#0D0000] shadow-[0_0_30px_rgba(255,49,49,0.2)]">
                  {avatarCircle("ring-2 ring-red-500/60 shadow-[0_0_25px_rgba(255,49,49,0.35)]")}
                  <h3 className="text-xl font-black text-white mb-5 uppercase tracking-[0.15em] drop-shadow-[0_0_8px_rgba(255,49,49,0.3)]"
                    style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
                  >
                    {data.displayName || data.customerName || "YOUR NAME"}
                  </h3>
                  {renderLinks(
                    "flex items-center gap-3 w-full p-3 border-2 border-red-500/50 bg-black/60 text-white hover:border-red-500 hover:shadow-[0_0_20px_rgba(255,49,49,0.35)] transition-all duration-300 group uppercase tracking-wider text-xs font-bold"
                      + (isSingle ? " rounded-lg" : ""),
                    "flex flex-col items-center gap-1.5 p-2.5 border-2 border-red-500/50 bg-black/60 text-white hover:border-red-500 hover:shadow-[0_0_20px_rgba(255,49,49,0.35)] transition-all duration-300 group uppercase tracking-wider text-[10px] font-bold rounded-lg min-w-0"
                      + (!isSingle ? "" : ""),
                    "flex items-center gap-3 w-full p-3 border-2 border-red-500/50 bg-black/60 text-white hover:border-red-500 hover:shadow-[0_0_20px_rgba(255,49,49,0.35)] transition-all duration-300 group uppercase tracking-wider text-xs font-bold rounded-lg",
                    "w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors",
                    "flex-1 text-start text-xs font-bold truncate min-w-0",
                    "text-red-500/60 group-hover:text-red-500"
                  )}
                </div>
              )}

              {/* Theme 5: Cyber Cyan Drift */}
              {themeId === "cyber-cyan-drift" && (
                <div className="rounded-2xl p-6 text-center bg-gradient-to-br from-[#0D1A1A] to-[#001A1A] border border-cyan/30 shadow-[0_0_30px_rgba(0,243,255,0.15)] relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `radial-gradient(circle at 30% 50%, rgba(0,243,255,0.3) 0%, transparent 60%)`,
                    }}
                  />
                  <div className="relative z-10">
                    {avatarCircle("ring-2 ring-cyan/60 shadow-[0_0_20px_rgba(0,243,255,0.25)]")}
                    <h3 className="text-xl font-black text-white mb-5 uppercase tracking-[0.15em] drop-shadow-[0_0_8px_rgba(0,243,255,0.3)]"
                      style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
                    >
                      {data.displayName || data.customerName || "YOUR NAME"}
                    </h3>
                    {renderLinks(
                      "flex items-center gap-3 w-full p-3 rounded-xl bg-white/[0.04] backdrop-blur-md border border-cyan/20 text-white/90 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,243,255,0.25)] hover:bg-white/[0.08] transition-all duration-300 group"
                        + (isSingle ? "" : ""),
                      "flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/[0.04] backdrop-blur-md border border-cyan/20 text-white/90 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,243,255,0.25)] hover:bg-white/[0.08] transition-all duration-300 group min-w-0",
                      "flex items-center gap-3 w-full p-3 rounded-xl bg-white/[0.04] backdrop-blur-md border border-cyan/20 text-white/90 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,243,255,0.25)] hover:bg-white/[0.08] transition-all duration-300 group",
                      "w-8 h-8 rounded-full bg-cyan/15 flex items-center justify-center group-hover:bg-cyan/25 transition-colors",
                      "flex-1 text-start text-xs font-bold truncate min-w-0",
                      "text-cyan/60 group-hover:text-cyan"
                    )}
                  </div>
                </div>
              )}

              {/* Theme 6: Nardo Stealth Luxury */}
              {themeId === "auto-nardo-stealth" && (
                <div className="rounded-2xl p-6 text-center bg-white/[0.03] backdrop-blur-2xl border border-nardo/20 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 end-0 w-32 h-32 bg-nardo/[0.03] rounded-full -me-16 -mt-16" />
                  <div className="absolute bottom-0 start-0 w-24 h-24 bg-white/[0.02] rounded-full -ms-12 -mb-12" />
                  <div className="relative z-10">
                    {avatarCircle("ring-2 ring-nardo/30 shadow-[0_0_20px_rgba(192,192,192,0.12)]")}
                    <h3 className="text-xl font-semibold text-white mb-5 tracking-wide"
                      style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 500 }}
                    >
                      {data.displayName || data.customerName || "Your Name"}
                    </h3>
                    {renderLinks(
                      "flex items-center gap-3 w-full p-3 rounded-full bg-white/[0.04] backdrop-blur border border-nardo/15 text-slate-light hover:border-nardo/40 hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(192,192,192,0.1)] transition-all duration-300 group"
                        + (isSingle ? "" : ""),
                      "flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/[0.04] backdrop-blur border border-nardo/15 text-slate-light hover:border-nardo/40 hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(192,192,192,0.1)] transition-all duration-300 group min-w-0",
                      "flex items-center gap-3 w-full p-3 rounded-full bg-white/[0.04] backdrop-blur border border-nardo/15 text-slate-light hover:border-nardo/40 hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(192,192,192,0.1)] transition-all duration-300 group",
                    "w-8 h-8 rounded-full bg-nardo/10 flex items-center justify-center group-hover:bg-nardo/20 transition-colors",
                    "flex-1 text-start text-xs font-medium text-slate-muted group-hover:text-slate-light truncate min-w-0",
                    "text-nardo/40 group-hover:text-nardo"
                  )}
                </div>
              </div>
              )}

              {/* Theme 7: Classic Royal Silver */}
              {themeId === "classic-royal-silver" && (
                <div className="rounded-2xl p-6 text-center border border-silver/20 bg-gradient-to-b from-[#1A1A1A] to-[#222222] shadow-[0_0_30px_rgba(192,192,192,0.06)]">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-silver/30 to-transparent mx-auto mb-5" />
                  {avatarCircle("border-2 border-silver/25 shadow-[0_0_18px_rgba(192,192,192,0.1)]")}
                  <h3 className="text-xl mb-5 tracking-wide text-slate-light"
                    style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 600 }}
                  >
                    {data.displayName || data.customerName || "Your Name"}
                  </h3>
                  {renderLinks(
                    "flex items-center gap-3 w-full p-3 rounded-md border border-silver/15 bg-[#1E1E1E] text-slate-light hover:border-silver/40 hover:bg-[#252525] transition-all duration-300 group"
                      + (isSingle ? "" : ""),
"flex flex-col items-center gap-1.5 p-2.5 rounded-md border border-silver/15 bg-[#1E1E1E] text-slate-light hover:border-silver/40 hover:bg-[#252525] transition-all duration-300 group min-w-0",
"flex items-center gap-3 w-full p-3 rounded-md border border-silver/15 bg-[#1E1E1E] text-slate-light hover:border-silver/40 hover:bg-[#252525] transition-all duration-300 group",
                    "w-8 h-8 rounded-full bg-silver/10 flex items-center justify-center group-hover:bg-silver/20 transition-colors",
                    "flex-1 text-start text-xs font-medium truncate min-w-0"
                      + (isSingle ? "" : " text-center"),
                    "text-silver/30 group-hover:text-silver"
                  )}
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-silver/30 to-transparent mx-auto mt-5" />
                </div>
              )}

              {/* Theme 8: Liquid Aurora */}
              {themeId === "liquid-aurora" && (
                <div className="rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(124,58,237,0.12)]"
                  style={{ padding: "1px", background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(0,243,255,0.4))" }}
                >
                  <div className="rounded-2xl p-6 text-center bg-gradient-to-br from-[#0D001A] via-[#0D001A] to-[#001A1A] backdrop-blur-2xl">
                    {avatarCircle("ring-2 ring-purple-500/40 shadow-[0_0_25px_rgba(124,58,237,0.2)]")}
                    <h3 className="text-xl font-extralight text-white mb-5 tracking-[0.15em] uppercase drop-shadow-[0_0_6px_rgba(0,243,255,0.15)]">
                      {data.displayName || data.customerName || "your name"}
                    </h3>
                    {renderLinks(
                      "flex items-center gap-3 w-full p-3 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 text-white/90 hover:border-cyan/40 hover:shadow-[0_0_20px_rgba(0,243,255,0.15)] hover:bg-white/[0.06] transition-all duration-300 group"
                        + (isSingle ? "" : ""),
"flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 text-white/90 hover:border-cyan/40 hover:shadow-[0_0_20px_rgba(0,243,255,0.15)] hover:bg-white/[0.06] transition-all duration-300 group min-w-0",
"flex items-center gap-3 w-full p-3 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 text-white/90 hover:border-cyan/40 hover:shadow-[0_0_20px_rgba(0,243,255,0.15)] hover:bg-white/[0.06] transition-all duration-300 group",
                    "w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-cyan/15 transition-colors",
                    "flex-1 text-start text-[11px] font-light truncate min-w-0 uppercase",
                    "text-cyan/40 group-hover:text-cyan"
                  )}
                </div>
              </div>
              )}

              {/* Theme 9: Terminal Dark Glow */}
              {themeId === "terminal-dark-glow" && (
                <div className="rounded-2xl p-6 text-center bg-gradient-to-b from-[#0A0A0F] to-[#0F172A] border border-cyan/20 shadow-[0_0_30px_rgba(0,243,255,0.12)]">
                  <p className="font-mono text-[10px] text-white/30 tracking-[0.2em] mb-4">
                    GOTAP.EG TERMINAL
                  </p>
                  {avatarCircle("ring-2 ring-cyan/60 shadow-[0_0_25px_rgba(0,243,255,0.3)]")}
                  <h3 className="text-xl font-bold text-white mb-5 tracking-wide">
                    {data.displayName || data.customerName || "USER"}
                  </h3>
                  {renderLinks(
                    "flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.03] backdrop-blur-md border border-cyan/20 text-white/90 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,243,255,0.25)] hover:bg-white/[0.06] transition-all duration-300 group"
                      + (isSingle ? "" : ""),
"flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-cyan/20 text-white/90 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,243,255,0.25)] hover:bg-white/[0.06] transition-all duration-300 group min-w-0",
"flex items-center gap-3 w-full p-3 rounded-xl bg-white/[0.03] backdrop-blur-md border border-cyan/20 text-white/90 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,243,255,0.25)] hover:bg-white/[0.06] transition-all duration-300 group",
                    "w-8 h-8 rounded-full bg-cyan/15 flex items-center justify-center group-hover:bg-cyan/25 transition-colors",
                    "flex-1 text-start text-xs font-mono font-bold truncate min-w-0",
                    "text-cyan/60 group-hover:text-cyan"
                  )}
                  <div className="mt-4 pt-3 border-t border-cyan/10">
                    <p className="text-[10px] text-cyan/50 font-mono tracking-widest">POWERED BY GOTAP.EG</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={currentIndex === autoTapThemes.length - 1}
            className={`${arrowBtn} max-sm:absolute max-sm:right-2 max-sm:top-1/2 max-sm:-translate-y-1/2 max-sm:z-20 max-sm:bg-dark-card/90 max-sm:backdrop-blur-sm`}
            aria-label={t("preview.nextTheme")}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {autoTapThemes.map((th, i) => (
            <button
              key={th}
              type="button"
              onClick={() => onThemeChange(th)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "bg-nardo w-5"
                  : "bg-white/20 hover:bg-white/40"
              }`}
              aria-label={t("preview.themeDot", { number: String(i + 1) })}
            />
          ))}
        </div>
      </div>

      {/* Powered by GoTap */}
      <div className="mt-3 text-center">
        <Link
          href="/"
          className="text-[10px] text-slate-muted/40 hover:text-cyan/60 transition-colors duration-200"
        >
          {tp("poweredBy")}
        </Link>
      </div>
    </div>
  );
}
