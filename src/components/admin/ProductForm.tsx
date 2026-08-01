"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { X, Upload, ImageIcon } from "lucide-react";
import type { Product } from "@/lib/product-schema";
import { compressImage } from "@/lib/compressImage";
import { useToast } from "@/components/ui/ToastProvider";

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const t = useTranslations("admin");
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [category, setCategory] = useState(product?.category || "");
  const [description, setDescription] = useState(product?.description || "");
  const [type, setType] = useState<"nfc" | "regular">(product?.type || "nfc");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(product?.images || []);
  const fileRef = useRef<HTMLInputElement>(null);

  const inputClass = "w-full px-4 py-2.5 rounded-lg glass bg-dark-card border border-white/10 text-sm text-slate-light placeholder:text-slate-muted/40 focus:outline-none focus:border-gold/50 transition-all duration-200";
  const labelClass = "block text-sm text-slate-muted mb-1.5";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim()) return;
    setSaving(true);

    try {
      let allImages = [...existingImages];
      for (const file of imageFiles) {
        const compressed = await compressImage(file);
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
        allImages.push(data.url);
      }

      const data = {
        name: name.trim(),
        price: Number(price),
        category: category.trim(),
        description: description.trim(),
        type,
        images: allImages,
      };

      if (product?.id) {
        await fetch(`/api/products/${product.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Product save error:", error);
      showToast(t("errorOccurred"), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass bg-matte-card/90 border border-white/10 rounded-2xl p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-light">
          {product ? t("editProduct") : t("addProduct")}
        </h2>
        <button onClick={onCancel} className="text-slate-muted hover:text-slate-light transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass}>{t("form.productName")}</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder={t("form.productName")} required />
        </div>

        <div>
          <label className={labelClass}>{t("form.price")}</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} placeholder="200" required />
        </div>

        <div>
          <label className={labelClass}>{t("form.productType")}</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("nfc")}
              className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                type === "nfc"
                  ? "bg-gold/20 text-gold border-gold/50 shadow-[0_0_15px_rgba(198,165,104,0.15)]"
                  : "bg-white/5 text-slate-muted border-white/10 hover:bg-white/10"
              }`}
            >
              NFC
            </button>
            <button
              type="button"
              onClick={() => setType("regular")}
              className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                type === "regular"
                  ? "bg-gold/20 text-gold border-gold/50 shadow-[0_0_15px_rgba(198,165,104,0.15)]"
                  : "bg-white/5 text-slate-muted border-white/10 hover:bg-white/10"
              }`}
            >
              {t("form.regularType")}
            </button>
          </div>
        </div>

        <div>
          <label className={labelClass}>{t("form.category")}</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} placeholder={t("form.category")} />
        </div>

        <div>
          <label className={labelClass}>{t("form.description")}</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} rows={3} placeholder={t("form.description")} />
        </div>

        <div>
          <label className={labelClass}>{t("form.images")}</label>
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {existingImages.map((url, i) => (
                <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                  <img src={url} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setExistingImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <label onClick={(e) => e.stopPropagation()} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-white/20 bg-dark-card/50 cursor-pointer hover:border-gold/50 transition-colors duration-200">
            <Upload className="w-5 h-5 text-slate-muted" />
            <span className="text-sm text-slate-muted">
              {imageFiles.length > 0 ? `${imageFiles.length} files` : "PNG, JPG, WebP"}
            </span>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setImageFiles((prev) => [...prev, ...files]);
                e.target.value = "";
              }} />
          </label>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button type="submit" disabled={saving || !name.trim() || !price.trim()}
            className="flex-1 py-3 rounded-lg bg-gold text-matte-dark font-bold hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
            {saving ? t("form.saving") : t("form.save")}
          </button>
          <button type="button" onClick={onCancel}
            className="px-6 py-3 rounded-lg bg-dark-card border border-white/10 text-slate-muted hover:text-slate-light transition-colors duration-200">
            {t("form.cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}
