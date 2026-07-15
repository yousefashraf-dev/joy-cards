"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronRight, ChevronLeft, Upload, X, Check, Heart, MapPin, Clock, Shirt, Sparkles } from "lucide-react";
import { WEDDING_THEMES, getWeddingTheme } from "@/lib/wedding-themes";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useLoading } from "@/components/ui/LoadingProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { compressImage } from "@/lib/compressImage";
import WeddingPreview from "@/components/wedding/WeddingPreview";

const ALL_STEPS = ["couple", "dateTime", "happyMoment", "story", "dressCode", "venue", "theme", "review"] as const;

function StepLayout({ title, icon: Icon, children }: { title: string; icon?: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="space-y-5 px-2 sm:px-3">
      <h3 className="text-lg font-semibold text-gold mb-4 flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5" />}
        {title}
      </h3>
      {children}
    </div>
  );
}

interface WeddingFormData {
  coupleName1: string;
  coupleName2: string;
  slug: string;
  heroImage: string;
  date: string;
  time: string;
  happyMoment: string;
  story: string;
  storyImage: string;
  dressCode: string;
  dressCodeHer: string;
  dressCodeHim: string;
  venue: string;
  venueMapsLink: string;
  theme: string;
}

const INITIAL_DATA: WeddingFormData = {
  coupleName1: "",
  coupleName2: "",
  slug: "",
  heroImage: "",
  date: "",
  time: "",
  happyMoment: "",
  story: "",
  storyImage: "",
  dressCode: "",
  dressCodeHer: "",
  dressCodeHim: "",
  venue: "",
  venueMapsLink: "",
  theme: "champagne-rose",
};

