"use client";

import { useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { formatSocialLink, type Platform } from "@/lib/formatSocialLink";
import { submitOrder } from "@/lib/submitOrder";
import type { Theme, ProductType, OrderPayload } from "@/lib/types";
import ThemeSelector from "./ThemeSelector";
import SocialLinksBlock from "./SocialLinksBlock";
import LogoUpload from "./LogoUpload";
import SuccessModal from "./SuccessModal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useLoading } from "@/components/ui/LoadingProvider";
import { useToast } from "@/components/ui/ToastProvider";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormData = Record<string, any>;

interface BaseFormProps {
  productType: ProductType;
  specificFields: (props: {
    data: FormData;
    onChange: (key: string, value: string | number | boolean) => void;
    errors: Record<string, string>;
  }) => React.ReactNode;
  productSection: React.ReactNode;
  hideThemeSelector?: boolean;
}

export default function BaseForm({ productType, specificFields, productSection, hideThemeSelector }: BaseFormProps) {
  const t = useTranslations("products.forms");
  const e = useTranslations("products.errors");
  const tm = useTranslations("messages");
  const locale = useLocale();

  const [customerName, setCustomerName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const defaultTheme: Theme = productType === "digital-cards" ? "classic-executive" : "modern-bistro";
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [logo, setLogo] = useState("");
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [specificData, setSpecificData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();

  const handleSocialChange = useCallback((id: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const handleSpecificChange = useCallback((key: string, value: string | number | boolean) => {
    setSpecificData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) newErrors.customerName = e("required");
    if (!phone.trim()) newErrors.phone = e("required");
    else if (!/^\+?[0-9]{7,15}$/.test(phone.replace(/[\s-]/g, ""))) {
      newErrors.phone = e("invalidPhone");
    }
    if (!governorate.trim()) newErrors.governorate = e("required");
    if (!city.trim()) newErrors.city = e("required");
    if (!street.trim()) newErrors.street = e("required");

    if (productType === "business-tap") {
      if (!specificData.establishmentName?.trim()) newErrors.establishmentName = e("required");
      if (!specificData.quantity) newErrors.quantity = e("required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [customerName, phone, governorate, city, street, productType, specificData, e]);

  const clearError = useCallback((key: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    showLoading(tm("sending"));

    const formattedSocials: Record<string, string> = {};
    for (const [key, val] of Object.entries(socialLinks)) {
      if (val.trim()) {
        formattedSocials[key] = formatSocialLink(val, key as Platform);
      }
    }

    const basePayload: Partial<OrderPayload> = {
      customerName: customerName.trim(),
      displayName: displayName.trim() || undefined,
      phone: phone.trim(),
      governorate: governorate.trim(),
      city: city.trim(),
      street: street.trim(),
      theme,
      productType,
      logo: logo || undefined,
      socialLinks: formattedSocials,
    };

    if (productType === "digital-cards") {
      basePayload.digitalCardsFields = {
        website: specificData.website ? formatSocialLink(specificData.website, "website") : undefined,
        googleMaps: specificData.googleMaps ? formatSocialLink(specificData.googleMaps, "googleMaps") : undefined,
        linkedin: specificData.linkedin ? formatSocialLink(specificData.linkedin, "linkedin") : undefined,
        email: specificData.email ? formatSocialLink(specificData.email, "email") : undefined,
        pdfProfile: specificData.pdfProfile ? formatSocialLink(specificData.pdfProfile, "pdfProfile") : undefined,
      };
    } else if (productType === "business-tap") {
      basePayload.businessTapFields = {
        establishmentName: specificData.establishmentName,
        quantity: parseInt(specificData.quantity) || 1,
        menuLink: specificData.menuLink ? formatSocialLink(specificData.menuLink, "menuLink") : undefined,
        googleReviews: specificData.googleReviews ? formatSocialLink(specificData.googleReviews, "googleReviews") : undefined,
        onlineOrdering: specificData.onlineOrdering ? formatSocialLink(specificData.onlineOrdering, "onlineOrdering") : undefined,
      };
    }

    try {
      await submitOrder(basePayload as OrderPayload, undefined, locale);
      showToast(tm("sent"), "success");
    } catch {
      showToast(tm("failed"), "error");
    }
    hideLoading();
    setSubmitting(false);
    setShowSuccess(true);
  };

  const renderField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    key: string,
    required = true,
    type: string = "text"
  ) => (
    <div>
      <label className="block text-sm text-slate-muted mb-1.5">
        {label}
        {!required && <span className="text-xs text-slate-muted/50 ms-1">({t("fields.optional")})</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          clearError(key);
        }}
        lang={["customerName","displayName","governorate","city","street"].includes(key) ? "ar" : undefined}
        className={`w-full px-4 py-2.5 rounded-lg glass bg-dark-card border text-sm text-slate-light placeholder:text-slate-muted/40 focus:outline-none focus:border-nardo/50 focus:ring-1 focus:ring-nardo/20 transition-all duration-200 ${
          errors[key] ? "border-red-400" : "border-white/10"
        }`}
      />
      {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <>
      {productSection}

      <section className="py-16 lg:py-20 bg-matte-dark/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-light mb-8">
              {t("submit")}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="glass bg-dark-card/50 border border-white/5 rounded-2xl p-6 lg:p-8 space-y-5">
                <h3 className="text-lg font-semibold text-nardo mb-4">{t("section.personal")}</h3>
                {renderField(locale === "en" ? "الاسم الثلاثي بالعربي" : t("fields.customerName"), customerName, setCustomerName, "customerName")}
                {renderField(t("fields.displayName"), displayName, setDisplayName, "displayName", false)}
                {renderField(t("fields.phone"), phone, setPhone, "phone", true, "tel")}
                {renderField(t("fields.governorate"), governorate, setGovernorate, "governorate")}
                {renderField(t("fields.city"), city, setCity, "city")}
                {renderField(locale === "en" ? "الشارع / تفاصيل العنوان" : t("fields.street"), street, setStreet, "street")}
              </div>

              {!hideThemeSelector && (
                <div className="glass bg-dark-card/50 border border-white/5 rounded-2xl p-6 lg:p-8 space-y-5">
                  <h3 className="text-lg font-semibold text-nardo mb-4">{t("section.theme")}</h3>
                  <ThemeSelector value={theme} onChange={setTheme} productType={productType} />
                </div>
              )}

              <div className="glass bg-dark-card/50 border border-white/5 rounded-2xl p-6 lg:p-8 space-y-5">
                <h3 className="text-lg font-semibold text-nardo mb-4">{t("section.logo")}</h3>
                <LogoUpload value={logo} onChange={setLogo} />
              </div>

              <div className="glass bg-dark-card/50 border border-white/5 rounded-2xl p-6 lg:p-8 space-y-5">
                <h3 className="text-lg font-semibold text-nardo mb-4">{t("section.social")}</h3>
                <SocialLinksBlock
                  values={socialLinks}
                  onChange={handleSocialChange}
                  errors={errors}
                />
              </div>

              <div className="glass bg-dark-card/50 border border-white/5 rounded-2xl p-6 lg:p-8 space-y-5">
                <h3 className="text-lg font-semibold text-nardo mb-4">{t("section.product")}</h3>
                {specificFields({
                  data: specificData,
                  onChange: handleSpecificChange,
                  errors,
                })}
              </div>

              <div className="text-center pt-4">
                <PrimaryButton type="submit" loading={submitting} disabled={submitting}>
                  {submitting ? t("submitting") : t("submit")}
                </PrimaryButton>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        orderDetails={{
          customerName: customerName.trim(),
          phone: phone.trim(),
          productType,
        }}
      />
    </>
  );
}
