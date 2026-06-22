"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { X, Upload, ImageIcon, FileText, Link as LinkIcon, Trash2 } from "lucide-react";
import type { Cafe } from "@/lib/cafe-schema";
import { addCafe, updateCafe, uploadCafeFile } from "@/lib/cafe-schema";
import { compressImage } from "@/lib/compressImage";

interface CafeFormProps {
  cafe?: Cafe | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CafeForm({ cafe, onSuccess, onCancel }: CafeFormProps) {
  const t = useTranslations("admin.form");
  const ta = useTranslations("admin");
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(cafe?.name || "");
  const [slug, setSlug] = useState(cafe?.slug || "");
  const [menuType, setMenuType] = useState<"pdf" | "images" | "link">(
    cafe?.menuType || "pdf"
  );
  const [menuUrl, setMenuUrl] = useState(cafe?.menuUrl || "");
  const [phone, setPhone] = useState(cafe?.phone || "");
  const [whatsapp, setWhatsapp] = useState(cafe?.whatsapp || "");
  const [websiteUrl, setWebsiteUrl] = useState(cafe?.websiteUrl || "");
  const [facebook, setFacebook] = useState(cafe?.facebook || "");
  const [instagram, setInstagram] = useState(cafe?.instagram || "");
  const [tiktok, setTiktok] = useState(cafe?.tiktok || "");
  const [snapchatUrl, setSnapchatUrl] = useState(cafe?.snapchatUrl || "");
  const [googleMapsUrl, setGoogleMapsUrl] = useState(cafe?.googleMapsUrl || "");
  const [googleReviewsUrl, setGoogleReviewsUrl] = useState(
    cafe?.googleReviewsUrl || ""
  );
  const [wifiName, setWifiName] = useState(cafe?.wifiName || "");
  const [wifiPassword, setWifiPassword] = useState(cafe?.wifiPassword || "");

  // File uploads
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [menuFiles, setMenuFiles] = useState<File[]>([]);
  const [existingMenuImages, setExistingMenuImages] = useState<string[]>(
    cafe?.menuImages || []
  );

  const generateSlug = useCallback((val: string) => {
    const s = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setSlug(s);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    setSaving(true);
    try {
      let logoUrl = cafe?.logo || "";
      let finalMenuUrl = menuUrl;
      let finalMenuImages = existingMenuImages;

      // Upload logo to Cloudinary if new file selected
      if (logoFile) {
        const compressed = await compressImage(logoFile);
        const fd = new FormData();
        fd.append("file", compressed);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        logoUrl = data.url;
      }

      // Upload menu files if new files selected
      if (menuType === "images" && menuFiles.length > 0) {
        const uploaded: string[] = [];
        for (const file of menuFiles) {
          const compressed = await compressImage(file);
          const fd = new FormData();
          fd.append("file", compressed);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          const data = await res.json();
          uploaded.push(data.url);
        }
        finalMenuImages = [...finalMenuImages, ...uploaded];
        finalMenuUrl = "";
      } else if (menuType === "pdf" && menuFiles.length > 0) {
        finalMenuUrl = await uploadCafeFile(
          menuFiles[0],
          `menus/${slug}-${Date.now()}-${menuFiles[0].name}`
        );
        finalMenuImages = [];
      }

      const data = {
        name: name.trim(),
        slug: slug.trim(),
        logo: logoUrl,
        menuUrl: finalMenuUrl,
        menuImages: menuType === "images" ? finalMenuImages : [],
        menuType,
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        websiteUrl: websiteUrl.trim(),
        facebook: facebook.trim(),
        instagram: instagram.trim(),
        tiktok: tiktok.trim(),
        snapchatUrl: snapchatUrl.trim(),
        googleMapsUrl: googleMapsUrl.trim(),
        googleReviewsUrl: googleReviewsUrl.trim(),
        wifiName: wifiName.trim(),
        wifiPassword: wifiPassword.trim(),
      };

      if (cafe?.id) {
        await updateCafe(cafe.id, data);
      } else {
        const docId = await addCafe(data);
        // Send to Google Sheets via API proxy
        try {
          await fetch("/api/cafe-to-sheet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...data,
              menuUrl: finalMenuUrl,
              menuImages: finalMenuImages,
              docId,
              cafeLink: `https://gotap.vercel.app/ar/cafe/${data.slug}`,
              submittedAt: new Date().toISOString(),
            }),
          });
        } catch {
          // sheet logging is best-effort
        }
      }
      onSuccess();
    } catch (error) {
      console.error("Cafe save error:", error);
      alert(ta("errorOccurred"));
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg bg-dark-card border border-white/10 text-sm text-slate-light placeholder:text-slate-muted/40 focus:outline-none focus:border-neon-green/50 transition-all duration-200";

  const labelClass = "block text-sm text-slate-muted mb-1.5";

  return (
    <div className="glass bg-matte-card/90 border border-white/10 rounded-2xl p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-light">
          {cafe ? ta("editCafe") : ta("addCafe")}
        </h2>
        <button
          onClick={onCancel}
          className="text-slate-muted hover:text-slate-light transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name & Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t("name")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!cafe) generateSlug(e.target.value);
              }}
              className={inputClass}
              placeholder={t("name")}
              required
            />
          </div>
          <div>
            <label className={labelClass}>{t("slug")}</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={inputClass}
              placeholder="my-cafe"
              required
              dir="ltr"
            />
            <p className="text-xs text-slate-muted/50 mt-1">
              {t("slugHelper", { slug: slug || "..." })}
            </p>
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <label className={labelClass}>{t("logo")}</label>
          <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-white/20 bg-dark-card/50 cursor-pointer hover:border-neon-green/50 transition-colors duration-200">
            <Upload className="w-5 h-5 text-slate-muted" />
            <span className="text-sm text-slate-muted">
              {logoFile ? logoFile.name : cafe?.logo ? t("logo") : "PNG, JPG"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {/* Menu Type Selection */}
        <div>
          <label className={labelClass}>{t("menuType")}</label>
          <div className="flex gap-3">
            {(["pdf", "images", "link"] as const).map((type) => {
              const Icon = type === "pdf" ? FileText : type === "images" ? ImageIcon : LinkIcon;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMenuType(type)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-all duration-200 ${
                    menuType === type
                      ? "border-neon-green bg-neon-green/10 text-neon-green"
                      : "border-white/10 bg-dark-card text-slate-muted hover:border-white/30"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t(`menuType${type.charAt(0).toUpperCase() + type.slice(1)}`)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Upload or Link */}
        {menuType === "link" ? (
          <div>
            <label className={labelClass}>{t("menuLink")}</label>
            <input
              type="url"
              value={menuUrl}
              onChange={(e) => setMenuUrl(e.target.value)}
              className={inputClass}
              placeholder="https://menu.example.com"
              dir="ltr"
            />
          </div>
        ) : menuType === "images" ? (
          <div>
            <label className={labelClass}>{t("menuFile")}</label>
            {/* Existing images preview */}
            {existingMenuImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {existingMenuImages.map((url, i) => (
                  <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Menu ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setExistingMenuImages((prev) =>
                          prev.filter((_, idx) => idx !== i)
                        )
                      }
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* New files preview */}
            {menuFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {menuFiles.map((file, i) => (
                  <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-white/10 bg-dark-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setMenuFiles((prev) =>
                          prev.filter((_, idx) => idx !== i)
                        )
                      }
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-white/20 bg-dark-card/50 cursor-pointer hover:border-neon-green/50 transition-colors duration-200">
              <Upload className="w-5 h-5 text-slate-muted" />
              <span className="text-sm text-slate-muted">
                {menuFiles.length > 0
                  ? `${menuFiles.length} ${t("menuFile")}`
                  : existingMenuImages.length > 0
                  ? `${existingMenuImages.length} ${t("menuFile")}`
                  : "PNG, JPG — متعدد"}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setMenuFiles((prev) => [...prev, ...files]);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        ) : (
          <div>
            <label className={labelClass}>{t("menuFile")}</label>
            <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-white/20 bg-dark-card/50 cursor-pointer hover:border-neon-green/50 transition-colors duration-200">
              <Upload className="w-5 h-5 text-slate-muted" />
              <span className="text-sm text-slate-muted">
                {menuFiles.length > 0
                  ? menuFiles[0].name
                  : cafe?.menuUrl
                  ? t("menuFile")
                  : "PDF"}
              </span>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setMenuFiles(file ? [file] : []);
                }}
              />
            </label>
          </div>
        )}

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t("phone")}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="+201234567890"
              dir="ltr"
            />
          </div>
          <div>
            <label className={labelClass}>{t("whatsapp")}</label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className={inputClass}
              placeholder="+201234567890"
              dir="ltr"
            />
          </div>
        </div>

        {/* Website */}
        <div>
          <label className={labelClass}>{t("websiteUrl")}</label>
          <input
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className={inputClass}
            placeholder="https://example.com"
            dir="ltr"
          />
        </div>

        {/* Social Links */}
        <div>
          <p className="text-sm text-slate-muted mb-3 font-medium">
            Social Media
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className={inputClass}
                placeholder={t("facebook")}
                dir="ltr"
              />
            </div>
            <div>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className={inputClass}
                placeholder={t("instagram")}
                dir="ltr"
              />
            </div>
            <div>
              <input
                type="url"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                className={inputClass}
                placeholder={t("tiktok")}
                dir="ltr"
              />
            </div>
            <div>
              <input
                type="url"
                value={snapchatUrl}
                onChange={(e) => setSnapchatUrl(e.target.value)}
                className={inputClass}
                placeholder={t("snapchatUrl")}
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Google Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t("googleMapsUrl")}</label>
            <input
              type="url"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              className={inputClass}
              placeholder="https://maps.app.goo.gl/..."
              dir="ltr"
            />
          </div>
          <div>
            <label className={labelClass}>{t("googleReviewsUrl")}</label>
            <input
              type="url"
              value={googleReviewsUrl}
              onChange={(e) => setGoogleReviewsUrl(e.target.value)}
              className={inputClass}
              placeholder="https://g.page/r/..."
              dir="ltr"
            />
          </div>
        </div>

        {/* Wi-Fi */}
        <div>
          <p className="text-sm text-slate-muted mb-3 font-medium">
            Wi-Fi
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={wifiName}
                onChange={(e) => setWifiName(e.target.value)}
                className={inputClass}
                placeholder={t("wifiName")}
              />
            </div>
            <div>
              <input
                type="text"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                className={inputClass}
                placeholder={t("wifiPassword")}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={saving || !name.trim() || !slug.trim()}
            className="flex-1 py-3 rounded-lg bg-neon-green text-matte-dark font-bold hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
