"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  Phone,
  MessageCircle,
  Globe,
  Wifi,
  Copy,
  Check,
  X,
  Music2,
  Send,
} from "lucide-react";
import { getCafeBySlug } from "@/lib/cafe-schema";
import type { Cafe } from "@/lib/cafe-schema";
import { CAFE_THEMES } from "@/lib/cafe-themes";
import type { CafeTheme } from "@/lib/cafe-themes";

function CoffeeCupSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="160" rx="75" ry="14" stroke="currentColor" strokeWidth="2"/>
      <ellipse cx="100" cy="160" rx="55" ry="10" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <path d="M45 80 C45 145, 50 152, 100 152 C150 152, 155 145, 155 80 Z" stroke="currentColor" strokeWidth="2"/>
      <ellipse cx="100" cy="80" rx="55" ry="12" stroke="currentColor" strokeWidth="2"/>
      <path d="M155 98 C185 98, 185 135, 155 135" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M78 58 C74 42, 90 32, 82 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <path d="M100 52 C105 38, 92 28, 100 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
      <path d="M120 58 C124 44, 110 34, 118 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.25"/>
    </svg>
  );
}

function PlateCutlerySvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="130" rx="85" ry="22" stroke="currentColor" strokeWidth="1.5"/>
      <ellipse cx="100" cy="130" rx="60" ry="15" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <ellipse cx="100" cy="130" rx="35" ry="9" stroke="currentColor" strokeWidth="0.8" opacity="0.3"/>
      <path d="M68 50 L68 115" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M58 50 L58 35 M63 50 L63 32 M68 50 L68 30 M73 50 L73 32 M78 50 L78 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M58 35 C58 28, 78 28, 78 35" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M120 55 L120 115" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M110 55 C110 28, 130 28, 130 55" stroke="currentColor" strokeWidth="2"/>
      <line x1="110" y1="47" x2="130" y2="47" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function FlowerSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 100 C100 130, 95 160, 85 185" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M98 130 C80 120, 70 135, 85 145" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M96 150 C112 140, 120 155, 108 165" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M100 100 C60 75, 50 50, 75 35 C95 25, 110 35, 115 45" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M100 100 C140 75, 150 50, 125 35 C105 25, 90 35, 85 45" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M100 100 C55 110, 30 95, 40 70 C50 50, 70 50, 80 60" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M100 100 C145 110, 170 95, 160 70 C150 50, 130 50, 120 60" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M100 100 C85 80, 75 65, 90 55 C100 48, 110 55, 110 65" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M100 100 C115 80, 125 65, 110 55 C100 48, 90 55, 90 65" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="100" cy="78" r="8" stroke="currentColor" strokeWidth="1"/>
      <circle cx="100" cy="78" r="3" stroke="currentColor" strokeWidth="0.8"/>
    </svg>
  );
}

function VapeSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="75" y="100" width="50" height="65" rx="6" stroke="currentColor" strokeWidth="2"/>
      <rect x="70" y="140" width="60" height="4" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="78" y="100" width="44" height="8" rx="4" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="88" y="88" width="24" height="14" rx="4" stroke="currentColor" strokeWidth="2"/>
      <circle cx="100" cy="125" r="6" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="100" cy="113" r="2.5" fill="currentColor" opacity="0.5"/>
      <path d="M100 88 C100 72, 75 65, 85 48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M100 82 C110 68, 95 55, 105 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
      <path d="M100 76 C85 62, 105 48, 95 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.25"/>
      <rect x="125" y="130" width="28" height="40" rx="4" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="130" y="125" width="18" height="8" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="128" y1="145" x2="150" y2="145" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <line x1="128" y1="155" x2="150" y2="155" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
    </svg>
  );
}

