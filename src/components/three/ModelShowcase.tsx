"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { modelRig } from "./rig";

function webglSupported(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function isSupported(): boolean {
  try {
    return webglSupported() && window.matchMedia("(min-width: 768px)").matches;
  } catch {
    return false;
  }
}

function subscribeSupported(callback: () => void): () => void {
  const mq = window.matchMedia("(min-width: 768px)");
  mq.addEventListener("change", callback);
  window.addEventListener("resize", callback);
  return () => {
    mq.removeEventListener("change", callback);
    window.removeEventListener("resize", callback);
  };
}

function FallbackCard() {
  const t = useTranslations("home");
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const cardX = useTransform(scrollYProgress, [0.25, 0.75], [0, 180]);
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5]);

  return (
    <div
      ref={sectionRef}
      className="pointer-events-none relative z-10 flex h-[55vh] w-full items-center justify-center sm:h-[65vh]"
      style={{ perspective: "1200px" }}
    >
      <div className="flex w-full flex-col items-center gap-8">
        <div className="relative h-48 w-full max-w-md sm:h-56" aria-hidden="true">
          <motion.div
            style={{ rotateY, boxShadow: useTransform(glow, (v) => `0 0 ${60 * v}px rgba(104,176,183,${0.45 * v})`) }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative h-40 w-64 rounded-2xl border border-gold/25 bg-matte-dark/80 p-4 backdrop-blur-sm will-change-transform sm:h-44 sm:w-72">
              <div className="absolute inset-2.5 rounded-xl bg-gradient-to-br from-gold/15 to-transparent" />
              <div className="absolute inset-x-6 top-6 h-5 rounded-full bg-gold/30" />
              <div className="absolute inset-x-6 top-[3.4rem] h-2.5 w-3/5 rounded-full bg-slate-500/30" />
              <div className="absolute inset-x-6 top-[4.4rem] h-2.5 w-2/5 rounded-full bg-slate-500/20" />
              <div className="absolute end-6 bottom-6 h-10 w-10 rounded-lg bg-gold/25" />
              <div className="absolute start-6 bottom-6 flex h-6 w-10 items-center justify-center rounded-md border border-gold/40 text-[9px] font-bold text-gold">
                NFC
              </div>
            </div>
          </motion.div>

          <motion.div
            style={{ x: cardX }}
            className="absolute top-4 end-0 hidden h-24 w-40 rounded-xl border border-gold/20 bg-matte-dark/70 p-3 backdrop-blur-sm will-change-transform sm:block"
          >
            <div className="h-2 w-14 rounded-full bg-gold/30" />
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-500/25" />
            <div className="mt-1.5 h-1.5 w-3/4 rounded-full bg-slate-500/20" />
            <div className="mt-3 flex items-center gap-1.5">
              <div className="h-6 w-6 rounded-md bg-gold/25" />
              <span className="text-[8px] font-bold text-gold">TAP · NFC</span>
            </div>
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm text-slate-muted tracking-wide sm:text-base"
        >
          {t("modelHint")}
        </motion.p>
      </div>
    </div>
  );
}

function SceneMount() {
  const [Scene, setScene] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("./ModelScene").then((mod) => {
      if (!cancelled) setScene(() => mod.default);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!Scene) return null;
  return <Scene />;
}

export default function ModelShowcase() {
  const t = useTranslations("home");
  const sectionRef = useRef<HTMLDivElement>(null);
  const supported = useSyncExternalStore(
    subscribeSupported,
    isSupported,
    () => false
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0.4]);

  useEffect(() => scrollYProgress.on("change", (v) => {
    modelRig.scroll += (v - modelRig.scroll) * 0.1;
  }), [scrollYProgress]);

  const cardSlideProgress = useTransform(scrollYProgress, [0.25, 0.75], [0, 1]);

  useEffect(() => cardSlideProgress.on("change", (v) => {
    modelRig.cardSlide += (v - modelRig.cardSlide) * 0.1;
  }), [cardSlideProgress]);

  return (
    <section id="model-showcase" ref={sectionRef} className="relative h-[200vh] overflow-hidden">
      <div className="sticky top-0 flex h-screen items-center justify-center">
        {supported ? (
          <motion.div style={{ y, opacity }} className="pointer-events-none relative z-10 h-[55vh] w-full sm:h-[65vh]">
            <SceneMount />
            <div className="pointer-events-auto absolute bottom-6 inset-x-0 z-20 text-center px-4">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-sm sm:text-base text-slate-muted tracking-wide"
              >
                {t("modelHint")}
              </motion.p>
            </div>
          </motion.div>
        ) : (
          <FallbackCard />
        )}
      </div>
    </section>
  );
}