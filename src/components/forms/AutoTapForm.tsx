"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ChevronRight, ChevronLeft, Upload, X, ImageIcon, Check, Camera, Music2, Ghost, ThumbsUp, MessageCircle, Phone, Send, Truck, Store,
} from "lucide-react";
import type { AutoTapFormData } from "@/lib/types";
import { submitOrder } from "@/lib/submitOrder";
import { calcTotal, BASE_PRICE } from "@/lib/pricing";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SuccessModal from "./SuccessModal";
import AutoTapPreview from "./AutoTapPreview";
import { useLoading } from "@/components/ui/LoadingProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { compressImage } from "@/lib/compressImage";

const ALL_STEPS = ["shipping", "customization", "theme", "sizing", "review"] as const;

interface AutoTapFormProps {
  data: AutoTapFormData;
  onChange: (key: string, value: string | boolean | Record<string, string>) => void;
  onSubmitComplete: () => void;
}

const sizeImages: Record<string, string> = {
  "6": "/2.jpeg",
  "25": "/1.jpeg",
  "35": "/3.jpeg",
};



export default function AutoTapForm({ data, onChange, onSubmitComplete }: AutoTapFormProps) {
  const t = useTranslations("products.forms");
  const e = useTranslations("products.errors");
  const at = useTranslations("products.autoTap");
  const tm = useTranslations("messages");
  const st = useTranslations("products.steps");
  const tc = useTranslations("currency");
  const locale = useLocale();

  const [step, setStep] = useState(0);
  const stepperRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const currentSteps = ALL_STEPS;
  const currentStep = currentSteps[step];

  useEffect(() => {
    stepperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderPricing, setOrderPricing] = useState<{ totalPrice: number; shippingFee: number } | null>(null);
  const [uploading, setUploading] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();

  const clearError = useCallback((key: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const handleFieldChange = useCallback(
    (key: string, value: string | boolean) => {
      onChange(key, value);
      clearError(key);
    },
    [onChange, clearError]
  );

  const handleSocialLinkChange = useCallback(
    (id: string, value: string) => {
      const updated = { ...data.socialLinks, [id]: value };
      onChange("socialLinks", updated);
      clearError(id);
    },
    [data.socialLinks, onChange, clearError]
  );

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    showLoading(t("uploading"));
    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append("file", compressed);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const resData = await res.json();
      if (!res.ok) {
        showToast(resData?.error || t("uploadError"), "error");
        return;
      }
      if (resData.url) {
        onChange("logo", resData.url);
        showToast(t("uploadSuccess"), "success");
      } else {
        showToast(t("uploadError"), "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("uploadError");
      showToast(msg, "error");
    } finally {
      hideLoading();
      setUploading(false);
      e.target.value = "";
    }
  };

  const validateStep = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentStep === "shipping") {
      if (!data.customerName.trim()) newErrors.customerName = e("required");
      if (!data.phone.trim()) newErrors.phone = e("required");
      else if (!/^\+?[0-9]{7,15}$/.test(data.phone.replace(/[\s-]/g, ""))) {
        newErrors.phone = e("invalidPhone");
      }
      if (data.deliveryType === "shipping" && !data.addressDetail.trim()) newErrors.addressDetail = e("required");
    } else if (currentStep === "customization") {
      if (!data.displayName.trim()) newErrors.displayName = e("required");
    } else if (currentStep === "sizing") {
      if (!data.logoWidthCm.trim()) {
        newErrors.logoWidthCm = e("required");
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentStep, data, e]);

  const handleNext = () => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, currentSteps.length - 1));
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    setErrors({});
  };

  const TIMEOUT_MS = 30000;
  const completedRef = useRef(false);

  const handleSubmit = async () => {
    if (!validateStep()) return;
    if (uploading) {
      showToast(tm("waitUpload"), "error");
      return;
    }
    completedRef.current = false;
    setSubmitting(true);
    showLoading(tm("sending"));

    const safetyTimer = setTimeout(() => {
      if (completedRef.current) return;
      hideLoading();
      setSubmitting(false);
      showToast(tm("networkError"), "error");
    }, TIMEOUT_MS);

    const pricing = data.deliveryType === "shipping"
      ? calcTotal(data.addressDetail)
      : { basePrice: BASE_PRICE, shippingFee: 0, total: BASE_PRICE };
    setOrderPricing({ totalPrice: pricing.total, shippingFee: pricing.shippingFee });

    const formattedSocials: Record<string, string> = {};
    for (const [key, val] of Object.entries(data.socialLinks)) {
      if (val.trim()) {
        formattedSocials[key] = val.trim();
      }
    }

    try {
      await submitOrder({
        customerName: data.customerName.trim(),
        displayName: data.displayName.trim() || undefined,
        phone: data.phone.trim(),
        governorate: "",
        city: "",
        street: data.deliveryType === "shipping" ? data.addressDetail.trim() : "",
        theme: data.theme,
        productType: "auto-tap",
        logo: data.logo || undefined,
        socialLinks: formattedSocials,
        autoTapFields: {
          stickerType: "username",
          logoWidthCm: data.logoWidthCm.trim() || "6",
          orderNotes: data.orderNotes.trim() || undefined,
          addressDetail: data.deliveryType === "shipping" ? data.addressDetail.trim() : "",
          usernameValue: data.usernameValue.trim() || undefined,
          deliveryType: data.deliveryType,
        },
      }, pricing.total, locale);
      completedRef.current = true;
      clearTimeout(safetyTimer);
      showToast(tm("sent"), "success");
      hideLoading();
      setSubmitting(false);
      setShowSuccess(true);
    } catch {
      completedRef.current = true;
      clearTimeout(safetyTimer);
      hideLoading();
      setSubmitting(false);
      showToast(tm("failed"), "error");
    }
  };

  const handleFormReset = useCallback(() => {
    setStep(0);
    setErrors({});
    setOrderPricing(null);
    onSubmitComplete();
  }, [onSubmitComplete]);

  const renderStepIndicator = () => (
    <div ref={stepperRef} className="flex items-center justify-center gap-2 mb-8 flex-wrap">
      {currentSteps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              i === step
                ? "bg-nardo text-matte-dark shadow-[0_0_14px_rgba(192,192,192,0.4)]"
                : i < step
                  ? "bg-nardo/30 text-nardo border border-nardo/10"
                  : "bg-dark-card border border-white/20 text-slate-body"
            }`}
          >
            {i < step ? <Check className="w-4 h-4" /> : i + 1}
          </div>
          <span
            className={`text-xs hidden sm:block ${
              i === step ? "text-nardo font-bold" : "text-slate-body"
            }`}
          >
            {st(s)}
          </span>
          {i < currentSteps.length - 1 && (
            <div
              className={`w-8 h-0.5 ${
                i < step ? "bg-nardo/50" : "bg-white/10"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const inputClass = (key: string) =>
    `w-full px-4 py-2.5 rounded-lg glass bg-dark-card border text-sm text-slate-light placeholder:text-slate-muted/60 focus:outline-none focus:border-nardo focus:ring-1 focus:ring-nardo/30 transition-all duration-200 ${
      errors[key] ? "border-red-400" : "border-white/20"
    }`;

  const renderError = (key: string) =>
    errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>;

  const SOCIAL_FIELDS = [
    { id: "instagram", icon: Camera, label: t("fields.instagram") },
    { id: "tiktok", icon: Music2, label: t("fields.tiktok") },
    { id: "snapchat", icon: Ghost, label: t("fields.snapchat") },
    { id: "facebook", icon: ThumbsUp, label: t("fields.facebook") },
    { id: "telegram", icon: Send, label: t("fields.telegram") },
    { id: "whatsapp", icon: MessageCircle, label: t("fields.whatsapp") },
    { id: "phoneSocial", icon: Phone, label: t("fields.phoneSocial") },
  ];

  const reviewPricing = data.deliveryType === "shipping"
    ? calcTotal(data.addressDetail)
    : { basePrice: BASE_PRICE, shippingFee: 0, total: BASE_PRICE };

  return (
    <div>
      {renderStepIndicator()}

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Step 1: Shipping Information */}
        {currentStep === "shipping" && (
          <div className="space-y-5 px-2 sm:px-3">
            <h3 className="text-lg font-semibold text-nardo mb-4">
              {t("section.personal")}
            </h3>

            {/* Delivery type toggle */}
            <div>
              <label className="block text-sm text-slate-body mb-2">
                {at("delivery.title")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleFieldChange("deliveryType", "shipping")}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    data.deliveryType === "shipping"
                      ? "border-nardo bg-nardo/15 text-nardo shadow-[0_0_16px_rgba(192,192,192,0.12)]"
                      : "border-white/20 bg-dark-card/50 text-slate-body hover:border-nardo/40"
                  }`}
                >
                  <Truck className="w-4 h-4 shrink-0" />
                  <span className="text-start leading-tight">{at("delivery.shippingOpt")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFieldChange("deliveryType", "no_shipping")}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    data.deliveryType === "no_shipping"
                      ? "border-nardo bg-nardo/15 text-nardo shadow-[0_0_16px_rgba(192,192,192,0.12)]"
                      : "border-white/20 bg-dark-card/50 text-slate-body hover:border-nardo/40"
                  }`}
                >
                  <Store className="w-4 h-4 shrink-0" />
                  <span className="text-start leading-tight">{at("delivery.noShippingOpt")}</span>
                </button>
              </div>
              <p className="text-xs text-slate-muted/70 mt-2 flex items-center gap-1.5">
                {data.deliveryType === "shipping"
                  ? at("delivery.shippingHint")
                  : at("delivery.noShippingHint")}
              </p>
            </div>

            <div>
              <label className="block text-sm text-slate-body mb-1.5">
                {locale === "en" ? "الاسم الثلاثي بالعربي" : t("fields.customerName")}
              </label>
              <input
                type="text"
                value={data.customerName}
                onChange={(e) => handleFieldChange("customerName", e.target.value)}
                lang="ar"
                className={inputClass("customerName")}
              />
              {renderError("customerName")}
            </div>
            <div>
              <label className="block text-sm text-slate-body mb-1.5">
                {t("fields.phone")}
              </label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={data.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                className={inputClass("phone")}
              />
              {renderError("phone")}
            </div>
            <AnimatePresence mode="wait">
              {data.deliveryType === "shipping" && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <label className="block text-sm text-slate-body mb-1.5">
                    {locale === "en" ? "العنوان بالتفصيل" : t("fields.addressDetail")}
                  </label>
                  <input
                    type="text"
                    value={data.addressDetail}
                    onChange={(e) => handleFieldChange("addressDetail", e.target.value)}
                    placeholder={t("placeholders.addressDetail")}
                    lang="ar"
                    className={inputClass("addressDetail")}
                  />
                  {renderError("addressDetail")}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Step 2: Profile Customization */}
        {currentStep === "customization" && (
          <div className="space-y-5 px-2 sm:px-3">
            <h3 className="text-lg font-semibold text-nardo mb-4">
              {t("section.customization")}
            </h3>

            {/* Display Name + Live Preview */}
            <div>
              <label className="block text-sm text-slate-body mb-1.5">
                {t("fields.displayName")}
                <span className="text-xs text-slate-body/60 ms-1">({t("fields.optional")})</span>
              </label>
              <input
                type="text"
                value={data.displayName}
                onChange={(e) => handleFieldChange("displayName", e.target.value)}
                placeholder={t("fields.displayNameHelper")}
                lang="ar"
                className={inputClass("displayName")}
              />
              {renderError("displayName")}
            </div>

            {/* Live Name Preview */}
            <div className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-gold/20">
              <div className="shrink-0">
                <div className="w-20 h-20 rounded-full ring-2 ring-gold/40 ring-offset-2 ring-offset-navy flex items-center justify-center bg-gradient-to-br from-gold/20 to-navy-light shadow-[0_0_20px_rgba(198,165,104,0.15)]">
                  {data.displayName.trim() ? (
                    <span className="text-2xl font-bold text-gold drop-shadow-[0_0_8px_rgba(198,165,104,0.4)]">
                      {data.displayName.trim().charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <svg className="w-8 h-8 text-gold/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gold/60 mb-1 font-medium tracking-wide">
                  {t("nameFrameGuide")}
                </p>
                <p className="text-lg font-bold text-slate-light truncate drop-shadow-[0_0_6px_rgba(255,255,255,0.1)]"
                   style={{ fontFamily: "var(--font-signature)" }}
                >
                  {data.displayName.trim() || "الاسم هنا"}
                </p>
                <p className="text-[10px] text-slate-muted/50 mt-0.5">
                  الاسم يظهر مباشرة أثناء الكتابة
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <label className="flex items-center gap-2 text-sm text-slate-body mb-3">
                <span>{t("section.social")}</span>
                <span className="text-xs text-slate-body/60">({t("fields.optional")})</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SOCIAL_FIELDS.map(({ id, icon: Icon, label }) => (
                  <div key={id}>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <Icon className="w-4 h-4 text-slate-muted/60" />
                      </div>
                      <input
                        type="text"
                        value={data.socialLinks[id] || ""}
                        onChange={(e) => handleSocialLinkChange(id, e.target.value)}
                        placeholder={label}
                        className={`${inputClass(id)} ps-10`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Logo Upload */}
            <div>
              <label className="flex items-center gap-2 text-sm text-slate-body mb-3">
                <ImageIcon className="w-4 h-4" />
                <span>{t("fields.logo")}</span>
                <span className="text-xs text-slate-body/60">({t("fields.optional")})</span>
              </label>
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-28 h-28">
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className={`w-28 h-28 rounded-full bg-gradient-to-br from-gold/10 to-navy-light border-2 border-dashed flex items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden ${
                      uploading ? "border-gold animate-pulse" : data.logo ? "border-gold/70 shadow-[0_0_20px_rgba(198,165,104,0.2)]" : "border-gold/40 hover:border-gold/70 hover:shadow-[0_0_25px_rgba(198,165,104,0.2)]"
                    }`}
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] text-gold/70">{t("uploading")}</span>
                      </div>
                    ) : data.logo ? (
                      <Image src={data.logo} alt="Logo" width={112} height={112} className="w-full h-full object-cover rounded-full" unoptimized />
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="w-8 h-8 text-gold/60" />
                        <span className="text-[10px] text-gold/60">ارفع الشعار</span>
                      </div>
                    )}
                  </div>
                  {!uploading && data.logo && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange("logo", "");
                      }}
                      className="absolute -top-1 -end-1 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors z-10"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-muted/60 text-center max-w-[200px]">
                  {data.logo ? "اضغط على الصورة لتغييرها" : "اضغط لرفع شعار الشركة أو صورتك الشخصية"}
                </p>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Theme Selection */}
        {currentStep === "theme" && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-nardo mb-4">
              {t("section.theme")}
            </h3>
            <AutoTapPreview
              data={data}
              onThemeChange={(theme) => handleFieldChange("theme", theme)}
              onLogoChange={(url) => handleFieldChange("logo", url)}
            />
          </div>
        )}

        {/* Step 4: Size & Notes */}
        {currentStep === "sizing" && (
          <div className="space-y-5 px-2 sm:px-3">
            <h3 className="text-lg font-semibold text-gradient-gold mb-4">
              {t("section.size")}
            </h3>

            <div className="grid grid-cols-3 gap-3 mb-3">
              {(["6", "25", "35"] as const).map((size) => {
                const labels: Record<string, string> = { "6": "6", "25": "25", "35": "35" };
                return (
                  <motion.button
                    key={size}
                    type="button"
                    onClick={() => handleFieldChange("logoWidthCm", size)}
                    className={`flex flex-col items-center gap-1 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      data.logoWidthCm === size
                        ? "border-gold bg-gold/10 text-gold shadow-[0_0_20px_rgba(198,165,104,0.2)]"
                        : "border-white/10 bg-dark-card/50 text-slate-body hover:border-gold/40 hover:bg-gold/5"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-2xl font-bold">{labels[size]}</span>
                    <span className="text-[10px] text-slate-muted">{t("sizeCm")}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Manual Size Input */}
            <div>
              <label className="block text-sm text-slate-body mb-1.5">
                مقاس مخصص (سم)
                <span className="text-xs text-slate-body/60 ms-1">({t("fields.optional")})</span>
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={data.logoWidthCm && !["6", "25", "35"].includes(data.logoWidthCm) ? data.logoWidthCm : ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d+(\.\d?)?$/.test(val)) {
                    handleFieldChange("logoWidthCm", val);
                  }
                }}
                placeholder="أدخل المقاس المخصص (مثال: 10)"
                className={inputClass("logoWidthCm")}
              />
              {renderError("logoWidthCm")}
            </div>

            <AnimatePresence mode="wait">
              {data.logoWidthCm && sizeImages[data.logoWidthCm] && (
                <motion.div
                  key={data.logoWidthCm}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="glass bg-dark-card/60 border border-gold/20 rounded-2xl overflow-hidden mb-3">
                    <img
                      src={sizeImages[data.logoWidthCm]}
                      alt={`Size ${data.logoWidthCm}cm preview`}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <p className="text-center text-sm text-gold mb-4 font-medium">
                    {t("sizeExample", { size: data.logoWidthCm })}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Order Notes */}
            <div>
              <label className="block text-sm text-slate-body mb-1.5">
                {t("fields.orderNotes")}
                <span className="text-xs text-slate-body/60 ms-1">({t("fields.optional")})</span>
              </label>
              <textarea
                value={data.orderNotes}
                onChange={(e) => handleFieldChange("orderNotes", e.target.value)}
                placeholder={t("placeholders.orderNotes")}
                rows={3}
                className={`${inputClass("orderNotes")} resize-none`}
              />
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {currentStep === "review" && (
          <div className="space-y-5 px-2 sm:px-3">
            <h3 className="text-lg font-semibold text-nardo mb-4">
              {t("section.review")}
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-dark-card/50 border border-white/10">
                <p className="text-xs text-slate-muted mb-1">{t("fields.customerName")}</p>
                <p className="text-sm text-slate-light font-medium">{data.customerName}</p>
              </div>
              <div className="p-4 rounded-xl bg-dark-card/50 border border-white/10">
                <p className="text-xs text-slate-muted mb-1">{t("fields.phone")}</p>
                <p className="text-sm text-slate-light font-medium">{data.phone}</p>
              </div>
              <div className="p-4 rounded-xl bg-dark-card/50 border border-white/10">
                <p className="text-xs text-slate-muted mb-1">{at("delivery.title")}</p>
                <p className="text-sm text-slate-light font-medium">
                  {data.deliveryType === "shipping" ? at("delivery.shippingOpt") : at("delivery.noShippingOpt")}
                </p>
              </div>

              {data.deliveryType === "shipping" && (
                <div className="p-4 rounded-xl bg-dark-card/50 border border-white/10">
                  <p className="text-xs text-slate-muted mb-1">{t("fields.addressDetail")}</p>
                  <p className="text-sm text-slate-light font-medium">{data.addressDetail}</p>
                </div>
              )}

              {data.displayName && (
                <div className="p-4 rounded-xl bg-dark-card/50 border border-white/10">
                  <p className="text-xs text-slate-muted mb-1">{t("fields.displayName")}</p>
                  <p className="text-sm text-slate-light font-medium">{data.displayName}</p>
                </div>
              )}

              {data.logoWidthCm && (
                <div className="p-4 rounded-xl bg-dark-card/50 border border-white/10">
                  <p className="text-xs text-slate-muted mb-1">{t("fields.stickerSize")}</p>
                  <p className="text-sm text-slate-light font-medium">{data.logoWidthCm} {t("sizeCm")}</p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-dark-card/50 border border-white/10">
                <p className="text-xs text-slate-muted mb-1">{t("section.theme")}</p>
                <p className="text-sm text-slate-light font-medium capitalize">{data.theme}</p>
              </div>

              {data.orderNotes && (
                <div className="p-4 rounded-xl bg-dark-card/50 border border-white/10">
                  <p className="text-xs text-slate-muted mb-1">{t("fields.orderNotes")}</p>
                  <p className="text-sm text-slate-light">{data.orderNotes}</p>
                </div>
              )}
            </div>

            {/* Price Summary */}
            <div className="text-center mt-6 p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-gold/30">
              <div className="space-y-1">
                <p className="text-sm text-slate-muted">
                  {t("basePrice")}: <span className="text-gold font-bold">{reviewPricing.basePrice} {tc("egp")}</span>
                </p>
                <p className="text-sm text-slate-muted">
                  {t("shippingLabel")}: <span className="text-gold font-bold">{reviewPricing.shippingFee} {tc("egp")}</span>
                </p>
                <div className="w-full h-px bg-gold/20 my-2" />
                <p className="text-lg text-gold font-bold">
                  {t("total")}: {reviewPricing.total} {tc("egp")}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <div className="flex justify-between mt-6">
        {step > 0 ? (
          <PrimaryButton type="button" onClick={handleBack} disabled={uploading}>
            <ChevronLeft className="w-4 h-4" />
            {t("back")}
          </PrimaryButton>
        ) : (
          <div />
        )}
        {step < currentSteps.length - 1 ? (
          <PrimaryButton type="button" onClick={handleNext} disabled={uploading}>
            {t("next")}
            <ChevronRight className="w-4 h-4" />
          </PrimaryButton>
        ) : (
          <PrimaryButton
            type="button"
            loading={submitting}
            disabled={submitting || uploading}
            onClick={handleSubmit}
          >
            {submitting ? t("submitting") : t("submit")}
          </PrimaryButton>
        )}
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          handleFormReset();
        }}
        onWhatsappClick={handleFormReset}
        orderDetails={{
          customerName: data.customerName.trim(),
          phone: data.phone.trim(),
          productType: "auto-tap",
        }}
        totalPrice={orderPricing?.totalPrice}
        shippingFee={orderPricing?.shippingFee}
      />
    </div>
  );
}