const THEME_DECORATIONS: Record<CafeTheme, { component: typeof CoffeeCupSvg; position: string }[]> = {
  cafe: [
    { component: CoffeeCupSvg, position: "left-0 top-1/4 -translate-x-1/4 w-64 h-64" },
    { component: CoffeeCupSvg, position: "right-0 bottom-1/4 translate-x-1/4 w-52 h-52" },
    { component: CoffeeCupSvg, position: "left-1/4 bottom-1/2 -translate-x-1/2 w-40 h-40" },
  ],
  restaurant: [
    { component: PlateCutlerySvg, position: "right-0 top-1/4 translate-x-1/4 w-64 h-64" },
    { component: PlateCutlerySvg, position: "left-0 bottom-1/3 -translate-x-1/4 w-52 h-52" },
    { component: PlateCutlerySvg, position: "right-1/4 bottom-1/2 translate-x-1/2 w-40 h-40" },
  ],
  flowers: [
    { component: FlowerSvg, position: "left-0 top-1/4 -translate-x-1/4 w-64 h-64" },
    { component: FlowerSvg, position: "right-0 bottom-1/3 translate-x-1/4 w-52 h-52" },
    { component: FlowerSvg, position: "left-1/2 bottom-1/4 -translate-x-1/2 w-44 h-44" },
  ],
  vape: [
    { component: VapeSvg, position: "right-0 top-1/4 translate-x-1/4 w-64 h-64" },
    { component: VapeSvg, position: "left-0 bottom-1/3 -translate-x-1/4 w-52 h-52" },
    { component: VapeSvg, position: "right-1/4 top-3/4 -translate-y-1/3 w-40 h-40" },
  ],
};

