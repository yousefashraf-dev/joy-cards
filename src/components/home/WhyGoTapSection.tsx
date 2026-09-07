"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Gem, Headphones, Zap, ShieldCheck } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const items = [
  { key: "Quality", icon: Gem },
  { key: "Support", icon: Headphones },
  { key: "Speed", icon: Zap },
  { key: "Warranty", icon: ShieldCheck },
];

export default function WhyGoTapSection() {
  const t = useTranslations("home");

  return (
    <section id="why-gotap" className="py-20 lg:py-28 bg-matte-dark/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("whyTitle")} subtitle={t("whySub")} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group card-solid rounded-2xl p-6 hover:border-gold/40 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(198,165,104,0.25)] transition-all duration-300">
                  <Icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-lg font-bold text-slate-light mb-2">
                  {t(`why${item.key}Title`)}
                </h3>
                <p className="text-sm text-slate-muted leading-relaxed">
                  {t(`why${item.key}Desc`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}