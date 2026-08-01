"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Fingerprint, Share2, Link } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  { icon: Fingerprint, key: "step1" },
  { icon: Share2, key: "step2" },
  { icon: Link, key: "step3" },
];

export default function HowItWorksSection() {
  const t = useTranslations("howItWorks");

  return (
    <section className="py-20 lg:py-28 bg-matte-dark/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("title")} />

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.key}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
              >
                <div className="w-20 h-20 rounded-2xl glass-card flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-10 h-10 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-slate-light mb-3">
                  {t(`${step.key}`)}
                </h3>
                <p className="text-slate-muted text-sm leading-relaxed max-w-xs mx-auto">
                  {t(`${step.key}Desc`)}
                </p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[60%] h-px bg-gradient-to-r from-gold/30 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
