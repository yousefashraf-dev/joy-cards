"use client";

import { useTranslations } from "next-intl";
import { Utensils, Star, ShoppingCart, Building2, Package } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormData = Record<string, any>;

interface FormCProps {
  data: FormData;
  onChange: (key: string, value: string | number | boolean) => void;
  errors: Record<string, string>;
}

export default function FormC_BusinessTap({ data, onChange, errors }: FormCProps) {
  const t = useTranslations("products.forms");

  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center gap-2 text-sm text-slate-muted mb-1.5">
          <Building2 className="w-4 h-4" /> <span>{t("fields.establishmentName")}</span>
        </label>
        <input
          type="text"
          value={data.establishmentName || ""}
          onChange={(e) => onChange("establishmentName", e.target.value)}
          placeholder={t("placeholders.establishmentName")}
          lang="ar"
          className={`w-full px-4 py-2.5 rounded-lg glass bg-dark-card border text-sm text-slate-light placeholder:text-slate-muted/40 focus:outline-none focus:border-nardo/50 focus:ring-1 focus:ring-nardo/20 transition-all duration-200 ${
            errors.establishmentName ? "border-red-400" : "border-white/10"
          }`}
        />
        {errors.establishmentName && <p className="text-red-400 text-xs mt-1">{errors.establishmentName}</p>}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm text-slate-muted mb-1.5">
          <Package className="w-4 h-4" /> <span>{t("fields.quantity")}</span>
        </label>
        <input
          type="number"
          value={data.quantity || "1"}
          onChange={(e) => onChange("quantity", e.target.value)}
          min="1"
          className={`w-full px-4 py-2.5 rounded-lg glass bg-dark-card border text-sm text-slate-light placeholder:text-slate-muted/40 focus:outline-none focus:border-nardo/50 focus:ring-1 focus:ring-nardo/20 transition-all duration-200 ${
            errors.quantity ? "border-red-400" : "border-white/10"
          }`}
        />
        {errors.quantity && <p className="text-red-400 text-xs mt-1">{errors.quantity}</p>}
      </div>

      <div className="pt-4 border-t border-white/5">
        <h4 className="text-sm font-semibold text-nardo/80 mb-4">{t("section.premium")}</h4>
        <div className="space-y-4">
          {[
            { key: "menuLink", icon: Utensils, placeholderKey: "menuLink" },
            { key: "googleReviews", icon: Star, placeholderKey: "googleReviewsLink" },
            { key: "onlineOrdering", icon: ShoppingCart, placeholderKey: "onlineOrdering" },
          ].map(({ key, icon: Icon, placeholderKey }) => (
            <div key={key}>
              <label className="flex items-center gap-2 text-sm text-slate-muted mb-1.5">
                <Icon className="w-4 h-4" />
                <span>{t(`fields.${key}`)}</span>
                <span className="text-xs text-slate-muted/50">({t("fields.optional")})</span>
              </label>
              <input
                type="text"
                value={data[key] || ""}
                onChange={(e) => onChange(key, e.target.value)}
                placeholder={t(`placeholders.${placeholderKey}`)}
                className="w-full px-4 py-2.5 rounded-lg glass bg-dark-card border border-white/10 text-sm text-slate-light placeholder:text-slate-muted/40 focus:outline-none focus:border-nardo/50 focus:ring-1 focus:ring-nardo/20 transition-all duration-200"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
