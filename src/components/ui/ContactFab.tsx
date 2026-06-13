"use client";

import { MessageCircle } from "lucide-react";
import { WHATSAPP_ORDERS_LINK } from "@/lib/constants";
import { useTranslations } from "next-intl";

export default function ContactFab() {
  const t = useTranslations("contactFab");

  return (
    <div className="fixed bottom-6 start-1/2 -translate-x-1/2 z-50">
      <a
        href={WHATSAPP_ORDERS_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full glass-strong bg-neon-green/10 border border-neon-green/30 text-neon-green shadow-lg shadow-neon-green/20 hover:shadow-neon-green/40 hover:scale-105 active:scale-95 transition-all duration-200 group"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-neon-green animate-ping opacity-20 group-hover:opacity-30" style={{ animationDuration: "2s" }} />
          <MessageCircle className="w-5 h-5 relative z-10" />
        </div>
        <span className="text-sm font-semibold">{t("contactUs")}</span>
      </a>
    </div>
  );
}
