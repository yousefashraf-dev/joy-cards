"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { X, Upload, Download, Heart } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import type { WeddingCard } from "@/lib/wedding-schema";
import { compressImage } from "@/lib/compressImage";
import { useToast } from "@/components/ui/ToastProvider";

interface WeddingFormProps {
  wedding?: WeddingCard | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function WeddingForm({ wedding, onSuccess, onCancel }: WeddingFormProps) {
  const t = useTranslations("admin.form");
  const ta = useTranslations("admin");
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const [coupleName1, setCoupleName1] = useState(wedding?.coupleName1 || "");
  const [coupleName2, setCoupleName2] = useState(wedding?.coupleName2 || "");
  const [slug, setSlug] = useState(wedding?.slug || "");
  const [date, setDate] = useState(wedding?.date || "");
  const [time, setTime] = useState(wedding?.time || "");
  const [venue, setVenue] = useState(wedding?.venue || "");
  const [venueMapsLink, setVenueMapsLink] = useState(wedding?.venueMapsLink || "");
  const [story, setStory] = useState(wedding?.story || "");
  const [dressCode, setDressCode] = useState(wedding?.dressCode || "");
  const [dressCodeHer, setDressCodeHer] = useState(wedding?.dressCodeHer || "");
  const [dressCodeHim, setDressCodeHim] = useState(wedding?.dressCodeHim || "");
  const [active, setActive] = useState(wedding?.active ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState(wedding?.image || "");

  const qrRef = useRef<HTMLDivElement>(null);
  const qrPrintRef = useRef<HTMLDivElement>(null);

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg bg-dark-card border border-white/10 text-sm text-slate-light placeholder:text-slate-muted/40 focus:outline-none focus:border-gold/50 transition-all duration-200";

  const labelClass = "block text-sm text-slate-muted mb-1.5";

  const generateSlug = useCallback((val: string) => {
    const s = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setSlug(s);
  }, []);

  const handleDownloadQR = useCallback(() => {
    const canvas = qrPrintRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `wedding-qr-${slug || "card"}.png`;
    a.click();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupleName1.trim() || !coupleName2.trim() || !slug.trim()) return;

    setSaving(true);
    try {
      let imageUrl = existingImage;

      if (imageFile) {
        const compressed = await compressImage(imageFile);
        const fd = new FormData();
        fd.append("file", compressed);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000);
        const res = await fetch("/api/upload", { method: "POST", body: fd, signal: controller.signal });
        clearTimeout(timeout);
        let data: { url?: string; error?: string };
        try { data = await res.json(); }
        catch { const text = await res.text().catch(() => ""); throw new Error(text ? `Server (${res.status}): ${text.slice(0, 200)}` : `Upload failed (HTTP ${res.status})`); }
        if (!res.ok || !data.url) throw new Error(data.error || "Image upload failed");
        imageUrl = data.url;
      }

      const data = {
        coupleName1: coupleName1.trim(),
        coupleName2: coupleName2.trim(),
        slug: slug.trim(),
        image: imageUrl,
        story: story.trim(),
        date: date.trim(),
        time: time.trim(),
        venue: venue.trim(),
        venueMapsLink: venueMapsLink.trim(),
        dressCode: dressCode.trim(),
        dressCodeHer: dressCodeHer.trim(),
        dressCodeHim: dressCodeHim.trim(),
        active,
      };

      if (wedding?.id) {
        await fetch(`/api/weddings/${wedding.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        await fetch("/api/weddings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Wedding save error:", error);
      showToast(ta("errorOccurred"), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass bg-matte-card/90 border border-white/10 rounded-2xl p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-light">
          {wedding ? ta("editWedding") : ta("addWedding")}
        </h2>
        <button onClick={onCancel} className="text-slate-muted hover:text-slate-light transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t("coupleName1")}</label>
            <input
              type="text"
              value={coupleName1}
              onChange={(e) => {
                setCoupleName1(e.target.value);
                if (!wedding) generateSlug(`${e.target.value}-${coupleName2}`);
              }}
              className={inputClass}
              placeholder="Seif"
              required
              dir="ltr"
            />
          </div>
          <div>
            <label className={labelClass}>{t("coupleName2")}</label>
            <input
              type="text"
              value={coupleName2}
              onChange={(e) => {
                setCoupleName2(e.target.value);
                if (!wedding) generateSlug(`${coupleName1}-${e.target.value}`);
              }}
              className={inputClass}
              placeholder="Rodaina"
              required
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>{t("slug")}</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputClass}
            placeholder="seif-rodaina"
            required
            dir="ltr"
          />
          <p className="text-xs text-slate-muted/50 mt-1">
            gotap.vercel.app/ar/wedding/{slug || "..."}
          </p>
        </div>

        <div>
          <label className={labelClass}>{ta("form.qrCode")}</label>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-dark-card border border-white/10">
            <div ref={qrRef} className="shrink-0">
              {slug ? (
                <QRCodeCanvas
                  value={`https://gotap.vercel.app/ar/wedding/${slug}`}
                  size={90}
                  level="H"
                />
              ) : (
                <div className="w-[90px] h-[90px] rounded-lg bg-white/5 flex items-center justify-center">
                  <span className="text-xs text-slate-muted/50">---</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-muted truncate" dir="ltr">
                https://gotap.vercel.app/ar/wedding/{slug || "..."}
              </p>
              <button
                type="button"
                onClick={handleDownloadQR}
                disabled={!slug}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all duration-200 border-gold/30 text-gold hover:bg-gold/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download className="w-3.5 h-3.5" />
                {ta("form.downloadQR")}
              </button>
            </div>
          </div>
        </div>

        <div ref={qrPrintRef} className="hidden">
          {slug && (
            <QRCodeCanvas
              value={`https://gotap.vercel.app/ar/wedding/${slug}`}
              size={2000}
              level="H"
            />
          )}
        </div>

        <div>
          <label className={labelClass}>{t("image")}</label>
          <label
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-white/20 bg-dark-card/50 cursor-pointer hover:border-gold/50 transition-colors duration-200"
          >
            <Upload className="w-5 h-5 text-slate-muted" />
            <span className="text-sm text-slate-muted">
              {imageFile ? imageFile.name : existingImage ? t("image") : "PNG, JPG"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t("date")}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>{t("time")}</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>{t("venue")}</label>
          <input
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className={inputClass}
            placeholder="Emilia Venue"
            required
            dir="ltr"
          />
        </div>

        <div>
          <label className={labelClass}>{t("venueMapsLink")}</label>
          <input
            type="url"
            value={venueMapsLink}
            onChange={(e) => setVenueMapsLink(e.target.value)}
            className={inputClass}
            placeholder="https://maps.app.goo.gl/..."
            dir="ltr"
          />
        </div>

        <div>
          <label className={labelClass}>{t("story")}</label>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            className={`${inputClass} min-h-[80px] resize-y`}
            placeholder="From the very beginning, their story has been one of warmth, laughter..."
            rows={4}
            dir="ltr"
          />
        </div>

        <div>
          <label className={labelClass}>{t("dressCode")}</label>
          <input
            type="text"
            value={dressCode}
            onChange={(e) => setDressCode(e.target.value)}
            className={inputClass}
            placeholder="Summer pastels, florals & sunset shades"
            dir="ltr"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t("dressCodeHer")}</label>
            <input
              type="text"
              value={dressCodeHer}
              onChange={(e) => setDressCodeHer(e.target.value)}
              className={inputClass}
              placeholder="Blush Pink, Peach, Sage Green..."
              dir="ltr"
            />
          </div>
          <div>
            <label className={labelClass}>{t("dressCodeHim")}</label>
            <input
              type="text"
              value={dressCodeHim}
              onChange={(e) => setDressCodeHim(e.target.value)}
              className={inputClass}
              placeholder="Navy, Midnight, Gold Tie..."
              dir="ltr"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="active"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="accent-gold w-4 h-4"
          />
          <label htmlFor="active" className="text-sm text-slate-muted cursor-pointer">
            Active
          </label>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={saving || !coupleName1.trim() || !coupleName2.trim() || !slug.trim()}
            className="flex-1 py-3 rounded-lg bg-gold text-matte-dark font-bold hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {saving ? t("saving") : t("save")}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-lg bg-dark-card border border-white/10 text-slate-muted hover:text-slate-light transition-colors duration-200"
          >
            {t("cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}
