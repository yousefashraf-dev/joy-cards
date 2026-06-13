"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

const TOUR_STEPS = ["orderLogo", "previewDesign", "enterData"] as const;
const DURATION_MS = 2000;
const FADE_MS = 500;

export default function OnboardingTour() {
  const t = useTranslations("onboarding");
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const completed = localStorage.getItem("gotap_tour_completed");
    if (completed) return;
    setActiveIndex(0);
  }, []);

  const advance = useCallback(() => {
    setActiveIndex((prev) => {
      const next = prev + 1;
      if (next >= TOUR_STEPS.length) {
        localStorage.setItem("gotap_tour_completed", "true");
        return -1;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (activeIndex < 0) return;
    const timer = setTimeout(advance, DURATION_MS);
    return () => clearTimeout(timer);
  }, [activeIndex, advance]);

  if (activeIndex < 0) return null;

  return (
    <div className="fixed inset-0 z-[90] pointer-events-none">
      <div className="absolute bottom-24 sm:bottom-28 start-1/2 -translate-x-1/2 w-full max-w-sm px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: FADE_MS / 1000 }}
            className="glass-strong bg-dark-card/90 border border-white/10 rounded-2xl p-5 shadow-2xl text-center"
          >
            <p className="text-slate-light text-sm font-medium">
              {t(TOUR_STEPS[activeIndex])}
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "bg-nardo w-4"
                      : i < activeIndex
                        ? "bg-nardo/30"
                        : "bg-white/20"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
