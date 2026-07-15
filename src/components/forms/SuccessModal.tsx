"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { CheckCircle2, X } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { WHATSAPP_LINK } from "@/lib/constants";

interface OrderDetails {
  customerName: string;
  phone: string;
  productType: string;
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWhatsappClick?: () => void;
  orderDetails?: OrderDetails;
  totalPrice?: number;
  shippingFee?: number;
}

export default function SuccessModal({ isOpen, onClose, onWhatsappClick, orderDetails, totalPrice, shippingFee }: SuccessModalProps) {
  const t = useTranslations("products.success");
  const tp = useTranslations("products");
  const tc = useTranslations("currency");

  const PRODUCT_KEY: Record<string, string> = {
    "auto-tap": "autoTap",
    "digital-cards": "digitalCards",
    "business-tap": "businessTap",
    "wedding": "weddingCards",
  };

  const productLabel = orderDetails
    ? tp(`${PRODUCT_KEY[orderDetails.productType] || orderDetails.productType}.title`)
    : "";

  const totalLine = totalPrice
    ? t("totalLine", { total: totalPrice, currency: tc("egp"), shipping: shippingFee ?? 0 })
    : "";

  const whatsappText = t("whatsappMessage", {
    product: productLabel,
    name: orderDetails?.customerName || "",
    phone: orderDetails?.phone || "",
    total: totalPrice?.toString() || "",
    shipping: shippingFee?.toString() || "",
  }) + totalLine;
  const whatsappUrl = `${WHATSAPP_LINK}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className="relative glass-strong bg-dark-card border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 text-center"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 end-4 text-slate-muted hover:text-slate-light transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-nardo/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-nardo" />
            </div>

            <h3 className="text-2xl font-bold text-slate-light mb-4">
              {t("title")}
            </h3>

            <p className="text-slate-muted text-sm mb-6 leading-relaxed">
              {t("description")}
            </p>

            {totalPrice !== undefined && shippingFee !== undefined && (
              <div className="mb-6 p-4 rounded-xl bg-cyan/[0.04] border border-cyan/20">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-slate-muted">{t("total.base")}</span>
                  <span className="text-slate-light font-medium">{totalPrice - shippingFee} {tc("egp")}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-slate-muted">{t("total.shipping")}</span>
                  <span className="text-slate-light font-medium">{shippingFee} {tc("egp")}</span>
                </div>
                <div className="border-t border-cyan/20 my-2 pt-2 flex justify-between items-center">
                  <span className="text-cyan font-bold">{t("total.total")}</span>
                  <span className="text-cyan font-bold text-lg">{totalPrice} {tc("egp")}</span>
                </div>
              </div>
            )}

            <PrimaryButton
              onClick={() => {
                window.open(whatsappUrl, "_blank", "noopener,noreferrer");
                onWhatsappClick?.();
              }}
            >
              {t("whatsappBtn")}
            </PrimaryButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
