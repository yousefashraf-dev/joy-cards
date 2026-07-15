"use client";

import { MapPin, Heart, Share2, ExternalLink, Menu, X, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import CountdownTimer from "./CountdownTimer";
import type { WeddingCard } from "@/lib/wedding-schema";
import { getWeddingTheme } from "@/lib/wedding-themes";
import { BASE_URL } from "@/lib/constants";

interface WeddingPreviewProps {
  wedding: WeddingCard;
  compact?: boolean;
}

export default function WeddingPreview({ wedding }: WeddingPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const theme = getWeddingTheme(wedding.theme || "champagne-rose");

  const pageUrl = `${typeof window !== "undefined" ? window.location.origin : BASE_URL}/en/wedding/${wedding.slug}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${wedding.coupleName1} & ${wedding.coupleName2}`, url: pageUrl });
      } catch { }
    } else {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const rsvpMessage = `Good evening! I'd like to confirm my attendance at ${wedding.coupleName1} & ${wedding.coupleName2}'s wedding 🎉`;

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: theme.bgColor, color: theme.textColor }}>
      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-3" style={{ backgroundColor: `${theme.cardBg}E6`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${theme.accent}1A` }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/en" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight" style={{ color: theme.accent }}>GoTap</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {[{ href: "/en", label: "Home" }, { href: "/en/wedding-cards", label: "Wedding Cards" }, { href: "/en/shop", label: "Shop" }, { href: "/en/auto-tap", label: "Auto-Tap" }].map((link) => (
              <Link key={link.href} href={link.href}
                className="text-xs tracking-[2px] uppercase transition-colors duration-200 hover:opacity-70"
                style={{ color: theme.textColor }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden" style={{ color: theme.textColor }}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 pb-3 space-y-2" style={{ borderTop: `1px solid ${theme.accent}1A` }}>
            {[{ href: "/en", label: "Home" }, { href: "/en/wedding-cards", label: "Wedding Cards" }, { href: "/en/shop", label: "Shop" }, { href: "/en/auto-tap", label: "Auto-Tap" }].map((link) => (
              <Link key={link.href} href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block pt-3 text-xs tracking-[2px] uppercase transition-colors duration-200 hover:opacity-70"
                style={{ color: theme.textColor }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section
        style={{ background: theme.heroBg }}
        className="min-h-screen flex flex-col items-center justify-center text-center px-5 py-16 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ width: 500, height: 500, background: `radial-gradient(circle, ${theme.accent}22, transparent)`, position: "absolute", top: -100, left: -100, borderRadius: "50%" }} />
          <div style={{ width: 400, height: 400, background: `radial-gradient(circle, ${theme.accent}15, transparent)`, position: "absolute", bottom: -80, right: -80, borderRadius: "50%" }} />
        </div>

        <div className="relative mb-8 z-10">
          <div
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto relative"
            style={{
              boxShadow: `0 0 40px ${theme.accent}33`,
              border: `2px solid ${theme.accent}66`,
              background: `radial-gradient(circle, ${theme.accent}11, transparent)`,
            }}
          >
            {wedding.image ? (
              <Image src={wedding.image} alt={`${wedding.coupleName1} & ${wedding.coupleName2}`} width={128} height={128} className="w-full h-full object-cover rounded-full" unoptimized />
            ) : (
              <div className="w-full h-full rounded-full flex items-center justify-center">
                <span className="text-4xl">{theme.heartIcon}</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs tracking-[6px] uppercase mb-4 z-10" style={{ color: theme.accent, letterSpacing: "6px", fontWeight: 400 }}>
          You are cordially invited to celebrate the wedding of
        </p>

        <h1 className="relative z-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          <span className="block text-5xl sm:text-7xl md:text-8xl font-light italic leading-tight" style={{ color: theme.textColor }}>
            {wedding.coupleName1}
          </span>
          <span className="block text-3xl sm:text-4xl md:text-5xl my-[-8px]" style={{ color: theme.accent, fontFamily: "'Dancing Script', cursive" }}>
            &amp;
          </span>
          <span className="block text-5xl sm:text-7xl md:text-8xl font-light italic leading-tight" style={{ color: theme.accent }}>
            {wedding.coupleName2}
          </span>
        </h1>

        <div className="flex items-center justify-center gap-4 my-6 z-10">
          <span className="h-px w-16 sm:w-20" style={{ background: `linear-gradient(to right, transparent, ${theme.accent}80)` }} />
          <svg width="18" height="18" viewBox="0 0 24 24" fill={theme.accent} opacity="0.6">
            <path d="M12 2C12 2 8 6 8 10C8 12.2 9.8 14 12 14C14.2 14 16 12.2 16 10C16 6 12 2 12 2Z" />
            <path d="M12 14C12 14 6 15 4 19C3.2 20.6 4 22 6 22H18C20 22 20.8 20.6 20 19C18 15 12 14 12 14Z" opacity="0.5" />
          </svg>
          <span className="h-px w-16 sm:w-20" style={{ background: `linear-gradient(to left, transparent, ${theme.accent}80)` }} />
        </div>

        <div
          className="inline-flex items-center gap-3 px-5 py-3 sm:px-7 sm:py-3.5 rounded-full z-10 text-xs sm:text-sm tracking-[3px] uppercase"
          style={{
            backgroundColor: `${theme.cardBg}99`,
            backdropFilter: "blur(12px)",
            border: `1px solid ${theme.accent}4D`,
            color: theme.mutedColor,
            boxShadow: `0 8px 32px ${theme.accent}1A`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
          {wedding.date} — {wedding.time}
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="text-[10px] tracking-[4px] uppercase" style={{ color: theme.lightColor }}>Scroll</span>
          <div className="w-px h-10" style={{ background: `linear-gradient(to bottom, ${theme.accent}, transparent)` }} />
        </div>
      </section>

      {/* ─── INVITATION MESSAGE ─── */}
      {wedding.happyMoment && (
        <section style={{ backgroundColor: theme.sectionBg }} className="py-16 sm:py-24">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div
              className="rounded-2xl sm:rounded-3xl px-6 sm:px-16 py-12 sm:py-16 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${theme.cardBg}, ${theme.accent}08)`,
                border: `1px solid ${theme.accent}33`,
                boxShadow: `0 20px 80px ${theme.accent}0D`,
              }}
            >
              <span className="block text-7xl sm:text-8xl leading-none mb-4" style={{ color: `${theme.accent}26`, fontFamily: "'Cormorant Garamond', serif" }}>
                &ldquo;
              </span>
              <p className="text-xl sm:text-2xl md:text-3xl font-light italic leading-relaxed" style={{ color: theme.textColor, fontFamily: "'Cormorant Garamond', serif" }}>
                {wedding.happyMoment}
              </p>
              <span className="block text-xl sm:text-2xl mt-6" style={{ color: theme.accent, fontFamily: "'Dancing Script', cursive" }}>
                {wedding.coupleName1} &amp; {wedding.coupleName2}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ─── LOVE STORY ─── */}
      {(wedding.story || wedding.storyImage) && (
        <section style={{ backgroundColor: theme.bgColor }} className="py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              {wedding.storyImage && (
                <div className="relative rounded-2xl overflow-hidden" style={{ boxShadow: `0 24px 80px ${theme.accent}1A`, border: `1px solid ${theme.accent}33` }}>
                  <div className="absolute inset-3 rounded-xl pointer-events-none z-10" style={{ border: `1px solid ${theme.accent}66` }} />
                  <Image src={wedding.storyImage} alt="Love Story" width={600} height={700} className="w-full h-auto object-cover" unoptimized style={{ filter: "sepia(8%) saturate(110%) brightness(102%)" }} />
                  <div className="absolute bottom-4 left-0 right-0 text-center z-20">
                    <span className="inline-block px-4 py-1.5 rounded-full text-sm" style={{ backgroundColor: `${theme.cardBg}D9`, backdropFilter: "blur(8px)", color: theme.accent, fontFamily: "'Dancing Script', cursive" }}>
                      Two hearts, one story
                    </span>
                  </div>
                </div>
              )}
              <div className={wedding.storyImage ? "" : "md:col-span-2 text-center"}>
                <span className="text-xs tracking-[6px] uppercase" style={{ color: theme.accent }}>
                  The journey
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-light italic mt-3 mb-6" style={{ color: theme.textColor, fontFamily: "'Cormorant Garamond', serif" }}>
                  Our Story
                </h2>
                {wedding.story && (
                  <p className="text-base sm:text-lg font-light leading-relaxed" style={{ color: theme.mutedColor }}>
                    {wedding.story}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── COUNTDOWN ─── */}
      <section className="py-16 sm:py-24 text-center relative overflow-hidden" style={{ background: theme.countdownBg }}>
        <p className="text-xs sm:text-sm tracking-[4px] uppercase mb-8 sm:mb-12 font-light italic" style={{ color: `${theme.accent}CC`, fontFamily: "'Cormorant Garamond', serif" }}>
          Countdown
        </p>
        <div className="max-w-2xl mx-auto px-6">
          <CountdownTimer targetDate={wedding.date} targetTime={wedding.time} accentHex={theme.accent} dark />
        </div>
      </section>

      {/* ─── VENUE ─── */}
      <section style={{ backgroundColor: theme.sectionBg }} className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div
            className="rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${theme.cardBg}, ${theme.accent}08)`,
              border: `1px solid ${theme.accent}33`,
              boxShadow: `0 16px 60px ${theme.accent}0D`,
            }}
          >
            <div className="absolute top-0 left-0 w-1 h-full rounded-l" style={{ background: `linear-gradient(to bottom, ${theme.accent}, ${theme.accentLight}, ${theme.accent}88)` }} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="text-center md:text-left">
                <span className="text-xs tracking-[6px] uppercase" style={{ color: theme.accent }}>
                  Where love blooms
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-light italic mt-2 mb-4" style={{ color: theme.textColor, fontFamily: "'Cormorant Garamond', serif" }}>
                  Venue
                </h2>
                <p className="text-sm sm:text-base font-light leading-relaxed mb-4" style={{ color: theme.mutedColor }}>
                  Come celebrate with us at this beautiful venue
                </p>
                <span className="block text-2xl sm:text-3xl md:text-4xl font-light italic mb-4" style={{ color: theme.accent, fontFamily: "'Cormorant Garamond', serif" }}>
                  {wedding.venue}
                </span>
                {wedding.venueMapsLink && (
                  <a
                    href={wedding.venueMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs tracking-[2px] uppercase font-medium transition-all duration-300 hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
                      color: "#fff",
                      boxShadow: `0 8px 32px ${theme.accent}66`,
                    }}
                  >
                    <MapPin className="w-4 h-4" />
                    Open in Google Maps
                  </a>
                )}
              </div>

              <div className="text-center p-6 sm:p-8 rounded-xl" style={{ backgroundColor: `${theme.accent}08`, border: `1px solid ${theme.accent}1A` }}>
                <MapPin className="w-12 h-12 mx-auto mb-3" style={{ color: theme.accent }} />
                <span className="block text-xl sm:text-2xl font-light italic" style={{ color: theme.accent, fontFamily: "'Cormorant Garamond', serif" }}>
                  {wedding.venue}
                </span>
                <span className="block text-xs mt-2 tracking-[3px] uppercase" style={{ color: theme.mutedColor }}>
                  {wedding.date} — {wedding.time}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CELEBRATION DETAILS ─── */}
      <section style={{ backgroundColor: theme.bgColor }} className="py-16 sm:py-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-xs tracking-[6px] uppercase" style={{ color: theme.accent }}>
            Mark your calendars
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light italic mt-2 mb-4" style={{ color: theme.textColor, fontFamily: "'Cormorant Garamond', serif" }}>
            Celebration
          </h2>
          <p className="text-sm sm:text-base font-light mb-8 max-w-xl mx-auto" style={{ color: theme.mutedColor }}>
            Save the date for this special evening
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {[
              { icon: "📅", value: wedding.date, label: "Date" },
              { icon: "⏰", value: wedding.time, label: "Time" },
              { icon: "📍", value: wedding.venue, label: "Venue" },
              { icon: "🎵", value: "Music & Dancing", label: "Vibe" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 px-6 py-5 sm:px-8 sm:py-6 rounded-xl min-w-[130px] transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: `${theme.cardBg}B3`,
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${theme.accent}33`,
                  boxShadow: `0 8px 32px ${theme.accent}0D`,
                }}
              >
                <span className="text-2xl sm:text-3xl">{item.icon}</span>
                <span className="text-lg sm:text-xl font-medium" style={{ color: theme.textColor, fontFamily: "'Cormorant Garamond', serif" }}>
                  {item.value}
                </span>
                <span className="text-[10px] tracking-[3px] uppercase" style={{ color: theme.lightColor }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DRESS CODE ─── */}
      {(wedding.dressCodeHer || wedding.dressCodeHim || wedding.dressCode) && (
        <section style={{ backgroundColor: theme.sectionBg }} className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span className="text-xs tracking-[6px] uppercase" style={{ color: theme.accent }}>
              What to wear
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light italic mt-2 mb-4" style={{ color: theme.textColor, fontFamily: "'Cormorant Garamond', serif" }}>
              Dress Code
            </h2>
            {wedding.dressCode && (
              <p className="text-sm sm:text-base font-light mb-8 max-w-xl mx-auto" style={{ color: theme.mutedColor }}>
                {wedding.dressCode}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {wedding.dressCodeHer && (
                <div className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: `linear-gradient(135deg, ${theme.accent}0D, ${theme.accent}04)`, border: `1px solid ${theme.accent}26` }}>
                  <div className="w-12 h-1 mx-auto rounded-full mb-4" style={{ background: theme.accent }} />
                  <span className="text-2xl mb-2 block">{theme.heartIcon}</span>
                  <p className="text-xs tracking-[4px] uppercase mb-1" style={{ color: theme.accent }}>
                    For Her
                  </p>
                  <h3 className="text-xl sm:text-2xl font-light italic mb-4" style={{ color: theme.textColor, fontFamily: "'Cormorant Garamond', serif" }}>
                    Ladies
                  </h3>
                  <div className="flex flex-wrap justify-center gap-3 mb-4">
                    {wedding.dressCodeHer.split(",").map((color, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2" style={{ backgroundColor: color.trim(), borderColor: `${theme.cardBg}CC`, boxShadow: `0 4px 12px ${theme.accent}1A` }} />
                        <span className="text-[9px] tracking-[2px] uppercase max-w-[60px] text-center" style={{ color: theme.lightColor }}>{color.trim()}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm italic mt-3" style={{ color: theme.accent, fontFamily: "'Dancing Script', cursive" }}>
                    Dress like a summer bloom
                  </p>
                </div>
              )}

              {wedding.dressCodeHim && (
                <div className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: `linear-gradient(135deg, ${theme.textColor}08, ${theme.textColor}04)`, border: `1px solid ${theme.accent}26` }}>
                  <div className="w-12 h-1 mx-auto rounded-full mb-4" style={{ background: theme.accent }} />
                  <span className="text-2xl mb-2 block">🤵</span>
                  <p className="text-xs tracking-[4px] uppercase mb-1" style={{ color: theme.accent }}>
                    For Him
                  </p>
                  <h3 className="text-xl sm:text-2xl font-light italic mb-4" style={{ color: theme.textColor, fontFamily: "'Cormorant Garamond', serif" }}>
                    Gentlemen
                  </h3>
                  <div className="flex flex-wrap justify-center gap-3 mb-4">
                    {wedding.dressCodeHim.split(",").map((color, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2" style={{ backgroundColor: color.trim(), borderColor: `${theme.cardBg}CC`, boxShadow: `0 4px 12px ${theme.accent}1A` }} />
                        <span className="text-[9px] tracking-[2px] uppercase max-w-[60px] text-center" style={{ color: theme.lightColor }}>{color.trim()}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm italic mt-3" style={{ color: theme.accent, fontFamily: "'Dancing Script', cursive" }}>
                    Sharp, elegant & timeless
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── RSVP / FOOTER ─── */}
      <section className="py-16 sm:py-24 text-center relative overflow-hidden" style={{ background: theme.countdownBg }}>
        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <span className="text-xs tracking-[4px] uppercase block mb-4" style={{ color: `${theme.accent}AA` }}>
            Wedding RSVP
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light italic mb-4" style={{ color: theme.accent, fontFamily: "'Cormorant Garamond', serif" }}>
            Will you attend?
          </h2>
          <p className="text-sm sm:text-base font-light mb-8" style={{ color: `${theme.accent}88` }}>
            Please let us know if you can make it
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/201585599678?text=${encodeURIComponent(rsvpMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-xs tracking-[2px] uppercase font-medium transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
                color: "#fff",
                boxShadow: `0 8px 32px ${theme.accent}66`,
              }}
            >
              <Heart className="w-4 h-4" />
              Yes, I'm Coming!
            </a>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-xs tracking-[2px] uppercase font-medium transition-all duration-300 hover:scale-105"
              style={{
                background: "transparent",
                border: `1px solid ${theme.accent}66`,
                color: theme.accent,
              }}
            >
              <Share2 className="w-4 h-4" />
              {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ backgroundColor: theme.bgColor }} className="py-12 text-center">
        <p className="text-3xl sm:text-4xl font-light italic mb-3" style={{ color: theme.accent, fontFamily: "'Cormorant Garamond', serif" }}>
          {wedding.coupleName1} &amp; {wedding.coupleName2}
        </p>
        <p className="text-xs tracking-[4px] uppercase" style={{ color: theme.lightColor }}>
          {wedding.date}
        </p>
        <p className="text-lg mt-4 opacity-60" style={{ color: theme.mutedColor }}>
          {theme.heartIcon}
        </p>
      </footer>
    </div>
  );
}
