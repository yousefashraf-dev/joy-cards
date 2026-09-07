"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function CafeShowcaseSection() {
  const t = useTranslations("cafeShowcase");

  const benefits = [
    {
      icon: "💰",
      title: t("benefit1Title"),
      desc: t("benefit1Desc"),
    },
    {
      icon: "⚡️",
      title: t("benefit2Title"),
      desc: t("benefit2Desc"),
    },
    {
      icon: "🌟",
      title: t("benefit3Title"),
      desc: t("benefit3Desc"),
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-matte-dark/50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="group relative rounded-2xl overflow-hidden float-card"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/nfc-cafe.webp"
            alt="GoTap NFC sticker on a marble table next to a smartphone displaying a digital menu"
            width={600}
            height={500}
            loading="lazy"
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-slate-light leading-tight">
            {t("title")}
          </h3>

          <p className="text-slate-muted text-base md:text-lg leading-relaxed">
            {t("desc")}
          </p>

          <ul className="space-y-4 pt-2">
            {benefits.map((item, i) => (
              <motion.li
                key={item.title}
                className="flex items-start gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <strong className="text-slate-body font-semibold">
                    {item.title}
                  </strong>
                  {" "}
                  <span className="text-slate-muted">{item.desc}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
