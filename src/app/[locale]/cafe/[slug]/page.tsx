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
  ExternalLink,
  Music2,
  Menu,
} from "lucide-react";
import { getCafeBySlug } from "@/lib/cafe-schema";
import type { Cafe } from "@/lib/cafe-schema";

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
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gold mb-2">404</h1>
        <p className="text-slate-muted">Cafe not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy via-navy to-navy-dark">
      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-5">
            <div className="w-28 h-28 rounded-full ring-2 ring-gold ring-offset-4 ring-offset-navy p-1 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
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
                <div className="w-full h-full rounded-full bg-navy-light flex items-center justify-center">
                  <span className="text-4xl font-bold text-gold">
                    {cafe.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
          <h1
            className="text-4xl text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"
            style={{ fontFamily: "var(--font-signature)" }}
          >
            {cafe.name}
          </h1>
        </motion.div>

        {/* Menu Button */}
        {(cafe.menuType === "pdf" || cafe.menuType === "images") && cafe.menuUrl ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <button
              onClick={() => setMenuModal(true)}
              className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-gold/50 text-gold font-bold text-lg hover:bg-white/20 hover:border-gold/70 hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all duration-300 group"
            >
              <Menu className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {t("viewMenu")}
            </button>
          </motion.div>
        ) : cafe.menuType === "link" && cafe.menuUrl ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <a
              href={cafe.menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-gold/50 text-gold font-bold text-lg hover:bg-white/20 hover:border-gold/70 hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all duration-300 group"
            >
              <ExternalLink className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {t("browseMenu")}
            </a>
          </motion.div>
        ) : null}

        {/* 2-Column Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          {cafe.googleMapsUrl && (
            <ActionCard
              href={cafe.googleMapsUrl}
              icon={<MapPin className="w-5 h-5" />}
              label={t("viewOnMap")}
            />
          )}
          {cafe.googleReviewsUrl && (
            <ActionCard
              href={cafe.googleReviewsUrl}
              icon={<Star className="w-5 h-5" />}
              label={t("rateOnGoogle")}
            />
          )}
          {cafe.phone && (
            <ActionCard
              href={`tel:${cafe.phone}`}
              icon={<Phone className="w-5 h-5" />}
              label={t("callDirect")}
            />
          )}
          {cafe.whatsapp && (
            <ActionCard
              href={`https://wa.me/${cafe.whatsapp.replace(/[^0-9]/g, "")}`}
              icon={<MessageCircle className="w-5 h-5" />}
              label={t("messageWhatsapp")}
            />
          )}
          {cafe.websiteUrl && (
            <ActionCard
              href={cafe.websiteUrl}
              icon={<Globe className="w-5 h-5" />}
              label={t("ourWebsite")}
            />
          )}
          {cafe.wifiName && cafe.wifiPassword && (
            <button
              onClick={() => setWifiModal(true)}
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-gold/30 text-gold hover:bg-white/10 hover:border-gold/70 hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] transition-all duration-300 group"
            >
              <Wifi className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-center leading-tight">
                {t("connectWifi")}
              </span>
            </button>
          )}
        </motion.div>

        {/* Social Icons */}
        {(cafe.facebook ||
          cafe.instagram ||
          cafe.tiktok ||
          cafe.snapchatUrl) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <p className="text-xs text-gold/60 mb-5 uppercase tracking-widest">
              {t("socialTitle")}
            </p>
            <div className="flex items-center justify-center gap-5">
              {cafe.facebook && (
                <SocialIcon
                  href={cafe.facebook}
                  icon={
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  }
                />
              )}
              {cafe.instagram && (
                <SocialIcon
                  href={cafe.instagram}
                  icon={
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <circle cx="12" cy="12" r="5"/>
                      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
                    </svg>
                  }
                />
              )}
              {cafe.tiktok && (
                <SocialIcon
                  href={cafe.tiktok}
                  icon={<Music2 className="w-5 h-5" />}
                />
              )}
              {cafe.snapchatUrl && (
                <SocialIcon
                  href={cafe.snapchatUrl}
                  icon={
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2c-5.5 0-10 3.6-10 8.7 0 1.8.7 3.5 1.9 4.9.3.3.4.7.2 1.1l-.3.7c-.2.5-.1 1 .3 1.3.2.2.5.3.8.3.3 0 .6-.1.9-.2.6-.2 1.2-.4 1.9-.4s1.3.2 1.9.6c.8.5 1.7.8 2.5.8s1.7-.3 2.5-.8c.6-.4 1.2-.6 1.9-.6s1.3.2 1.9.4c.3.1.6.2.9.2.3 0 .6-.1.8-.3.4-.3.5-.8.3-1.3l-.3-.7c-.2-.4-.1-.8.2-1.1 1.2-1.4 1.9-3.1 1.9-4.9C22 5.6 17.5 2 12 2z"/>
                    </svg>
                  }
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-gold/30 text-xs"
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
              className="w-full max-w-sm bg-navy/95 backdrop-blur-xl border border-gold/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(212,175,55,0.15)]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Wifi className="w-6 h-6 text-gold" />
                  <h3 className="text-lg font-bold text-gold">
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
                  <div className="w-full px-4 py-3 rounded-lg bg-white/5 backdrop-blur-md border border-gold/20 text-gold font-mono text-base">
                    {cafe.wifiName}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-muted mb-1">
                    {t("wifiPassword")}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-3 rounded-lg bg-white/5 backdrop-blur-md border border-gold/20 text-gold font-mono text-base tracking-widest">
                      {cafe.wifiPassword}
                    </div>
                    <button
                      onClick={handleCopyPassword}
                      className="p-3 rounded-lg bg-gold/20 border border-gold/40 text-gold hover:bg-gold/30 transition-all duration-200"
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
  );
}

function ActionCard({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-gold/30 text-gold hover:bg-white/10 hover:border-gold/70 hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] transition-all duration-300 group"
    >
      <div className="group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-sm font-semibold text-center leading-tight">
        {label}
      </span>
    </a>
  );
}

function SocialIcon({
  href,
  icon,
}: {
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-gold/20 text-gold/60 hover:bg-white/10 hover:border-gold/50 hover:text-gold hover:scale-110 transition-all duration-200"
    >
      {icon}
    </a>
  );
}

function MenuModal({
  menuType,
  menuUrl,
  menuImages,
  onClose,
}: {
  menuType?: "pdf" | "images" | "link";
  menuUrl?: string;
  menuImages: string[];
  onClose: () => void;
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
        className="relative w-full max-w-lg bg-navy/95 backdrop-blur-xl border border-gold/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.2)]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-gold/30 text-gold hover:bg-white/20 transition-all duration-200 flex items-center justify-center"
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
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === currentSlide ? "bg-gold w-4" : "bg-gold/30"
                    }`}
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
