"use client";

import { useTranslations, useLocale } from "next-intl";
import { MapPin, Clock, Heart, Share2, QrCode, ExternalLink } from "lucide-react";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import CountdownTimer from "./CountdownTimer";
import type { WeddingCard } from "@/lib/wedding-schema";

interface WeddingPreviewProps {
  wedding: WeddingCard;
}

export default function WeddingPreview({ wedding }: WeddingPreviewProps) {
  const t = useTranslations("wedding");
  const locale = useLocale();
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const pageUrl = `${typeof window !== "undefined" ? window.location.origin : "https://gotap.vercel.app"}/${locale}/wedding/${wedding.slug}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${wedding.coupleName1} & ${wedding.coupleName2}`, url: pageUrl });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy via-navy to-navy-dark text-slate-light">
      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full ring-2 ring-gold animate-pulse shadow-[0_0_30px_rgba(212,175,55,0.3)]" />
            <div className="absolute -inset-3 rounded-full border border-gold/20" />
            <div className="w-full h-full rounded-full overflow-hidden ring-2 ring-gold/70 shadow-[0_0_25px_rgba(212,175,55,0.3)]">
              {wedding.image ? (
                <Image src={wedding.image} alt={`${wedding.coupleName1} & ${wedding.coupleName2}`} width={128} height={128} className="w-full h-full object-cover" unoptimized />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gold/20 to-navy-light flex items-center justify-center">
                  <Heart className="w-12 h-12 text-gold/60" />
                </div>
              )}
            </div>
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold text-gold mb-2 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            style={{ fontFamily: "var(--font-signature)" }}
          >
            {wedding.coupleName1}
          </h1>
          <div className="flex items-center justify-center gap-3 my-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent max-w-[80px]" />
            <span className="text-gold/60 text-lg">&amp;</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent max-w-[80px]" />
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold text-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            style={{ fontFamily: "var(--font-signature)" }}
          >
            {wedding.coupleName2}
          </h1>

          <div className="flex items-center justify-center gap-2 mt-4 text-slate-muted">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{wedding.date} — {wedding.time}</span>
          </div>
        </div>

        {/* Countdown */}
        <div className="mb-10">
          <h2 className="text-center text-sm text-slate-muted uppercase tracking-widest mb-4">
            {t("countdown")}
          </h2>
          <CountdownTimer targetDate={wedding.date} targetTime={wedding.time} />
        </div>

        {/* Story */}
        {wedding.story && (
          <div className="mb-10 p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-gold/30">
            <h2 className="text-lg font-bold text-gold mb-3 text-center" style={{ fontFamily: "var(--font-signature)" }}>
              {t("story")}
            </h2>
            <p className="text-sm text-slate-muted/80 leading-relaxed text-center italic">
              &ldquo;{wedding.story}&rdquo;
            </p>
          </div>
        )}

        {/* Venue */}
        <div className="mb-10 p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-gold/30 text-center">
          <MapPin className="w-6 h-6 text-gold mx-auto mb-2" />
          <h2 className="text-lg font-bold text-gold mb-1" style={{ fontFamily: "var(--font-signature)" }}>
            {t("venue")}
          </h2>
          <p className="text-sm text-slate-light">{wedding.venue}</p>
          {wedding.venueMapsLink && (
            <a
              href={wedding.venueMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-gold/30 text-gold text-sm font-semibold hover:bg-white/20 transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4" />
              {t("openMap")}
            </a>
          )}
        </div>

        {/* Dress Code */}
        {(wedding.dressCode || wedding.dressCodeHer || wedding.dressCodeHim) && (
          <div className="mb-10 p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-gold/30">
            <h2 className="text-lg font-bold text-gold mb-4 text-center" style={{ fontFamily: "var(--font-signature)" }}>
              {t("dressCode")}
            </h2>
            {wedding.dressCode && (
              <p className="text-sm text-slate-muted/80 text-center mb-4">{wedding.dressCode}</p>
            )}
            {(wedding.dressCodeHer || wedding.dressCodeHim) && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-gold/20 text-center">
                  <p className="text-xs text-slate-muted mb-1">{t("forHer")}</p>
                  <p className="text-sm text-gold font-semibold">{wedding.dressCodeHer || "—"}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-gold/20 text-center">
                  <p className="text-xs text-slate-muted mb-1">{t("forHim")}</p>
                  <p className="text-sm text-gold font-semibold">{wedding.dressCodeHim || "—"}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RSVP Button */}
        <div className="mb-6">
          <a
            href={`https://wa.me/201585599678?text=${encodeURIComponent(t("rsvpMessage", { name1: wedding.coupleName1, name2: wedding.coupleName2 }))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 rounded-2xl bg-gold/20 backdrop-blur-md border border-gold/50 text-gold font-bold text-center text-lg hover:bg-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300"
          >
            {t("rsvp")}
          </a>
        </div>

        {/* Share + QR */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-slate-muted hover:text-gold hover:border-gold/40 transition-all text-sm"
          >
            <Share2 className="w-4 h-4" />
            {copied ? "Copied!" : t("share")}
          </button>
          <button
            onClick={() => setShowQR(!showQR)}
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-slate-muted hover:text-gold hover:border-gold/40 transition-all text-sm"
          >
            <QrCode className="w-4 h-4" />
          </button>
        </div>

        {showQR && (
          <div className="mt-4 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-gold/20 flex items-center justify-center">
            <QRCodeCanvas value={pageUrl} size={180} level="H" />
          </div>
        )}

        {/* Powered by */}
        <div className="text-center mt-10">
          <p className="text-xs text-slate-muted/50">
            {t("poweredBy")}
          </p>
        </div>
      </div>
    </div>
  );
}
