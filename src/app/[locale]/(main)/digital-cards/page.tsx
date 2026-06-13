"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CreditCard, Shield, Zap, Globe, Info } from "lucide-react";
import BaseForm from "@/components/forms/BaseForm";
import FormA_DigitalCards from "@/components/forms/FormA_DigitalCards";
import { PRICES } from "@/lib/constants";

export default function DigitalCardsPage() {
  const t = useTranslations("products.digitalCards");
  const p = useTranslations("products.pricing");

  const features = [
    { icon: Zap, key: "instantSharing" },
    { icon: Shield, key: "secureNfc" },
    { icon: Globe, key: "customUrl" },
    { icon: CreditCard, key: "premiumDesign" },
  ];

  const productSection = (
    <section className="pt-28 pb-12 lg:pt-36 lg:pb-16 bg-gradient-to-b from-nardo/5 via-matte-black to-matte-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nardo/10 border border-nardo/20 text-nardo text-xs mb-6">
              <CreditCard className="w-4 h-4" />
              <span>{t("badge")}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-light mb-6">{t("title")}</h1>
            <p className="text-slate-muted text-base md:text-lg leading-relaxed mb-6">{t("desc")}</p>
            <p className="text-xs text-slate-muted/70 italic mb-8 border-s-2 border-nardo/30 ps-4">
              {t("premiumDesc")}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {features.map(({ icon: Icon, key }) => (
                <div key={key} className="flex items-center gap-3 p-3 rounded-xl bg-dark-card border border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-nardo/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-nardo" />
                  </div>
                  <span className="text-sm text-slate-light">{t(`features.${key}`)}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-80 h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-nardo/20 to-nardo/5 rounded-3xl rotate-6" />
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center bg-gradient-to-br from-matte-black/80 to-dark-card/80">
                <svg viewBox="0 0 320 380" className="w-full h-full p-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="nfcGlow" cx="35%" cy="50%" r="60%">
                      <stop offset="0%" stopColor="#C0C0C0" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#C0C0C0" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="waveGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#C0C0C0" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#C0C0C0" stopOpacity="0" />
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

                  {/* NFC Signal Waves - animated via CSS later */}
                  <ellipse cx="100" cy="190" rx="85" ry="85" fill="url(#nfcGlow)">
                    <animate attributeName="rx" values="60;85;60" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="ry" values="60;85;60" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
                  </ellipse>

                  <path d="M130 190 Q150 170 170 190" stroke="#C0C0C0" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" fill="none">
                    <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
                  </path>
                  <path d="M115 190 Q145 155 175 190" stroke="#C0C0C0" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" fill="none">
                    <animate attributeName="opacity" values="0.15;0.5;0.15" dur="2.5s" repeatCount="indefinite" />
                  </path>
                  <path d="M100 190 Q140 140 180 190" stroke="#C0C0C0" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" fill="none">
                    <animate attributeName="opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite" />
                  </path>

                  {/* NFC Card */}
                  <g filter="url(#glow)">
                    <motion.rect
                      x="38" y="155" width="85" height="58" rx="6"
                      fill="url(#cardGrad)" stroke="#C0C0C0" strokeWidth="1.5"
                      initial={{ x: 0 }}
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <rect x="48" y="165" width="30" height="4" rx="2" fill="#C0C0C0" opacity="0.6" />
                    <rect x="48" y="174" width="50" height="3" rx="1.5" fill="#C0C0C0" opacity="0.3" />
                    <rect x="48" y="181" width="35" height="3" rx="1.5" fill="#C0C0C0" opacity="0.2" />
                    <circle cx="108" cy="198" r="8" fill="none" stroke="#C0C0C0" strokeWidth="1.5" opacity="0.5" />
                    <text x="110" y="201" textAnchor="middle" fill="#C0C0C0" fontSize="8" fontWeight="bold" opacity="0.5">NFC</text>
                  </g>

                  {/* Smartphone */}
                  <g>
                    <rect x="195" y="100" width="82" height="170" rx="14" fill="#1a1a1a" stroke="#333" strokeWidth="1.5" />
                    <rect x="201" y="112" width="70" height="140" rx="4" fill="url(#screenGrad)" />
                    {/* Status bar */}
                    <rect x="207" y="118" width="30" height="4" rx="2" fill="#C0C0C0" opacity="0.5" />
                    <circle cx="263" cy="120" r="2.5" fill="#C0C0C0" opacity="0.4" />
                    {/* App icons on screen */}
                    <rect x="211" y="136" width="16" height="16" rx="3" fill="#C0C0C0" opacity="0.15" />
                    <rect x="233" y="136" width="16" height="16" rx="3" fill="#C0C0C0" opacity="0.15" />
                    <rect x="255" y="136" width="16" height="16" rx="3" fill="#C0C0C0" opacity="0.15" />
                    <rect x="211" y="158" width="60" height="8" rx="2" fill="#C0C0C0" opacity="0.1" />
                    <rect x="211" y="172" width="50" height="6" rx="1.5" fill="#C0C0C0" opacity="0.08" />
                    <rect x="211" y="184" width="55" height="6" rx="1.5" fill="#C0C0C0" opacity="0.08" />
                    {/* Contact received indicator */}
                    <rect x="220" y="210" width="30" height="16" rx="4" fill="#C0C0C0" opacity="0.15">
                      <animate attributeName="opacity" values="0.15;0.35;0.15" dur="2s" repeatCount="indefinite" />
                    </rect>
                    <text x="235" y="221" textAnchor="middle" fill="#C0C0C0" fontSize="6" opacity="0.6">TAP</text>
                    {/* Home button */}
                    <circle cx="236" cy="262" r="5" fill="none" stroke="#333" strokeWidth="1" />
                  </g>

                  {/* Floating social icons representing data transfer */}
                  <g filter="url(#softGlow)">
                    {/* Globe */}
                    <circle cx="280" cy="100" r="12" fill="#C0C0C0" opacity="0.12">
                      <animate attributeName="opacity" values="0.08;0.2;0.08" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <path d="M275 96 Q280 93 285 96" stroke="#C0C0C0" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5">
                      <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
                    </path>
                    <path d="M275 104 Q280 107 285 104" stroke="#C0C0C0" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5">
                      <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
                    </path>
                    <path d="M276 100 L284 100" stroke="#C0C0C0" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />

                    {/* Instagram-like icon */}
                    <circle cx="295" cy="155" r="12" fill="#C0C0C0" opacity="0.1">
                      <animate attributeName="opacity" values="0.06;0.18;0.06" dur="3.5s" repeatCount="indefinite" />
                    </circle>
                    <rect x="289" y="149" width="12" height="12" rx="2.5" stroke="#C0C0C0" strokeWidth="1.2" fill="none" opacity="0.45">
                      <animate attributeName="opacity" values="0.25;0.6;0.25" dur="3.5s" repeatCount="indefinite" />
                    </rect>
                    <circle cx="295" cy="155" r="3" stroke="#C0C0C0" strokeWidth="1" fill="none" opacity="0.35" />

                    {/* Linkedin-like icon */}
                    <circle cx="288" cy="215" r="12" fill="#C0C0C0" opacity="0.1">
                      <animate attributeName="opacity" values="0.07;0.18;0.07" dur="4s" repeatCount="indefinite" />
                    </circle>
                    <rect x="283" y="210" width="10" height="10" rx="1.5" fill="#C0C0C0" opacity="0.4">
                      <animate attributeName="opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite" />
                    </rect>
                    <path d="M286 213 L286 218 M290 213 L290 218 M286 213 Q288 215 290 213" stroke="#0a0a0a" strokeWidth="1" fill="none" opacity="0.3" />

                    {/* WhatsApp-like bubble */}
                    <circle cx="280" cy="270" r="12" fill="#C0C0C0" opacity="0.09">
                      <animate attributeName="opacity" values="0.05;0.16;0.05" dur="2.8s" repeatCount="indefinite" />
                    </circle>
                    <path d="M276 265 Q274 265 274 267 L274 272 L277 271 L284 271 Q286 271 286 269 L286 265 Q286 263 284 263 L278 263 Q276 263 276 265Z" stroke="#C0C0C0" strokeWidth="1.2" fill="none" opacity="0.4">
                      <animate attributeName="opacity" values="0.2;0.55;0.2" dur="2.8s" repeatCount="indefinite" />
                    </path>
                  </g>

                  {/* Data transfer particles */}
                  <circle cx="160" cy="160" r="2" fill="#C0C0C0" opacity="0.6">
                    <animate attributeName="cx" values="160;180;200" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="160" cy="200" r="1.5" fill="#C0C0C0" opacity="0.4">
                    <animate attributeName="cx" values="160;185;210" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0;0" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="155" cy="180" r="1.5" fill="#C0C0C0" opacity="0.5">
                    <animate attributeName="cx" values="155;178;200" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0;0" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <div className="bg-matte-black pt-28 lg:pt-36 pb-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass bg-matte-card/60 border border-nardo/20 rounded-2xl p-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
        >
          <Info className="w-4 h-4 text-nardo" />
          <span className="text-slate-light">{p("digitalCardBase", { price: PRICES.DIGITAL_CARD_BASE })}</span>
          <span className="text-slate-muted/60">+</span>
          <span className="text-slate-muted">{p("digitalCardPrint", { price: PRICES.DIGITAL_CARD_PRINT })}</span>
          <span className="text-slate-muted/60">+</span>
          <span className="text-slate-muted">{p("digitalCardShipping")}</span>
        </motion.div>
      </div>
      <BaseForm
        productType="digital-cards"
        productSection={productSection}
        specificFields={({ data, onChange, errors }) => (
          <FormA_DigitalCards data={data} onChange={onChange} errors={errors} />
        )}
        hideThemeSelector
      />
    </>
  );
}
