"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";

const reviews = [
  "/review_1.jpeg",
  "/review_2.jpeg",
  "/review_3.jpeg",
  "/review_4.jpeg",
  "/review_5.jpeg",
];

export default function ReviewGallery() {
  const t = useTranslations("reviewGallery");

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-5xl mx-auto px-4">
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <div className="flex md:grid flex-nowrap md:grid-cols-2 lg:grid-cols-3 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-none gap-4 pb-4 md:pb-0">
          {reviews.map((src, i) => (
            <motion.div
              key={src}
              className="min-w-[280px] sm:min-w-[320px] snap-center bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl hover:scale-[1.02] transition-transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Image
                src={src}
                alt={`Review ${i + 1}`}
                width={400}
                height={500}
                className="w-full h-auto object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
