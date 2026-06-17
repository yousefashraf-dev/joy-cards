"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Upload, X, ImageIcon } from "lucide-react";
import { useLoading } from "@/components/ui/LoadingProvider";
import { useToast } from "@/components/ui/ToastProvider";

interface LogoUploadProps {
  value: string;
  onChange: (url: string) => void;
  error?: string;
}

export default function LogoUpload({ value, onChange, error }: LogoUploadProps) {
  const t = useTranslations("products.forms");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    showLoading(t("uploading"));
    try {
      const formData = new FormData();
      formData.append("file", file);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await res.json();
      if (!res.ok) {
        console.error("Upload server error:", res.status, data);
        const serverMsg = data?.error || t("uploadError");
        showToast(serverMsg, "error");
        return;
      }
      if (data.url) {
        onChange(data.url);
        showToast(t("uploadSuccess"), "success");
      }
    } catch (err) {
      const msg = err instanceof DOMException && err.name === "AbortError"
        ? "تعذر الاتصال بالخادم، تأكد من اتصالك بالإنترنت"
        : err instanceof Error ? err.message : t("uploadError");
      console.error("Upload failed:", err);
      showToast(msg, "error");
    } finally {
      hideLoading();
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="flex items-center gap-2 text-sm text-slate-muted mb-1.5">
        <ImageIcon className="w-4 h-4" />
        <span>{t("fields.logo")}</span>
        <span className="text-xs text-slate-muted/50">(Optional)</span>
      </label>
      <p className="text-xs text-slate-muted/60 mb-2">{t("uploadHelper")}</p>

      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Logo preview"
            className="w-24 h-24 rounded-xl object-cover border border-white/10"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -end-2 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full p-6 rounded-xl border-2 border-dashed border-white/10 hover:border-nardo/30 glass bg-dark-card/50 hover:bg-dark-card transition-all duration-200 flex flex-col items-center gap-2 disabled:opacity-50"
        >
           <Upload className={`w-6 h-6 ${uploading ? "text-nardo animate-pulse" : "text-slate-muted"}`} />
          <span className="text-sm text-slate-muted">
            {uploading ? t("uploading") : t("uploadHelper")}
          </span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
