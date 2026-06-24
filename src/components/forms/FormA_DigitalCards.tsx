"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Globe, MapPin, Briefcase, Mail, FileText, Palette } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormData = Record<string, any>;

interface FormAProps {
  data: FormData;
  onChange: (key: string, value: string | number | boolean) => void;
  errors: Record<string, string>;
}

export default function FormA_DigitalCards({ data, onChange }: FormAProps) {
  const t = useTranslations("products.forms");
  const { showToast } = useToast();
  const [pdfUploading, setPdfUploading] = useState(false);
  const pdfRef = useRef<HTMLInputElement>(null);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") return;
    setPdfUploading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData, signal: controller.signal });
      clearTimeout(timeout);
      const result = await res.json();
      if (!res.ok) {
        showToast(t("uploadError"), "error");
        return;
      }
      if (result.url) {
        onChange("pdfProfile", result.url);
        showToast(t("uploadSuccess"), "success");
      }
    } catch {
      showToast(t("uploadError"), "error");
    } finally {
      setPdfUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-matte-card/50 border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-nardo" />
            <div>
              <span className="text-sm font-medium text-slate-light">{t("fields.customPrintDesign")}</span>
              <p className="text-xs text-slate-muted/70">{t("fields.customPrintDesignDesc")}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange("customPrintDesign", !data.customPrintDesign)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
              data.customPrintDesign ? "bg-nardo" : "bg-white/10"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                data.customPrintDesign ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5">
        <h4 className="text-sm font-semibold text-nardo/80 mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          {t("section.premium")}
        </h4>

        <div className="space-y-4">
          {[
            { key: "website", icon: Globe, placeholderKey: "website" },
            { key: "googleMaps", icon: MapPin, placeholderKey: "googleMaps" },
            { key: "linkedin", icon: Briefcase, placeholderKey: "linkedin" },
            { key: "email", icon: Mail, placeholderKey: "email", type: "email" },
          ].map(({ key, icon: Icon, placeholderKey, type }) => (
            <div key={key}>
              <label className="flex items-center gap-2 text-sm text-slate-muted mb-1.5">
                <Icon className="w-4 h-4" />
                <span>{t(`fields.${key}`)}</span>
                <span className="text-xs text-slate-muted/50">({t("fields.optional")})</span>
              </label>
              <input
                type={type || "text"}
                value={data[key] || ""}
                onChange={(e) => onChange(key, e.target.value)}
                placeholder={t(`placeholders.${placeholderKey}`)}
                className="w-full px-4 py-2.5 rounded-lg glass bg-dark-card border border-white/10 text-sm text-slate-light placeholder:text-slate-muted/40 focus:outline-none focus:border-nardo/50 focus:ring-1 focus:ring-nardo/20 transition-all duration-200"
              />
            </div>
          ))}

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-muted mb-1.5">
              <FileText className="w-4 h-4" />
              <span>{t("fields.pdfProfile")}</span>
              <span className="text-xs text-slate-muted/50">({t("fields.optional")})</span>
            </label>
            {data.pdfProfile ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-card border border-white/10">
                <FileText className="w-5 h-5 text-nardo" />
                <span className="text-sm text-slate-muted flex-1 truncate">{t("fields.pdfUploaded")}</span>
                <button type="button" onClick={() => onChange("pdfProfile", "")} className="text-xs text-red-400">
                  {t("fields.pdfRemove")}
                </button>
              </div>
            ) : (
              <label
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-white/10 hover:border-nardo/30 cursor-pointer bg-dark-card/50 transition-all"
              >
                <FileText className="w-5 h-5 text-slate-muted" />
                <span className="text-sm text-slate-muted">{pdfUploading ? t("uploading") : t("fields.pdfUpload")}</span>
                <input ref={pdfRef} type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
