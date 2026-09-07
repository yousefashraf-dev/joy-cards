"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Star, Award } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

export default function TrustSection() {
  const t = useTranslations("home");

  const stats = [
    { v: t("trustC1v"), l: t("trustC1l") },
    { v: t("trustC2v"), l: t("trustC2l") },
    { v: t("trustC3v"), l: t("trustC3l") },
    { v: t("trustC4v"), l: t("trustC4l") },
  ];

  return (
    <section id="trust" className="py-20 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.04] to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading title={t("trustTitle")} subtitle={t("trustSub")} />

        <div className="card-solid rounded-3xl px-6 py-10 lg:py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <div className="flex items-center gap-1.5">
                  {i === 2 && <Star className="w-4 h-4 fill-gold text-gold" />}
                  {i === 0 && <Award className="w-4 h-4 text-gold" />}
                  <span className="text-3xl lg:text-4xl font-black text-gradient-gold" dir="ltr">
                    {s.v}
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-slate-muted">{s.l}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}