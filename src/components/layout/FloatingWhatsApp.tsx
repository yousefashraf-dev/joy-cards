"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { WHATSAPP_ORDERS_LINK, WHATSAPP_LINK } from "@/lib/constants";

const DISMISS_KEY = "gotap-fab-dismissed";

export default function FloatingWhatsApp() {
  const t = useTranslations("floatingWhatsapp");
  const pathname = usePathname();
  const [panelOpen, setPanelOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      dismissed = false;
    }
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setPanelOpen(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      void 0;
    }
  };

  const hasStickyBar =
    pathname === "/" || pathname === "/ar" || pathname === "/shop" || pathname === "/ar/shop";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className={`fixed ${hasStickyBar ? "bottom-[104px]" : "bottom-4 sm:bottom-6"} end-4 sm:end-6 z-50 flex flex-col items-end gap-3`}
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss WhatsApp button"
            className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <AnimatePresence>
            {panelOpen && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="glass bg-dark-card/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 w-80 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-light">{t("title")}</h3>
                  <button
                    type="button"
                    onClick={() => setPanelOpen(false)}
                    aria-label="Close panel"
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
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setPanelOpen((prev) => !prev)}
            aria-label={t("title")}
            className="relative w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-md shadow-black/20 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 group"
          >
            <div className="absolute inset-0 rounded-full bg-[#25D366]/20" />
            <MessageCircle className="w-5 h-5 text-white relative z-10" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
