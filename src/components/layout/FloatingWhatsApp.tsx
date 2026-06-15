"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle, X } from "lucide-react";
import { WHATSAPP_ORDERS_LINK, WHATSAPP_LINK } from "@/lib/constants";

export default function FloatingWhatsApp() {
  const t = useTranslations("floatingWhatsapp");
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 end-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className="glass bg-dark-card/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 w-80 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-light">{t("title")}</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-slate-muted hover:text-slate-light transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <a
              href={WHATSAPP_ORDERS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-[#25D366]/10 border border-white/5 hover:border-[#25D366]/30 transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-full bg-[#25D366]/20 flex items-center justify-center shrink-0 group-hover:bg-[#25D366]/30 transition-colors">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
              </div>
              <div>
                <p className="text-xs text-slate-muted leading-relaxed">
                  {t("option1")}
                </p>
                <p className="text-sm font-bold text-[#25D366] mt-1" dir="ltr">
                  {t("option1Phone")}
                </p>
              </div>
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-[#25D366]/10 border border-white/5 hover:border-[#25D366]/30 transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-full bg-[#25D366]/20 flex items-center justify-center shrink-0 group-hover:bg-[#25D366]/30 transition-colors">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
              </div>
              <div>
                <p className="text-xs text-slate-muted leading-relaxed">
                  {t("option2")}
                </p>
                <p className="text-sm font-bold text-[#25D366] mt-1" dir="ltr">
                  {t("option2Phone")}
                </p>
              </div>
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center shadow-md shadow-black/20 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 group"
      >
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-10 group-hover:opacity-20" style={{ animationDuration: "2s" }} />
        <MessageCircle className="w-5 h-5 text-white relative z-10" />
      </button>
    </div>
  );
}