export default function CafePage() {
  const t = useTranslations("products.cafe");
  const params = useParams();
  const slug = params.slug as string;
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuModal, setMenuModal] = useState(false);
  const [wifiModal, setWifiModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuImages, setMenuImages] = useState<string[]>([]);

  const theme: CafeTheme = cafe?.theme || "cafe";
  const themeCfg = CAFE_THEMES[theme];
  const decorations = THEME_DECORATIONS[theme];
  const isVape = theme === "vape";
  const accentHex = themeCfg.accent;

  useEffect(() => {
    if (!slug) return;
    getCafeBySlug(slug)
      .then((data) => {
        setCafe(data);
        if (data?.menuType === "images") {
          if (data.menuImages && data.menuImages.length > 0) {
            setMenuImages(data.menuImages);
          } else if (data.menuUrl) {
            setMenuImages(data.menuUrl.split(",").map((u) => u.trim()));
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleCopyPassword = async () => {
    if (!cafe?.wifiPassword) return;
    try {
      await navigator.clipboard.writeText(cafe.wifiPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeCfg.bgLoading }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: accentHex, borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: themeCfg.bgLoading }}>
        <h1 className="text-2xl font-bold mb-2" style={{ color: accentHex }}>404</h1>
        <p className="text-slate-muted">Cafe not found</p>
      </div>
    );
  }

  const sanitizedWhatsApp = cafe.whatsapp
    ? cafe.whatsapp.replace(/[^0-9]/g, "")
    : "";

  const socialItems: { key: string; href: string; icon: React.ReactNode }[] = [
    {
      key: "facebook",
      href: cafe.facebook || "",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      key: "instagram",
      href: cafe.instagram || "",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      key: "tiktok",
      href: cafe.tiktok || "",
      icon: <Music2 className="w-5 h-5" />,
    },
    {
      key: "snapchat",
      href: cafe.snapchatUrl || "",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2c-5.5 0-10 3.6-10 8.7 0 1.8.7 3.5 1.9 4.9.3.3.4.7.2 1.1l-.3.7c-.2.5-.1 1 .3 1.3.2.2.5.3.8.3.3 0 .6-.1.9-.2.6-.2 1.2-.4 1.9-.4s1.3.2 1.9.6c.8.5 1.7.8 2.5.8s1.7-.3 2.5-.8c.6-.4 1.2-.6 1.9-.6s1.3.2 1.9.4c.3.1.6.2.9.2.3 0 .6-.1.8-.3.4-.3.5-.8.3-1.3l-.3-.7c-.2-.4-.1-.8.2-1.1 1.2-1.4 1.9-3.1 1.9-4.9C22 5.6 17.5 2 12 2z" />
        </svg>
      ),
    },
    {
      key: "googleMaps",
      href: cafe.googleMapsUrl || "",
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      key: "googleReviews",
      href: cafe.googleReviewsUrl || "",
      icon: <Star className="w-5 h-5" />,
    },
    {
      key: "phone",
      href: cafe.phone ? `tel:${cafe.phone}` : "",
      icon: <Phone className="w-5 h-5" />,
    },
    {
      key: "telegram",
      href: cafe.telegram
        ? cafe.telegram.startsWith("http://") || cafe.telegram.startsWith("https://")
          ? cafe.telegram
          : `https://t.me/${cafe.telegram.replace(/^@/, "")}`
        : "",
      icon: <Send className="w-5 h-5" />,
    },
    {
      key: "whatsapp",
      href: sanitizedWhatsApp
        ? `https://wa.me/${sanitizedWhatsApp}`
        : "",
      icon: <MessageCircle className="w-5 h-5" />,
    },
  ].filter((item) => item.href);

  const hasPayments = cafe.vodafoneCash || cafe.instaPay;
  const vodafoneLink = cafe.vodafoneCash
    ? `tel:%2A9%2A7%2A${cafe.vodafoneCash}%23`
    : "";
  const instaPayLink = cafe.instaPay
    ? `instapay://payment?to=${cafe.instaPay}`
    : "";

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: themeCfg.bg }}>
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none z-0 select-none" style={{ color: accentHex, opacity: isVape ? 0.12 : 0.15 }}>
        {decorations.map((dec, i) => {
          const DecorComponent = dec.component;
          return <DecorComponent key={i} className={`absolute ${dec.position}`} />;
        })}
      </div>

      <div className="relative z-10">
        <div className="max-w-lg mx-auto px-4 py-12">
          {/* 1. Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="flex justify-center mb-5">
              <div
              className="w-28 h-28 rounded-full ring-2 ring-offset-4 p-1"
              style={{
                borderColor: accentHex,
                boxShadow: `0 0 30px ${accentHex}66`,
                "--tw-ring-color": accentHex,
                "--tw-ring-offset-color": themeCfg.ringOffset,
              } as React.CSSProperties}
              >
                {cafe.logo ? (
                  <Image
                    src={cafe.logo}
                    alt={cafe.name}
                    width={112}
                    height={112}
                    priority
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center">
                    <span className="text-4xl font-bold" style={{ color: accentHex }}>
                      {cafe.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <h1
              className="text-3xl font-bold tracking-wide"
              style={{
                color: accentHex,
                fontFamily: "var(--font-heading)",
                textShadow: `0 0 15px ${accentHex}80`,
              }}
            >
              {cafe.name}
            </h1>
          </motion.div>

          {/* 2. Hero Menu Button */}
          {(cafe.menuType && (cafe.menuUrl || (cafe.menuType === "images" && menuImages.length > 0))) ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              {cafe.menuType === "pdf" || cafe.menuType === "images" ? (
                <button
                  onClick={() => setMenuModal(true)}
                  className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl backdrop-blur-md border font-bold text-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all duration-300 group"
                  style={{
                    backgroundColor: isVape ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)",
                    borderColor: `${accentHex}80`,
                    color: accentHex,
                  }}
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">🔗</span>
                  {t("browseMenu")}
                </button>
              ) : (
                <a
                  href={cafe.menuUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl backdrop-blur-md border font-bold text-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all duration-300 group"
                  style={{
                    backgroundColor: isVape ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)",
                    borderColor: `${accentHex}80`,
                    color: accentHex,
                  }}
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">🔗</span>
                  {t("browseMenu")}
                </a>
              )}
            </motion.div>
          ) : null}

          {/* 3. Social & Contact */}
          {socialItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <p className="text-xs mb-6 uppercase tracking-widest text-center" style={{ color: `${accentHex}99` }}>
                Follow Us
              </p>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 justify-items-center">
                {socialItems.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 transition-all duration-300 group"
                  >
                    <div
                      className="w-20 h-20 rounded-full backdrop-blur-md border-2 flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                      style={{
                        backgroundColor: isVape ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.08)",
                        borderColor: `${accentHex}4D`,
                        color: accentHex,
                      }}
                    >
                      <div className="w-10 h-10 flex items-center justify-center">
                        {item.icon}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-center transition-opacity duration-200 group-hover:opacity-80">
                      {item.key === "googleMaps" ? "Google Maps" : item.key === "googleReviews" ? "Google Reviews" : item.key === "facebook" ? "Facebook" : item.key === "instagram" ? "Instagram" : item.key === "tiktok" ? "TikTok" : item.key === "snapchat" ? "Snapchat" : item.key === "telegram" ? "Telegram" : item.key === "phone" ? "Phone" : item.key === "whatsapp" ? "WhatsApp" : item.key}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}

          {/* 4. Payments */}
          {hasPayments && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <p className="text-xs mb-4 uppercase tracking-widest text-center" style={{ color: `${accentHex}99` }}>
                {t("payMethods")}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {vodafoneLink && (
                  <a
                    href={vodafoneLink}
                    className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl backdrop-blur-md border transition-all duration-300 group hover:scale-[1.02]"
                    style={{
                      backgroundColor: isVape ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.08)",
                      borderColor: `${accentHex}4D`,
                      color: accentHex,
                    }}
                  >
                    <svg className="w-10 h-10 group-hover:scale-110 transition-transform" viewBox="0 0 48 48" fill="none">
                      <circle cx="24" cy="24" r="22" fill="#E60000" />
                      <path d="M18 18 C18 18, 14 23, 17 27 C19 31, 26 30, 28 26" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
                      <circle cx="26" cy="16" r="2.5" fill="white" />
                    </svg>
                    <span className="text-sm font-bold text-center leading-tight">
                      {t("payVodafone")}
                    </span>
                  </a>
                )}
                {instaPayLink && (
                  <a
                    href={instaPayLink}
                    className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl backdrop-blur-md border transition-all duration-300 group hover:scale-[1.02]"
                    style={{
                      backgroundColor: isVape ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.08)",
                      borderColor: `${accentHex}4D`,
                      color: accentHex,
                    }}
                  >
                    <svg className="w-10 h-10 group-hover:scale-110 transition-transform" viewBox="0 0 48 48" fill="none">
                      <rect x="2" y="2" width="44" height="44" rx="12" fill="#00A859" />
                      <path d="M18 32 L28 24 L18 16" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                    <span className="text-sm font-bold text-center leading-tight">
                      {t("payInstaPay")}
                    </span>
                  </a>
                )}
              </div>
            </motion.div>
          )}
          {/* 5. Website */}
          {cafe.websiteUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mb-8"
            >
              <a
                href={cafe.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl backdrop-blur-md border transition-all duration-300 group"
                style={{
                  backgroundColor: isVape ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)",
                  borderColor: `${accentHex}4D`,
                  color: accentHex,
                }}
              >
                <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold">{t("ourWebsite")}</span>
              </a>
            </motion.div>
          )}

          {/* 6. WiFi */}
          {cafe.wifiName && cafe.wifiPassword && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <button
                onClick={() => setWifiModal(true)}
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl backdrop-blur-md border transition-all duration-300 group"
                style={{
                  backgroundColor: isVape ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)",
                  borderColor: `${accentHex}4D`,
                  color: accentHex,
                }}
              >
                <Wifi className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold">{t("connectWifi")}</span>
              </button>
            </motion.div>
          )}

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs"
            style={{ color: `${accentHex}4D` }}
          >
            {t("poweredBy")}
          </motion.p>
        </div>

        {/* Menu Modal */}
        <AnimatePresence>
          {menuModal && (
            <MenuModal
              menuType={cafe.menuType}
              menuUrl={cafe.menuUrl}
              menuImages={menuImages}
              onClose={() => setMenuModal(false)}
              accentHex={accentHex}
            />
          )}
        </AnimatePresence>

        {/* WiFi Modal */}
        <AnimatePresence>
          {wifiModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-50"
              onClick={(e) => {
                if (e.target === e.currentTarget) setWifiModal(false);
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-sm backdrop-blur-xl border rounded-2xl p-8"
                style={{
                  backgroundColor: `${themeCfg.ringOffset}F2`,
                  borderColor: `${accentHex}4D`,
                  boxShadow: `0 0 40px ${accentHex}26`,
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Wifi className="w-6 h-6" style={{ color: accentHex }} />
                    <h3 className="text-lg font-bold" style={{ color: accentHex }}>
                      {t("wifiModalTitle")}
                    </h3>
                  </div>
                  <button
                    onClick={() => setWifiModal(false)}
                    className="text-slate-muted hover:text-slate-light transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-muted mb-1">
                      {t("wifiNetwork")}
                    </p>
                    <div
                      className="w-full px-4 py-3 rounded-lg backdrop-blur-md border font-mono text-base"
                      style={{
                        backgroundColor: isVape ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)",
                        borderColor: `${accentHex}33`,
                        color: accentHex,
                      }}
                    >
                      {cafe.wifiName}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-muted mb-1">
                      {t("wifiPassword")}
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="flex-1 px-4 py-3 rounded-lg backdrop-blur-md border font-mono text-base tracking-widest"
                        style={{
                          backgroundColor: isVape ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)",
                          borderColor: `${accentHex}33`,
                          color: accentHex,
                        }}
                      >
                        {cafe.wifiPassword}
                      </div>
                      <button
                        onClick={handleCopyPassword}
                        className="p-3 rounded-lg border transition-all duration-200"
                        style={{
                          backgroundColor: `${accentHex}33`,
                          borderColor: `${accentHex}66`,
                          color: accentHex,
                        }}
                      >
                        {copied ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {copied && (
                      <p className="text-xs text-green-400 mt-2">{t("copied")}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MenuModal({
  menuType,
  menuUrl,
  menuImages,
  onClose,
  accentHex,
}: {
  menuType?: "pdf" | "images" | "link";
  menuUrl?: string;
  menuImages: string[];
  onClose: () => void;
  accentHex: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, offsetWidth } = scrollRef.current;
    if (offsetWidth === 0) return;
    const index = Math.round(scrollLeft / offsetWidth);
    setCurrentSlide(Math.min(index, menuImages.length - 1));
  }, [menuImages.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-lg backdrop-blur-xl border rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#0D0D0DF2",
          borderColor: `${accentHex}4D`,
          boxShadow: `0 0 50px ${accentHex}33`,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full backdrop-blur-md border transition-all duration-200 flex items-center justify-center"
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            borderColor: `${accentHex}4D`,
            color: accentHex,
          }}
        >
          <X className="w-5 h-5" />
        </button>

        {menuType === "pdf" && menuUrl ? (
          <iframe
            src={menuUrl}
            className="w-full h-[80vh] rounded-2xl"
            title="Menu PDF"
          />
        ) : menuType === "images" && menuImages.length > 0 ? (
          <>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              style={{ scrollBehavior: "smooth" }}
            >
              {menuImages.map((url, i) => (
                <div
                  key={i}
                  className="snap-center shrink-0 w-full flex items-center justify-center p-6"
                >
                  <Image
                    src={url}
                    alt={`Menu ${i + 1}`}
                    width={500}
                    height={700}
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="w-full h-auto rounded-xl object-contain"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>

            {menuImages.length > 1 && (
              <div className="flex items-center justify-center gap-2 pb-4">
                {menuImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (!scrollRef.current) return;
                      const child = scrollRef.current.children[i] as HTMLElement;
                      if (child) {
                        child.scrollIntoView({
                          behavior: "smooth",
                          block: "nearest",
                          inline: "start",
                        });
                        setCurrentSlide(i);
                      }
                    }}
                    className="w-2 h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: i === currentSlide ? accentHex : `${accentHex}4D`,
                      width: i === currentSlide ? "1rem" : "0.5rem",
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : null}
      </motion.div>
    </motion.div>
  );
}
