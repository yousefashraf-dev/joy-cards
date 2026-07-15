"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Heart, MapPin, Clock, QrCode, Share2, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function WeddingCardsPage() {
  const t = useTranslations("products.weddingCards");
  const tc = useTranslations("currency");
  const n = useTranslations("nav");

  const items = t.raw("whatYouCanAdd") as string[];

  return (
    <div className="min-h-screen bg-matte-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-gold" />
              <span className="text-sm text-gold font-medium uppercase tracking-widest">
                {t("badge")}
              </span>
              <Heart className="w-6 h-6 text-gold" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-light mb-6">
              {t("title")}
            </h1>
            <p className="text-lg text-slate-muted max-w-2xl mx-auto leading-relaxed">
              {t("desc")}
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {[
            { icon: Heart, label: t.raw("whatYouCanAdd")[0] || "Couple photos" },
            { icon: MapPin, label: t.raw("whatYouCanAdd")[3] || "Venue & location" },
            { icon: Clock, label: t.raw("whatYouCanAdd")[2] || "Countdown timer" },
            { icon: QrCode, label: t.raw("whatYouCanAdd")[6] || "QR Code sharing" },
            { icon: Share2, label: t.raw("whatYouCanAdd")[5] || "RSVP via WhatsApp" },
            { icon: MessageCircle, label: t.raw("whatYouCanAdd")[4] || "Dress code guide" },
          ].slice(0, 6).map((feat, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-gold/30 hover:bg-white/10 hover:border-gold/70 transition-all duration-300"
            >
              <feat.icon className="w-8 h-8 text-gold mb-4" />
              <p className="text-sm text-slate-light">{feat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* What You Can Add List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto mb-16 p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-gold/30"
        >
          <h2 className="text-xl font-bold text-slate-light mb-6 text-center">
            What you can add on your card:
          </h2>
          <ul className="space-y-3">
            {items.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-muted">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                  <Heart className="w-3 h-3 text-gold" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Link
            href="/wedding/order"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gold text-matte-dark font-bold text-lg hover:bg-gold-light transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.3)]"
          >
            <Heart className="w-5 h-5" />
            اطلب الآن
          </Link>
          <p className="text-xs text-slate-muted/50 mt-4">
            {t("badge")} — {tc("egp")}
          </p>
        </motion.div>

        {/* Back link */}
        <div className="text-center mt-12">
          <Link href="/" className="text-sm text-slate-muted hover:text-gold transition-colors">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
