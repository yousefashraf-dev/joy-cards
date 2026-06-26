"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ChevronRight, ChevronLeft, Upload, X, ImageIcon, Ruler, FileText,
} from "lucide-react";
import type { AutoTapFormData } from "@/lib/types";
import { formatSocialLink, type Platform } from "@/lib/formatSocialLink";
import { submitOrder } from "@/lib/submitOrder";
import { PLATFORM_OPTIONS } from "@/lib/constants";
import { calcTotal } from "@/lib/pricing";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SuccessModal from "./SuccessModal";
import AutoTapPreview from "./AutoTapPreview";
import { useLoading } from "@/components/ui/LoadingProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { compressImage } from "@/lib/compressImage";

const STEPS = ["shipping", "social", "design", "sizing"] as const;

interface AutoTapFormProps {
  data: AutoTapFormData;
  onChange: (key: string, value: string | boolean | Record<string, string>) => void;
  onSubmitComplete: () => void;
}

export default function AutoTapForm({ data, onChange, onSubmitComplete }: AutoTapFormProps) {
  const t = useTranslations("products.forms");
  const e = useTranslations("products.errors");
  const tm = useTranslations("messages");
  const st = useTranslations("products.steps");
  const pt = useTranslations("products.forms.profileType");
  const tc = useTranslations("currency");
  const locale = useLocale();

  const sizeImages: Record<string, string> = {
    "6": "/2.jpeg",
    "25": "/1.jpeg",
    "35": "/3.jpeg",
  };

  const [step, setStep] = useState(0);
  const stepperRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    stepperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderPricing, setOrderPricing] = useState<{ totalPrice: number; shippingFee: number } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewSize, setPreviewSize] = useState<string | null>(null);
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
        console.error("Upload server error:", res.status, resData);
        showToast(resData?.error || t("uploadError"), "error");
        return;
      }
      if (resData.url) {
        onChange("logo", resData.url);
        showToast(t("uploadSuccess"), "success");
      } else {
        console.error("Upload OK but no URL:", resData);
        showToast(t("uploadError"), "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("uploadError");
      console.error("Upload failed:", err);
      showToast(msg, "error");
    } finally {
      hideLoading();
      setUploading(false);
      e.target.value = "";
    }
  };

  const validateStep = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!data.customerName.trim()) newErrors.customerName = e("required");
      if (!data.phone.trim()) newErrors.phone = e("required");
      else if (!/^\+?[0-9]{7,15}$/.test(data.phone.replace(/[\s-]/g, ""))) {
        newErrors.phone = e("invalidPhone");
      }
      if (!data.addressDetail.trim()) newErrors.addressDetail = e("required");
    } else if (step === 1) {
      if (data.profileType === "single") {
        if (!data.selectedPlatform) newErrors.selectedPlatform = e("selectPlatform");
        if (!data.singlePlatformValue.trim()) newErrors.singlePlatformValue = e("required");
      } else {
        const hasAny = Object.values(data.socialLinks).some((v) => v.trim());
        if (!hasAny) newErrors.socialLinks = e("required");
      }
    } else if (step === 2) {
      // Design selection step — no required validation (theme has default)
    } else if (step === 3) {
      if (!data.logoWidthCm) {
        newErrors.logoWidthCm = e("required");
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [step, data, e]);

  const handleNext = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    setErrors({});
  };

  const TIMEOUT_MS = 30000;

  const handleSubmit = async () => {
    if (!validateStep()) return;
    if (uploading) {
      showToast(tm("waitUpload"), "error");
      return;
    }
    setSubmitting(true);
    showLoading(tm("sending"));

    const safetyTimer = setTimeout(() => {
      hideLoading();
      setSubmitting(false);
      showToast(tm("networkError"), "error");
    }, TIMEOUT_MS);

    const pricing = calcTotal(data.addressDetail);
    setOrderPricing({ totalPrice: pricing.total, shippingFee: pricing.shippingFee });

    const formattedSocials: Record<string, string> = {};

    if (data.profileType === "single" && data.selectedPlatform && data.singlePlatformValue) {
      formattedSocials[data.selectedPlatform] = formatSocialLink(
        data.singlePlatformValue,
        data.selectedPlatform as Platform
      );
    } else {
      for (const [key, val] of Object.entries(data.socialLinks)) {
        if (val.trim()) {
          formattedSocials[key] = formatSocialLink(val, key as Platform);
        }
      }
    }

    try {
      await submitOrder({
        customerName: data.customerName.trim(),
        displayName: data.displayName.trim() || undefined,
        phone: data.phone.trim(),
        governorate: "",
        city: "",
        street: data.addressDetail.trim(),
        theme: data.theme,
        productType: "auto-tap",
        logo: data.logo || undefined,
        socialLinks: formattedSocials,
        autoTapFields: {
          profileType: data.profileType,
          logoWidthCm: data.logoWidthCm.trim() || "6",
          orderNotes: data.orderNotes.trim() || undefined,
          addressDetail: data.addressDetail.trim(),
          selectedPlatform: data.selectedPlatform || undefined,
          singlePlatformValue: data.singlePlatformValue.trim() || undefined,

        },
      }, pricing.total, locale);
      clearTimeout(safetyTimer);
      showToast(tm("sent"), "success");
      hideLoading();
      setSubmitting(false);
      setShowSuccess(true);
    } catch {
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
    <div ref={stepperRef} className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((s, i) => (
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
            {i < step ? "✓" : i + 1}
          </div>
          <span
            className={`text-xs hidden sm:block ${
              i === step ? "text-nardo font-bold" : "text-slate-body"
            }`}
          >
            {st(s)}
          </span>
          {i < STEPS.length - 1 && (
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

  return (
    <div>
      {renderStepIndicator()}

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Step 1: Shipping */}
        {step === 0 && (
          <div className="space-y-5 px-2 sm:px-3">
            <h3 className="text-lg font-semibold text-nardo mb-4">
              {t("section.personal")}
            </h3>
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
            <div>
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
            </div>

          </div>
        )}

        {/* Step 2: Profile Selection & Social Links + Sticker Name */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-nardo mb-4">
              {t("section.social")}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <motion.button
                type="button"
                onClick={() => handleFieldChange("profileType", "single")}
                className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                  data.profileType === "single"
                    ? "border-2 border-cyan-500 bg-cyan-500/10 shadow-[0_0_25px_rgba(0,243,255,0.2)] ring-2 ring-cyan-500/30"
                    : "border border-white/15 bg-dark-card/60 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(0,243,255,0.08)] hover:bg-dark-card/80"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span
                  className={`text-sm font-semibold ${
                    data.profileType === "single" ? "text-cyan-400" : "text-slate-light group-hover:text-white"
                  }`}
                >
                  {pt("single")}
                </span>
                <p className="text-xs text-slate-body/80 mt-1">
                  {pt("singleDesc")}
                </p>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handleFieldChange("profileType", "multiple")}
                className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                  data.profileType === "multiple"
                    ? "border-2 border-cyan-500 bg-cyan-500/10 shadow-[0_0_25px_rgba(0,243,255,0.2)] ring-2 ring-cyan-500/30"
                    : "border border-white/15 bg-dark-card/60 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(0,243,255,0.08)] hover:bg-dark-card/80"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span
                  className={`text-sm font-semibold ${
                    data.profileType === "multiple" ? "text-cyan-400" : "text-slate-light group-hover:text-white"
                  }`}
                >
                  {pt("multiple")}
                </span>
                <p className="text-xs text-slate-body/80 mt-1">
                  {pt("multipleDesc")}
                </p>
              </motion.button>
            </div>

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
            </div>

            {data.profileType === "single" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-body mb-1.5">
                    {t("fields.selectPlatform")}
                  </label>
                  <select
                    value={data.selectedPlatform}
                    onChange={(e) => handleFieldChange("selectedPlatform", e.target.value)}
                    className={inputClass("selectedPlatform")}
                  >
                    <option value="" className="text-neutral-900 bg-white">-- {t("fields.selectPlatform")} --</option>
                    {PLATFORM_OPTIONS.map((p) => (
                      <option key={p.id} value={p.id} className="text-neutral-900 bg-white">
                        {p.label}
                      </option>
                    ))}
                  </select>
                  {renderError("selectedPlatform")}
                </div>
                <div>
                  <label className="block text-sm text-slate-body mb-1.5">
                    {t("fields.singlePlatformValue")}
                  </label>
                  <input
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    value={data.singlePlatformValue}
                    onChange={(e) =>
                      handleFieldChange("singlePlatformValue", e.target.value.toLowerCase())
                    }
                    placeholder={t("fields.singlePlatformValue")}
                    className={inputClass("singlePlatformValue")}
                  />
                  {renderError("singlePlatformValue")}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-nardo font-medium">
                  {t("socialHelperText")}
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {PLATFORM_OPTIONS.map((platform) => (
                    <div key={platform.id}>
                      <label className="block text-sm text-slate-body mb-1.5">
                        {t(`fields.${platform.id}`)}
                  <span className="text-xs text-slate-body/60 ms-1">({t("fields.optional")})</span>
                      </label>
                      <input
                        type="text"
                        autoCapitalize={platform.id === "whatsapp" || platform.id === "phoneSocial" ? "none" : "none"}
                        autoCorrect={platform.id === "whatsapp" || platform.id === "phoneSocial" ? "off" : "off"}
                        spellCheck="false"
                        value={data.socialLinks[platform.id] || ""}
                        onChange={(e) => handleSocialLinkChange(platform.id, platform.id === "whatsapp" || platform.id === "phoneSocial" ? e.target.value : e.target.value.toLowerCase())}
                        placeholder={platform.id === "whatsapp" ? "01012345678" : t(`fields.${platform.id}`)}
                        className={inputClass(platform.id)}
                      />
                      <p className="text-xs text-slate-body/60 mt-1">
                        {platform.id === "whatsapp" || platform.id === "phoneSocial"
                          ? t("whatsappHelper")
                          : t("socialHelperText")}
                      </p>
                      {renderError(platform.id)}
                    </div>
                  ))}
                </div>
                {errors.socialLinks && (
                  <p className="text-red-400 text-xs">{errors.socialLinks}</p>
                )}
              </div>
            )}

              <div>
                <label className="flex items-center gap-2 text-sm text-slate-body mb-1.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>{t("fields.logo")}</span>
                  <span className="text-xs text-slate-body/60">({t("fields.optional")})</span>
                </label>
                {data.logo ? (
                  <div className="relative inline-block">
                    <Image
                      src={data.logo}
                      alt="Logo preview"
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-xl object-cover border border-white/10"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => onChange("logo", "")}
                      className="absolute -top-2 -end-2 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div
                      onClick={() => logoInputRef.current?.click()}
                      className="w-full p-6 rounded-xl border-2 border-dashed border-white/10 hover:border-nardo/30 bg-dark-card/50 hover:bg-dark-card transition-all duration-200 flex flex-col items-center gap-2 relative z-50 pointer-events-auto cursor-pointer"
                    >
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Upload
                        className={`w-6 h-6 ${
                          uploading ? "text-nardo animate-pulse" : "text-slate-body"
                        }`}
                      />
                      <span className="text-sm text-slate-body">
                        {uploading ? t("uploading") : t("fields.logo")}
                      </span>
                    </div>
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-matte-dark/90 rounded-xl z-20">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 border-3 border-nardo border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs text-slate-body/70">{t("uploadingWait")}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
          </div>
        )}

        {/* Step 3: Choose Your Design — Interactive Preview Carousel */}
        {step === 2 && (
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

        {/* Step 4: Size Guide + Notes */}
        {step === 3 && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gradient-gold mb-4">
              {t("section.size")}
            </h3>

            {/* Size preview tabs (interactive guide only) */}
            <div>
              <p className="text-xs text-slate-muted/70 mb-3">
                اضغط على المقاس لمشاهدة الصورة التوضيحية
              </p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {(["6", "25", "35"] as const).map((size) => {
                  const labels: Record<string, string> = { "6": "6", "25": "25", "35": "35" };
                  return (
                    <motion.button
                      key={size}
                      type="button"
                      onClick={() => setPreviewSize(size)}
                      className={`flex flex-col items-center gap-1 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                        previewSize === size
                          ? "border-gold bg-gold/10 text-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]"
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

              {/* Image Preview */}
              {previewSize && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={previewSize}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="glass bg-dark-card/60 border border-gold/20 rounded-2xl overflow-hidden mb-3">
                      <img
                        src={sizeImages[previewSize]}
                        alt={`Size ${previewSize}cm preview`}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    <p className="text-center text-sm text-gold mb-4 font-medium">
                      {t("sizeExample", { size: previewSize })}
                    </p>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Manual size input */}
            <div>
              <label className="flex items-center gap-2 text-sm text-slate-body mb-1.5">
                <Ruler className="w-4 h-4" />
                <span>المقاس المطلوب (بالسنتيمتر)</span>
              </label>
              <input
                type="number"
                value={data.logoWidthCm}
                onChange={(e) => handleFieldChange("logoWidthCm", e.target.value)}
                placeholder="مثال: 25"
                className="w-full px-4 py-2.5 rounded-lg bg-dark-card/50 border border-white/10 text-sm text-slate-light placeholder-slate-muted/50 focus:outline-none focus:border-gold/50 transition-colors"
              />
              {renderError("logoWidthCm")}
            </div>

            {/* Order notes */}
            <div>
              <label className="flex items-center gap-2 text-sm text-slate-body mb-1.5">
                <FileText className="w-4 h-4" />
                <span>ملاحظات الطلب (اختياري)</span>
              </label>
              <textarea
                value={data.orderNotes}
                onChange={(e) => handleFieldChange("orderNotes", e.target.value)}
                placeholder="أي ملاحظات أو تعليمات إضافية..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg bg-dark-card/50 border border-white/10 text-sm text-slate-light placeholder-slate-muted/50 focus:outline-none focus:border-gold/50 transition-colors resize-none"
              />
            </div>

            {/* Unified price */}
            <div className="text-center mt-6 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-gold/30">
              <span className="text-gradient-gold text-2xl font-bold">200 {tc("egp")} + {t("shippingLabel")}</span>
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
        {step < STEPS.length - 1 ? (
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