export default function WeddingOrderForm() {
  const t = useTranslations("weddingOrder");
  const tf = useTranslations("weddingOrder.form");
  const tr = useTranslations("weddingOrder.review");
  const tt = useTranslations("weddingOrder.themes");
  const st = useTranslations("weddingOrder.steps");
  const pf = useTranslations("products.forms");
  const e = useTranslations("products.errors");
  const tm = useTranslations("messages");
  const locale = useLocale();

  const [data, setData] = useState<WeddingFormData>(INITIAL_DATA);
  const [step, setStep] = useState(0);
  const stepperRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();

  const currentStep = ALL_STEPS[step];

  useEffect(() => {
    stepperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  const handleFieldChange = (key: string, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const generateSlug = (name1: string, name2: string) => {
    return `${name1}-${name2}`
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleCoupleChange = (field: "coupleName1" | "coupleName2", value: string) => {
    setData((prev) => {
      const next = { ...prev, [field]: value };
      const name1 = field === "coupleName1" ? value : prev.coupleName1;
      const name2 = field === "coupleName2" ? value : prev.coupleName2;
      if (name1 && name2) {
        next.slug = generateSlug(name1, name2);
      }
      return next;
    });
    setErrors((prev) => {
      const n = { ...prev };
      delete n[field];
      delete n.slug;
      return n;
    });
  };

  const handleUpload = async (file: File, field: "heroImage" | "storyImage") => {
    setUploading(true);
    showLoading(tm("uploading"));
    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append("file", compressed);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const resData = await res.json();
      if (!res.ok) {
        showToast(resData?.error || "Upload failed", "error");
        return;
      }
      if (resData.url) {
        handleFieldChange(field, resData.url);
        showToast(tm("uploadSuccess"), "success");
      } else {
        showToast(tm("uploadError"), "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      showToast(msg, "error");
    } finally {
      hideLoading();
      setUploading(false);
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentStep === "couple") {
      if (!data.coupleName1.trim()) newErrors.coupleName1 = e("required");
      if (!data.coupleName2.trim()) newErrors.coupleName2 = e("required");
    } else if (currentStep === "dateTime") {
      if (!data.date.trim()) newErrors.date = e("required");
      if (!data.time.trim()) newErrors.time = e("required");
    } else if (currentStep === "venue") {
      if (!data.venue.trim()) newErrors.venue = e("required");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, ALL_STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    setErrors({});
  };

  const handleSubmit = async () => {
    if (uploading) {
      showToast(tm("waitUpload"), "error");
      return;
    }
    setSubmitting(true);
    showLoading(tm("sending"));

    try {
      const payload = {
        coupleName1: data.coupleName1.trim(),
        coupleName2: data.coupleName2.trim(),
        slug: data.slug.trim(),
        image: data.heroImage || "",
        happyMoment: data.happyMoment.trim() || "",
        story: data.story.trim() || "",
        storyImage: data.storyImage || "",
        date: data.date.trim(),
        time: data.time.trim(),
        venue: data.venue.trim(),
        venueMapsLink: data.venueMapsLink.trim() || "",
        dressCode: data.dressCode.trim() || "",
        dressCodeHer: data.dressCodeHer.trim() || "",
        dressCodeHim: data.dressCodeHim.trim() || "",
        active: false,
        source: "order",
        theme: data.theme,
      };

      const res = await fetch("/api/weddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save order");

      const msg = `🎉 Wedding Card Order\n\n👫 Couple: ${data.coupleName1} & ${data.coupleName2}\n📅 Date: ${data.date}\n⏰ Time: ${data.time}\n📍 Venue: ${data.venue}\n🎨 Theme: ${data.theme}`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");

      showToast(tm("sent"), "success");
      hideLoading();
      setSubmitting(false);
    } catch {
      hideLoading();
      setSubmitting(false);
      showToast(tm("failed"), "error");
    }
  };

  const stepLabels = ALL_STEPS.map((s) => st(s));

  const renderStepIndicator = () => (
    <div ref={stepperRef} className="flex items-center justify-center gap-2 mb-8 flex-wrap">
      {ALL_STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              i === step
                ? "bg-gold text-matte-dark shadow-[0_0_14px_rgba(212,175,55,0.4)]"
                : i < step
                  ? "bg-gold/30 text-gold border border-gold/10"
                  : "bg-dark-card border border-white/20 text-slate-body"
            }`}
          >
            {i < step ? <Check className="w-4 h-4" /> : i + 1}
          </div>
          <span
            className={`text-xs hidden sm:block ${
              i === step ? "text-gold font-bold" : "text-slate-body"
            }`}
          >
            {st(s)}
          </span>
          {i < ALL_STEPS.length - 1 && (
            <div className={`w-8 h-0.5 ${i < step ? "bg-gold/50" : "bg-white/10"}`} />
          )}
        </div>
      ))}
    </div>
  );

  const inputClass = (key: string) =>
    `w-full px-4 py-2.5 rounded-lg glass bg-dark-card border text-sm text-slate-light placeholder:text-slate-muted/60 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-200 ${
      errors[key] ? "border-red-400" : "border-white/20"
    }`;

  const renderError = (key: string) =>
    errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>;

  const formContent = (
    <>
      {/* Step 1: Couple Names + Hero Photo */}
      {currentStep === "couple" && (
        <StepLayout title={stepLabels[0]} icon={Heart}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="coupleName1" className="block text-sm text-slate-body mb-1.5">{tf("coupleName1")}</label>
              <input id="coupleName1" type="text" value={data.coupleName1}
                onChange={(e) => handleCoupleChange("coupleName1", e.target.value)}
                className={inputClass("coupleName1")} placeholder={tf("coupleName1Placeholder")} dir="ltr" autoComplete="off" />
              {renderError("coupleName1")}
            </div>
            <div>
              <label htmlFor="coupleName2" className="block text-sm text-slate-body mb-1.5">{tf("coupleName2")}</label>
              <input id="coupleName2" type="text" value={data.coupleName2}
                onChange={(e) => handleCoupleChange("coupleName2", e.target.value)}
                className={inputClass("coupleName2")} placeholder={tf("coupleName2Placeholder")} dir="ltr" autoComplete="off" />
              {renderError("coupleName2")}
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-body mb-1.5">{tf("heroImage")}</label>
            <p className="text-xs text-slate-muted/50 mb-2">{tf("heroImageHelp")}</p>
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-32 h-32">
                <div
                  onClick={() => document.getElementById("hero-image-input")?.click()}
                  className={`w-32 h-32 rounded-full bg-gradient-to-br from-gold/10 to-navy-light border-2 border-dashed flex items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden ${
                    uploading ? "border-gold animate-pulse" : data.heroImage ? "border-gold/70 shadow-[0_0_20px_rgba(212,175,55,0.2)]" : "border-gold/40 hover:border-gold/70"
                  }`}
                >
                  {data.heroImage ? (
                    <Image src={data.heroImage} alt="Couple" width={128} height={128} className="w-full h-full object-cover rounded-full" unoptimized />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="w-8 h-8 text-gold/60" />
                      <span className="text-[10px] text-gold/60">ارفع الصورة</span>
                    </div>
                  )}
                </div>
                {!uploading && data.heroImage && (
                  <button type="button" onClick={() => handleFieldChange("heroImage", "")}
                    className="absolute -top-1 -end-1 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors z-10">
                    <X className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>
              <input id="hero-image-input" type="file" accept="image/*"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "heroImage"); }}
                className="hidden" />
            </div>
          </div>
        </StepLayout>
      )}

      {/* Step 2: Date & Time */}
      {currentStep === "dateTime" && (
        <StepLayout title={stepLabels[1]} icon={Clock}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm text-slate-body mb-1.5">{tf("date")}</label>
              <input id="date" type="date" value={data.date}
                onChange={(e) => handleFieldChange("date", e.target.value)}
                className={inputClass("date")} />
              {renderError("date")}
            </div>
            <div>
              <label htmlFor="time" className="block text-sm text-slate-body mb-1.5">{tf("time")}</label>
              <input id="time" type="time" value={data.time}
                onChange={(e) => handleFieldChange("time", e.target.value)}
                className={inputClass("time")} />
              {renderError("time")}
            </div>
          </div>
        </StepLayout>
      )}

      {/* Step 3: Happy Moment */}
      {currentStep === "happyMoment" && (
        <StepLayout title={stepLabels[2]} icon={Sparkles}>
          <div>
            <label htmlFor="happyMoment" className="block text-sm text-slate-body mb-1.5">{tf("happyMoment")}
              <span className="text-xs text-slate-body/60 ms-1">({tf("optional")})</span>
            </label>
            <textarea id="happyMoment" value={data.happyMoment}
              onChange={(e) => handleFieldChange("happyMoment", e.target.value)}
              className={`${inputClass("happyMoment")} min-h-[120px] resize-y`}
              placeholder={tf("happyMomentPlaceholder")} rows={5} dir="ltr" />
          </div>
        </StepLayout>
      )}

      {/* Step 4: Love Story + Photo */}
      {currentStep === "story" && (
        <StepLayout title={stepLabels[3]} icon={Sparkles}>
          <div>
            <label htmlFor="story" className="block text-sm text-slate-body mb-1.5">{tf("story")}
              <span className="text-xs text-slate-body/60 ms-1">({tf("optional")})</span>
            </label>
            <textarea id="story" value={data.story}
              onChange={(e) => handleFieldChange("story", e.target.value)}
              className={`${inputClass("story")} min-h-[120px] resize-y`}
              placeholder={tf("storyPlaceholder")} rows={5} dir="ltr" />
          </div>
          <div>
            <label className="block text-sm text-slate-body mb-1.5">{tf("storyImage")}
              <span className="text-xs text-slate-body/60 ms-1">({tf("optional")})</span>
            </label>
            <p className="text-xs text-slate-muted/50 mb-2">{tf("storyImageHelp")}</p>
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-32 h-32">
                <div
                  onClick={() => document.getElementById("story-image-input")?.click()}
                  className={`w-32 h-32 rounded-full bg-gradient-to-br from-gold/10 to-navy-light border-2 border-dashed flex items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden ${
                    data.storyImage ? "border-gold/70 shadow-[0_0_20px_rgba(212,175,55,0.2)]" : "border-gold/40 hover:border-gold/70"
                  }`}
                >
                  {data.storyImage ? (
                    <Image src={data.storyImage} alt="Couple" width={128} height={128} className="w-full h-full object-cover rounded-full" unoptimized />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="w-8 h-8 text-gold/60" />
                      <span className="text-[10px] text-gold/60">ارفع الصورة</span>
                    </div>
                  )}
                </div>
                {data.storyImage && (
                  <button type="button" onClick={() => handleFieldChange("storyImage", "")}
                    className="absolute -top-1 -end-1 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors z-10">
                    <X className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>
              <input id="story-image-input" type="file" accept="image/*"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "storyImage"); }}
                className="hidden" />
            </div>
          </div>
        </StepLayout>
      )}

      {/* Step 5: Dress Code */}
      {currentStep === "dressCode" && (
        <StepLayout title={stepLabels[4]} icon={Shirt}>
          <div>
            <label htmlFor="dressCode" className="block text-sm text-slate-body mb-1.5">{tf("dressCodeGeneral")}
              <span className="text-xs text-slate-body/60 ms-1">({tf("optional")})</span>
            </label>
            <input id="dressCode" type="text" value={data.dressCode}
              onChange={(e) => handleFieldChange("dressCode", e.target.value)}
              className={inputClass("dressCode")}
              placeholder={tf("dressCodeGeneralPlaceholder")} dir="ltr" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dressCodeHer" className="block text-sm text-slate-body mb-1.5">{tf("dressCodeHer")}
                <span className="text-xs text-slate-body/60 ms-1">({tf("optional")})</span>
              </label>
              <input id="dressCodeHer" type="text" value={data.dressCodeHer}
                onChange={(e) => handleFieldChange("dressCodeHer", e.target.value)}
                className={inputClass("dressCodeHer")}
                placeholder={tf("dressCodeHerPlaceholder")} dir="ltr" />
            </div>
            <div>
              <label htmlFor="dressCodeHim" className="block text-sm text-slate-body mb-1.5">{tf("dressCodeHim")}
                <span className="text-xs text-slate-body/60 ms-1">({tf("optional")})</span>
              </label>
              <input id="dressCodeHim" type="text" value={data.dressCodeHim}
                onChange={(e) => handleFieldChange("dressCodeHim", e.target.value)}
                className={inputClass("dressCodeHim")}
                placeholder={tf("dressCodeHimPlaceholder")} dir="ltr" />
            </div>
          </div>
        </StepLayout>
      )}

      {/* Step 6: Venue */}
      {currentStep === "venue" && (
        <StepLayout title={stepLabels[5]} icon={MapPin}>
          <div>
            <label htmlFor="venue" className="block text-sm text-slate-body mb-1.5">{tf("venue")}</label>
            <input id="venue" type="text" value={data.venue}
              onChange={(e) => handleFieldChange("venue", e.target.value)}
              className={inputClass("venue")} placeholder={tf("venuePlaceholder")} dir="ltr" />
            {renderError("venue")}
          </div>
          <div>
            <label htmlFor="venueMapsLink" className="block text-sm text-slate-body mb-1.5">{tf("venueMapsLink")}
              <span className="text-xs text-slate-body/60 ms-1">({tf("optional")})</span>
            </label>
            <input id="venueMapsLink" type="url" value={data.venueMapsLink}
              onChange={(e) => handleFieldChange("venueMapsLink", e.target.value)}
              className={inputClass("venueMapsLink")} placeholder={tf("venueMapsPlaceholder")} dir="ltr" />
          </div>
        </StepLayout>
      )}

      {/* Step 7: Theme + Live Preview */}
      {currentStep === "theme" && (
        <StepLayout title={stepLabels[6]} icon={Sparkles}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {WEDDING_THEMES.map((theme) => {
              const selected = data.theme === theme.id;
              return (
                <motion.button
                  key={theme.id}
                  type="button"
                  onClick={() => handleFieldChange("theme", theme.id)}
                  className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                    selected
                      ? "border-gold bg-gold/10 text-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                      : "border-white/10 bg-dark-card/50 text-slate-body hover:border-gold/40 hover:bg-gold/5"
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-2xl">{theme.heartIcon}</span>
                  <p className="text-[10px] sm:text-xs font-bold text-center">{tt(theme.id)}</p>
                </motion.button>
              );
            })}
          </div>

          {/* Live Preview */}
          <div className="rounded-2xl overflow-hidden border border-white/10 max-h-[500px] overflow-y-auto">
            <WeddingPreview
              wedding={{
                coupleName1: data.coupleName1 || "العريس",
                coupleName2: data.coupleName2 || "العروسة",
                slug: data.slug || "preview",
                image: data.heroImage || undefined,
                happyMoment: data.happyMoment || undefined,
                story: data.story || undefined,
                storyImage: data.storyImage || undefined,
                date: data.date || "2026-01-01",
                time: data.time || "00:00",
                venue: data.venue || "المكان",
                venueMapsLink: data.venueMapsLink || undefined,
                dressCode: data.dressCode || undefined,
                dressCodeHer: data.dressCodeHer || undefined,
                dressCodeHim: data.dressCodeHim || undefined,
                theme: data.theme,
                active: true,
              }}
              compact
            />
          </div>
        </StepLayout>
      )}

      {/* Step 8: Review + Submit */}
      {currentStep === "review" && (
        <StepLayout title={stepLabels[7]}>
          <div className="space-y-3 mb-6">
            <div className="p-4 rounded-xl bg-dark-card/50 border border-white/10">
              <p className="text-xs text-slate-muted mb-1">{tr("coupleTitle")}</p>
              <p className="text-sm text-slate-light font-medium">{data.coupleName1} & {data.coupleName2}</p>
            </div>
            <div className="p-4 rounded-xl bg-dark-card/50 border border-white/10">
              <p className="text-xs text-slate-muted mb-1">{tr("eventTitle")}</p>
              <p className="text-sm text-slate-light font-medium">{data.date} — {data.time}</p>
            </div>
            {data.happyMoment && (
              <div className="p-4 rounded-xl bg-dark-card/50 border border-white/10">
                <p className="text-xs text-slate-muted mb-1">{tr("happyMomentTitle")}</p>
                <p className="text-sm text-slate-muted/80 line-clamp-2">{data.happyMoment}</p>
              </div>
            )}
            {data.story && (
              <div className="p-4 rounded-xl bg-dark-card/50 border border-white/10">
                <p className="text-xs text-slate-muted mb-1">{tr("storyTitle")}</p>
                <p className="text-sm text-slate-muted/80 line-clamp-2">{data.story}</p>
              </div>
            )}
            <div className="p-4 rounded-xl bg-dark-card/50 border border-white/10">
              <p className="text-xs text-slate-muted mb-1">{tr("venueTitle")}</p>
              <p className="text-sm text-slate-light font-medium">{data.venue}</p>
            </div>
            {(data.dressCode || data.dressCodeHer || data.dressCodeHim) && (
              <div className="p-4 rounded-xl bg-dark-card/50 border border-white/10">
                <p className="text-xs text-slate-muted mb-1">{tr("dressCodeTitle")}</p>
                {data.dressCode && <p className="text-sm text-slate-muted">{data.dressCode}</p>}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {data.dressCodeHer && <p className="text-xs text-slate-muted/60">👗 {data.dressCodeHer}</p>}
                  {data.dressCodeHim && <p className="text-xs text-slate-muted/60">🤵 {data.dressCodeHim}</p>}
                </div>
              </div>
            )}
            <div className="p-4 rounded-xl bg-dark-card/50 border border-white/10">
              <p className="text-xs text-slate-muted mb-1">{tr("themeTitle")}</p>
              <p className="text-sm text-slate-light font-medium capitalize">{tt(data.theme)}</p>
            </div>
          </div>
          <PrimaryButton type="button" loading={submitting} disabled={submitting || uploading} onClick={handleSubmit} className="w-full">
            {submitting ? tr("sending") : tr("sendBtn")}
          </PrimaryButton>
          <p className="text-xs text-amber-400/80 text-center mt-3">{tr("confirmMsg")}</p>
        </StepLayout>
      )}
    </>
  );

  return (
    <div>
      {renderStepIndicator()}
      {formContent}

      <div className="flex justify-between mt-6">
        {step > 0 ? (
          <PrimaryButton type="button" onClick={handleBack} disabled={uploading}>
            <ChevronLeft className="w-4 h-4" />
            {pf("back")}
          </PrimaryButton>
        ) : (
          <div />
        )}
        {step < ALL_STEPS.length - 1 ? (
          <PrimaryButton type="button" onClick={handleNext} disabled={uploading}>
            {pf("next")}
            <ChevronRight className="w-4 h-4" />
          </PrimaryButton>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
