"use client";

import { useTranslations } from "next-intl";
import { Heart, Sparkles, Infinity, Gift } from "lucide-react";
import WeddingOrderForm from "@/components/forms/WeddingOrderForm";

export default function WeddingOrderPage() {
  const t = useTranslations("weddingOrder");

  const features = [
    { icon: Heart, key: "loveStory" },
    { icon: Sparkles, key: "countdown" },
    { icon: Infinity, key: "venue" },
    { icon: Gift, key: "dressCode" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-28 pb-12 lg:pt-36 lg:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-matte-black to-matte-black" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs mb-6">
                <Heart className="w-4 h-4" />
                <span>{t("badge")}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-light mb-6">
                {t("pageTitle")}
              </h1>
              <p className="text-slate-muted text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                {t("pageDesc")}
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                {features.map(({ icon: Icon, key }) => (
                  <div key={key}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                  >
                    <Icon className="w-4 h-4 text-pink-400" />
                    <span className="text-xs text-slate-light">{t(`features.${key}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="glass bg-dark-card/50 border border-white/5 rounded-2xl p-6 lg:p-8">
              <WeddingOrderForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
