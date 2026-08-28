"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { X, Upload, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import type { MenuItem, MenuCategory } from "@/lib/cafe-schema";
import type { CafeTheme } from "@/lib/cafe-themes";
import { CAFE_THEMES } from "@/lib/cafe-themes";
import { compressImage } from "@/lib/compressImage";
import { BASE_URL } from "@/lib/constants";
import { useToast } from "@/components/ui/ToastProvider";
import MenuBuilder from "./MenuBuilder";

interface MenuFormProps {
  menu?: {
    id?: string;
    name: string;
    slug: string;
    logo?: string;
    categories: MenuCategory[];
    items: MenuItem[];
    theme: CafeTheme;
    adminPin?: string;
  } | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const inputClass =
  "w-full px-4 py-2.5 rounded-lg bg-dark-card border border-white/10 text-sm text-slate-light placeholder:text-slate-muted/40 focus:outline-none focus:border-neon-green/50 transition-all duration-200";

export default function MenuForm({ menu, onSuccess, onCancel }: MenuFormProps) {
  const t = useTranslations("admin.form");
  const ta = useTranslations("admin");
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(menu?.name || "");
  const [slug, setSlug] = useState(menu?.slug || "");
  const [theme, setTheme] = useState<CafeTheme>(menu?.theme || "cafe");
  const [categories, setCategories] = useState<MenuCategory[]>(menu?.categories || []);
  const [items, setItems] = useState<MenuItem[]>(menu?.items || []);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [existingLogo, setExistingLogo] = useState(menu?.logo || "");
  const [adminPin, setAdminPin] = useState(menu?.adminPin || "");

  const qrRef = useRef<HTMLDivElement>(null);
  const qrPrintRef = useRef<HTMLDivElement>(null);

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
    a.download = `qr-menu-${slug || "menu"}.png`;
    a.click();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;
    setSaving(true);

    try {
      let logoUrl = existingLogo;
      if (logoFile) {
        const compressed = await compressImage(logoFile);
        const fd = new FormData();
        fd.append("file", compressed);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok || !data.url) throw new Error(data.error || "Logo upload failed");
        logoUrl = data.url;
      }

      const data = {
        name: name.trim(),
        slug: slug.trim(),
        logo: logoUrl,
        categories,
        items: items.filter((i) => i.name.trim()),
        theme,
        adminPin: adminPin.trim(),
      };

      if (menu?.id) {
        await fetch(`/api/menus/${menu.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        await fetch("/api/menus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      onSuccess();
    } catch (error) {
      console.error("Menu save error:", error);
      showToast(ta("errorOccurred"), "error");
    } finally {
      setSaving(false);
    }
  };

  const menuUrl = slug ? `${BASE_URL}/ar/menu/${slug}` : "";

  return (
    <div className="glass bg-matte-card/90 border border-white/10 rounded-2xl p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-light">
          {menu ? "تعديل المنيو" : "إضافة منيو رقمي جديد"}
        </h2>
        <button onClick={onCancel} className="text-slate-muted hover:text-slate-light transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name & Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-muted mb-1.5">اسم المنيو</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!menu) generateSlug(e.target.value);
              }}
              className={inputClass}
              placeholder="مثال: منيو كافيه روما"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-muted mb-1.5">الرابط (Slug)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={inputClass}
              placeholder="my-menu"
              required
              dir="ltr"
            />
          </div>
        </div>

        {/* QR Code */}
        <div>
          <label className="block text-sm text-slate-muted mb-1.5">رمز QR</label>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-dark-card border border-white/10">
            <div ref={qrRef} className="shrink-0">
              {slug ? (
                <QRCodeCanvas value={menuUrl} size={90} level="H" />
              ) : (
                <div className="w-[90px] h-[90px] rounded-lg bg-white/5 flex items-center justify-center">
                  <span className="text-xs text-slate-muted/50">---</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-muted truncate" dir="ltr">
                {menuUrl || "---"}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  disabled={!slug}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all duration-200 border-neon-green/30 text-neon-green hover:bg-neon-green/10 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Download className="w-3.5 h-3.5" />
                  تحميل QR
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(menuUrl);
                    showToast("تم نسخ الرابط!", "success");
                  }}
                  disabled={!slug}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all duration-200 border-neon-green/30 text-neon-green hover:bg-neon-green/10 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  نسخ الرابط
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden high-res QR */}
        <div ref={qrPrintRef} className="hidden">
          {slug && <QRCodeCanvas value={menuUrl} size={2000} level="H" />}
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm text-slate-muted mb-1.5">شعار المنيو (اختياري)</label>
          <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-white/20 bg-dark-card/50 cursor-pointer hover:border-neon-green/50 transition-colors duration-200">
            <Upload className="w-5 h-5 text-slate-muted" />
            <span className="text-sm text-slate-muted">
              {logoFile ? logoFile.name : existingLogo ? "تم رفع شعار" : "PNG, JPG"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {/* Theme Selection */}
        <div>
          <label className="block text-sm text-slate-muted mb-1.5">ثيم التصميم</label>
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(CAFE_THEMES) as [CafeTheme, typeof CAFE_THEMES[CafeTheme]][]).map(([key, cfg]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTheme(key)}
                className={`flex items-center gap-2 px-3 py-3 rounded-lg border text-sm transition-all duration-200 ${
                  theme === key
                    ? "border-neon-green bg-neon-green/10 text-neon-green"
                    : "border-white/10 bg-dark-card text-slate-muted hover:border-white/30"
                }`}
              >
                <span className="text-lg">{cfg.icon}</span>
                <span className="font-medium">{cfg.label.ar}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Edit PIN */}
        <div>
          <label className="block text-sm text-slate-muted mb-1.5">كلمة سر التعديل السريع (Quick Edit PIN)</label>
          <input
            type="password"
            value={adminPin}
            onChange={(e) => setAdminPin(e.target.value)}
            inputMode="numeric"
            maxLength={6}
            className={inputClass}
            placeholder="4-6 أرقام — اختياري"
          />
          <p className="text-xs text-slate-muted/40 mt-1">
            استخدمه لتسمح لصاحب المنيو بتعديل الأصناف من صفحة المنيو مباشرة. اتركه فارغاً لتعطيل هذه الميزة.
          </p>
        </div>

        {/* Menu Builder */}
        <div>
          <label className="block text-sm text-slate-muted mb-1.5">أصناف المنيو</label>
          <MenuBuilder
            categories={categories}
            items={items}
            onCategoriesChange={setCategories}
            onItemsChange={setItems}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={saving || !name.trim() || !slug.trim()}
            className="flex-1 py-3 rounded-lg bg-neon-green text-matte-dark font-bold hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {saving ? "جاري الحفظ..." : "حفظ المنيو"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-lg bg-dark-card border border-white/10 text-slate-muted hover:text-slate-light transition-colors duration-200"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
