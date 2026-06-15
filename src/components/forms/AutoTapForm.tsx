"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ChevronRight, ChevronLeft, Upload, X, ImageIcon, Ruler,
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

const STEPS = ["shipping", "social", "design", "sizing"] as const;

interface AutoTapFormProps {
  data: AutoTapFormData;
  onChange: (key: string, value: string | boolean | Record<string, string>) => void;
  onSubmitComplete: () => void;
}

export default function AutoTapForm({ data, onChange, onSubmitComplete }: AutoTapFormProps) {
  const t = useTranslations("products.forms");
  const e = useTranslations("products.errors");
  const st = useTranslations("products.steps");
  const pt = useTranslations("products.forms.profileType");
  const locale = useLocale();

  const [step, setStep] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderPricing, setOrderPricing] = useState<{ totalPrice: number; shippingFee: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const convertToWebP = (file: File, quality = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const imgEl = document.createElement("img");
      imgEl.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = imgEl.width;
        canvas.height = imgEl.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas 2D context unavailable")); return; }
        ctx.drawImage(imgEl, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("WebP conversion failed"));
          },
          "image/webp",
          quality
        );
      };
      imgEl.onerror = () => reject(new Error("Image load failed"));
      imgEl.src = URL.createObjectURL(file);
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const webpBlob = await convertToWebP(file, 0.8);
      const formData = new FormData();
      formData.append("file", webpBlob, "logo.webp");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const resData = await res.json();
      if (resData.url) {
        onChange("logo", resData.url);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      showToast("فشل رفع الصورة، حاول مرة أخرى", "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
      if (!data.logoWidthCm.trim()) {
        newErrors.logoWidthCm = e("required");
      } else if (isNaN(Number(data.logoWidthCm)) || Number(data.logoWidthCm) <= 0) {
        newErrors.logoWidthCm = e("invalidNumber");
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

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    showLoading("جاري إرسال الطلب...");

    const pricing = calcTotal(data.profileType, data.addressDetail);
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
          logoWidthCm: data.logoWidthCm.trim(),
          orderNotes: data.orderNotes.trim() || undefined,
          addressDetail: data.addressDetail.trim(),
          selectedPlatform: data.selectedPlatform || undefined,
          singlePlatformValue: data.singlePlatformValue.trim() || undefined,

        },
      }, pricing.total, locale);
      showToast("تم إرسال الطلب بنجاح", "success");
    } catch {
      showToast("فشل الإرسال، حاول مرة أخرى", "error");
    }
    hideLoading();
    setSubmitting(false);
    setShowSuccess(true);
  };

  const handleFormReset = useCallback(() => {
    setStep(0);
    setErrors({});
    setOrderPricing(null);
    onSubmitComplete();
  }, [onSubmitComplete]);

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
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
    <div ref={formRef}>
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
            <h3 className="text-lg font-semibold text-nardo mb-1">
              {t("section.personal")}
            </h3>
            <p className="text-xs text-slate-body/70 mb-4">{t("helper.shippingInfo")}</p>
            <div>
              <label className="block text-sm text-slate-body mb-1.5">
                {t("fields.customerName")}
              </label>
              <input
                type="text"
                value={data.customerName}
                onChange={(e) => handleFieldChange("customerName", e.target.value)}
                className={inputClass("customerName")}
              />
              <p className="text-xs text-slate-body/70 mt-1">{t("helper.customerName")}</p>
              {renderError("customerName")}
            </div>
            <div>
              <label className="block text-sm text-slate-body mb-1.5">
                {t("fields.phone")}
              </label>
              <input
                type="tel"
                value={data.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                className={inputClass("phone")}
              />
              <p className="text-xs text-slate-body/70 mt-1">{t("helper.phone")}</p>
              {renderError("phone")}
            </div>
            <div>
              <label className="block text-sm text-slate-body mb-1.5">
                {t("fields.addressDetail")}
              </label>
              <input
                type="text"
                value={data.addressDetail}
                onChange={(e) => handleFieldChange("addressDetail", e.target.value)}
                placeholder={t("placeholders.addressDetail")}
                className={inputClass("addressDetail")}
              />
              <p className="text-xs text-slate-body/70 mt-1">{t("helper.addressDetail")}</p>
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
                className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                  data.profileType === "single"
                    ? "border-nardo bg-nardo/15 shadow-[0_0_20px_rgba(192,192,192,0.15)] ring-1 ring-nardo/30"
                    : "border-white/20 bg-dark-card hover:border-white/40 hover:bg-dark-card/80"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span
                  className={`text-sm font-semibold ${
                    data.profileType === "single" ? "text-nardo" : "text-slate-light"
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
                className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                  data.profileType === "multiple"
                    ? "border-nardo bg-nardo/15 shadow-[0_0_20px_rgba(192,192,192,0.15)] ring-1 ring-nardo/30"
                    : "border-white/20 bg-dark-card hover:border-white/40 hover:bg-dark-card/80"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span
                  className={`text-sm font-semibold ${
                    data.profileType === "multiple" ? "text-nardo" : "text-slate-light"
                  }`}
                >
                  {pt("multiple")}
                </span>
                <p className="text-xs text-slate-body/80 mt-1">
                  {pt("multipleDesc")}
                </p>
              </motion.button>
            </div>

            <p className="text-xs text-slate-body leading-relaxed bg-white/[0.06] border border-white/20 rounded-xl p-3">
              💡 (150 ج.م شامل التصميم والطباعة للمستخدم الواحد / 200 ج.م للمجموعة + مصاريف الشحن: 50 ج.م للقاهرة والمحافظات، و70 ج.م للصعيد والمدن الساحلية)
            </p>

            <div>
              <label className="block text-sm text-slate-body mb-1.5">
                {t("fields.displayName")}
                <span className="text-xs text-slate-body/60 ms-1">(Optional)</span>
              </label>
              <input
                type="text"
                value={data.displayName}
                onChange={(e) => handleFieldChange("displayName", e.target.value)}
                placeholder={t("fields.displayNameHelper")}
                className={inputClass("displayName")}
              />
              <p className="text-xs text-slate-body/70 mt-1">{t("fields.displayNameHelper")}</p>
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
                    value={data.singlePlatformValue}
                    onChange={(e) =>
                      handleFieldChange("singlePlatformValue", e.target.value)
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
                        value={data.socialLinks[platform.id] || ""}
                        onChange={(e) => handleSocialLinkChange(platform.id, e.target.value)}
                        placeholder={t(`fields.${platform.id}`)}
                        className={inputClass(platform.id)}
                      />
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
                <p className="text-xs text-slate-body/70 mb-2">{t("logoText")}</p>
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
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full p-6 rounded-xl border-2 border-dashed border-white/10 hover:border-nardo/30 bg-dark-card/50 hover:bg-dark-card transition-all duration-200 flex flex-col items-center gap-2 disabled:opacity-50"
                    >
                      <Upload
                        className={`w-6 h-6 ${
                          uploading ? "text-nardo animate-pulse" : "text-slate-body"
                        }`}
                      />
                      <span className="text-sm text-slate-body">
                        {uploading ? t("uploading") : t("uploadHelper")}
                      </span>
                    </button>
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-matte-dark/90 rounded-xl z-10">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 border-3 border-nardo border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs text-slate-body/70">{t("uploading")}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
          </div>
        )}

        {/* Step 3: Choose Your Design — Interactive Preview Carousel */}
        {step === 2 && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-nardo mb-4">
              {t("section.theme")}
            </h3>
            <p className="text-xs text-slate-body/70 mb-2">
              {t("helper.previewGuide")}
            </p>
            <p className="text-sm text-nardo font-medium mb-3">{t("helper.themeHeader")}</p>
            <AutoTapPreview
              data={data}
              onThemeChange={(theme) => handleFieldChange("theme", theme)}
            />
          </div>
        )}

        {/* Step 4: Logo Sticker Sizing — Rear Side Window */}
        {step === 3 && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-nardo mb-4">
              {t("fields.logoWidthCm")}
            </h3>

              <p className="text-xs text-slate-body/80 mb-2">
                {t("fields.windowStandard", { size: "35" })}
              </p>

            <div className="flex justify-center mb-6">
              <svg
                viewBox="0 0 200 140"
                className="w-56 h-40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 20 L60 5 L140 5 L190 20 L190 110 L140 130 L60 130 L10 110 Z"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="2"
                  fill="rgba(255,255,255,0.03)"
                />
                <path
                  d="M30 35 L65 20 L135 20 L170 35 L170 100 L135 115 L65 115 L30 100 Z"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                  fill="none"
                />
                <line
                  x1="35"
                  y1="95"
                  x2="165"
                  y2="95"
                  stroke="rgba(192,192,192,0.5)"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
                <line
                  x1="35"
                  y1="89"
                  x2="35"
                  y2="101"
                  stroke="rgba(192,192,192,0.5)"
                  strokeWidth="2"
                />
                <line
                  x1="165"
                  y1="89"
                  x2="165"
                  y2="101"
                  stroke="rgba(192,192,192,0.5)"
                  strokeWidth="2"
                />
                <text
                  x="100"
                  y="120"
                  textAnchor="middle"
                  fill="rgba(192,192,192,0.4)"
                  fontSize="11"
                  fontFamily="sans-serif"
                >
                  {t("fields.windowDiagram")}
                </text>
                <text
                  x="100"
                  y="18"
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.12)"
                  fontSize="9"
                  fontFamily="sans-serif"
                >
                  {t("fields.rearWindow")}
                </text>
              </svg>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-slate-body mb-1.5">
                <Ruler className="w-4 h-4" />
                <span>{t("fields.logoWidthCm")}</span>
              </label>
              <input
                type="text"
                value={data.logoWidthCm}
                onChange={(e) => handleFieldChange("logoWidthCm", e.target.value)}
                placeholder={t("placeholders.logoWidthCm")}
                className={inputClass("logoWidthCm")}
              />
              <p className="text-xs text-slate-body/70 mt-1.5">
                {t("helper.logoWidth")}
              </p>
              {renderError("logoWidthCm")}
            </div>
            <div>
              <label className="block text-sm text-slate-body mb-1.5">
                {t("fields.orderNotes")}
                <span className="text-xs text-slate-body/60 ms-1">(Optional)</span>
              </label>
              <textarea
                value={data.orderNotes}
                onChange={(e) => handleFieldChange("orderNotes", e.target.value)}
                placeholder={t("placeholders.orderNotes")}
                rows={3}
                className={inputClass("orderNotes")}
              />
            </div>
          </div>
        )}
      </motion.div>

      <div className="flex justify-between mt-6">
        {step > 0 ? (
          <PrimaryButton type="button" onClick={handleBack}>
            <ChevronLeft className="w-4 h-4" />
            {t("back")}
          </PrimaryButton>
        ) : (
          <div />
        )}
        {step < STEPS.length - 1 ? (
          <PrimaryButton type="button" onClick={handleNext}>
            {t("next")}
            <ChevronRight className="w-4 h-4" />
          </PrimaryButton>
        ) : (
          <PrimaryButton
            type="button"
            loading={submitting}
            disabled={submitting}
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
