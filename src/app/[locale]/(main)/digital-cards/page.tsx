"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { CreditCard, MessageCircle, Check } from "lucide-react";
import dynamic from "next/dynamic";
const SmartOrderModal = dynamic(() => import("@/components/shop/SmartOrderModal"), { ssr: false, loading: () => null });

export default function DigitalCardsPage() {
  const t = useTranslations("products.digitalCards");
  const locale = useLocale();
  const [orderOpen, setOrderOpen] = useState(false);

  const canAddItems = t.raw("whatYouCanAdd") as string[];

  return (
    <>
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-gradient-to-b from-gold/5 via-matte-black to-matte-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs mb-6">
                <CreditCard className="w-4 h-4" />
                <span>{t("badge")}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-light mb-4 leading-tight">
                {t("title")}
              </h1>
              <p className="text-slate-muted text-base md:text-lg leading-relaxed mb-4">
                {t("desc")}
              </p>
              <p className="text-sm text-slate-muted/70 mb-8 border-s-2 border-gold/30 ps-4">
                {t("premiumDesc")}
              </p>
            </motion.div>

            <motion.div
              className="hidden lg:flex items-center justify-center"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-80 h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-gold/5 rounded-3xl rotate-6" />
                <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center bg-gradient-to-br from-matte-black/80 to-dark-card/80">
                  <svg viewBox="0 0 320 380" className="w-full h-full p-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <radialGradient id="nfcGlow" cx="35%" cy="50%" r="60%">
                        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#2a2a2a" />
                        <stop offset="100%" stopColor="#1a1a1a" />
                      </linearGradient>
                      <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0a0a0a" />
                        <stop offset="50%" stopColor="#151515" />
                        <stop offset="100%" stopColor="#0a0a0a" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <filter id="softGlow">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    <rect x="0" y="0" width="320" height="380" rx="24" fill="none" />

                    {/* NFC Signal Waves */}
                    <ellipse cx="100" cy="190" rx="85" ry="85" fill="url(#nfcGlow)">
                      <animate attributeName="rx" values="60;90;60" dur="2.5s" repeatCount="indefinite" />
                      <animate attributeName="ry" values="60;90;60" dur="2.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite" />
                    </ellipse>

                    <path d="M130 190 Q150 170 170 190" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" fill="none">
                      <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
                    </path>
                    <path d="M115 190 Q145 155 175 190" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" fill="none">
                      <animate attributeName="opacity" values="0.15;0.5;0.15" dur="2.5s" repeatCount="indefinite" />
                    </path>
                    <path d="M100 190 Q140 140 180 190" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" fill="none">
                      <animate attributeName="opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite" />
                    </path>

                    {/* NFC Card */}
                    <g filter="url(#glow)">
                      <motion.rect
                        x="30" y="150" width="95" height="62" rx="6"
                        fill="url(#cardGrad)" stroke="#D4AF37" strokeWidth="1.5"
                        animate={{ x: [0, 5, 0], y: [0, -3, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <rect x="40" y="160" width="35" height="4" rx="2" fill="#D4AF37" opacity="0.6" />
                      <rect x="40" y="169" width="55" height="3" rx="1.5" fill="#D4AF37" opacity="0.3" />
                      <rect x="40" y="177" width="40" height="3" rx="1.5" fill="#D4AF37" opacity="0.2" />
                      <rect x="80" y="190" width="30" height="16" rx="3" fill="#D4AF37" opacity="0.15" />
                      <text x="95" y="201" textAnchor="middle" fill="#D4AF37" fontSize="7" fontWeight="bold" opacity="0.7">NFC</text>
                    </g>

                    {/* Smartphone */}
                    <g>
                      <rect x="195" y="100" width="82" height="170" rx="14" fill="#1a1a1a" stroke="#333" strokeWidth="1.5" />
                      <rect x="201" y="112" width="70" height="140" rx="4" fill="url(#screenGrad)" />
                      <rect x="207" y="118" width="30" height="4" rx="2" fill="#D4AF37" opacity="0.5" />
                      <circle cx="263" cy="120" r="2.5" fill="#D4AF37" opacity="0.4" />
                      <rect x="211" y="136" width="16" height="16" rx="3" fill="#D4AF37" opacity="0.15" />
                      <rect x="233" y="136" width="16" height="16" rx="3" fill="#D4AF37" opacity="0.15" />
                      <rect x="255" y="136" width="16" height="16" rx="3" fill="#D4AF37" opacity="0.15" />
                      <motion.rect
                        x="215" y="202" width="42" height="32" rx="4" fill="#D4AF37" opacity="0"
                        animate={{ opacity: [0, 0.2, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.text
                        x="236" y="215" textAnchor="middle" fill="#D4AF37" fontSize="5" opacity="0" fontWeight="bold"
                        animate={{ opacity: [0, 0.8, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      >PROFILE</motion.text>
                      <motion.text
                        x="236" y="225" textAnchor="middle" fill="#D4AF37" fontSize="4" opacity="0"
                        animate={{ opacity: [0, 0.5, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      >TAP RECEIVED</motion.text>
                      <circle cx="236" cy="262" r="5" fill="none" stroke="#333" strokeWidth="1" />
                    </g>

                    {/* Floating social icons */}
                    <g filter="url(#softGlow)">
                      <circle cx="290" cy="110" r="14" fill="#D4AF37" opacity="0.1">
                        <animate attributeName="opacity" values="0.06;0.18;0.06" dur="3s" repeatCount="indefinite" />
                      </circle>
                      <rect x="284" y="104" width="12" height="12" rx="2.5" stroke="#D4AF37" strokeWidth="1.2" fill="none" opacity="0.45">
                        <animate attributeName="opacity" values="0.25;0.6;0.25" dur="3s" repeatCount="indefinite" />
                      </rect>
                      <circle cx="298" cy="180" r="14" fill="#D4AF37" opacity="0.08">
                        <animate attributeName="opacity" values="0.05;0.16;0.05" dur="3.5s" repeatCount="indefinite" />
                      </circle>
                      <path d="M293 175 Q291 175 291 177 L291 182 L294 181 L301 181 Q303 181 303 179 L303 175 Q303 173 301 173 L295 173 Q293 173 293 175Z" stroke="#D4AF37" strokeWidth="1.2" fill="none" opacity="0.4">
                        <animate attributeName="opacity" values="0.2;0.55;0.2" dur="3.5s" repeatCount="indefinite" />
                      </path>
                      <circle cx="285" cy="250" r="14" fill="#D4AF37" opacity="0.09">
                        <animate attributeName="opacity" values="0.05;0.16;0.05" dur="4s" repeatCount="indefinite" />
                      </circle>
                      <path d="M280 246 Q285 243 290 246" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5">
                        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite" />
                      </path>
                    </g>

                    <circle cx="155" cy="160" r="2.5" fill="#D4AF37" opacity="0.7">
                      <animate attributeName="cx" values="155;175;195" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.7;0;0" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="155" cy="200" r="2" fill="#D4AF37" opacity="0.5">
                      <animate attributeName="cx" values="155;180;205" dur="2.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0;0" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="150" cy="180" r="2" fill="#D4AF37" opacity="0.6">
                      <animate attributeName="cx" values="150;173;195" dur="1.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;0;0" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What you can add to your card */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-matte-black to-matte-dark/30">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-3xl p-8 lg:p-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-light mb-8 text-center">
              {locale === "ar" ? "إيه اللي تقدر تضيفه على الكارت؟" : "What can you add to the card?"}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {canAddItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3">
                  <div className="w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <span className="text-sm text-slate-muted leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-matte-dark/30 to-matte-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="glass bg-dark-card/60 border border-gold/20 rounded-3xl p-10 lg:p-14 max-w-xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-light mb-4">
                {t("ctaTitle")}
              </h2>
              <p className="text-slate-muted text-base mb-8 max-w-md mx-auto">
                {t("ctaDesc")}
              </p>
              <button
                type="button"
                onClick={() => setOrderOpen(true)}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-gold text-matte-dark font-bold text-lg hover:scale-105 active:scale-95 transition-all duration-200 glow-gold hover:glow-gold-strong"
              >
                <MessageCircle className="w-6 h-6" />
                <span>{t("cta")}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <SmartOrderModal
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        initialProductId="clear-card"
        allowProductSwitch={false}
      />
    </>
  );
}
