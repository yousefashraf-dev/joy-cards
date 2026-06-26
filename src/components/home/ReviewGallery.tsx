"use client";

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
    <section className="py-20 lg:py-28 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="relative">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none">
            {reviews.map((src, i) => (
              <div
                key={src}
                className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
              >
                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Review ${i + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
