"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";

const faqIndices = [1, 2, 3];

export default function FaqAccordion() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="py-20 lg:py-28 bg-matte-dark/50">
      <div className="max-w-3xl mx-auto px-4">
        <SectionHeading title={t("title")} />
        <div className="space-y-3">
          {faqIndices.map((idx, i) => (
            <div
              key={i}
              className="bg-dark-card border border-white/5 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex justify-between items-center p-4 text-right text-slate-light font-semibold text-sm md:text-base"
              >
                <span>{t(`q${idx}`)}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-muted transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-slate-muted text-sm leading-relaxed">
                      {t(`a${idx}`)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
