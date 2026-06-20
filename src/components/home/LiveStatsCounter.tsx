"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function LiveStatsCounter() {
  const t = useTranslations("liveStatsCounter");

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          className="inline-block px-8 py-6 rounded-2xl float-card border border-white/5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-3xl md:text-4xl font-bold text-slate-light mb-2">
            {t("stats")}
          </p>
          <p className="text-slate-muted text-sm md:text-base">
            {t("subtitle")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
