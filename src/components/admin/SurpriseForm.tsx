"use client";

import { useState, useCallback, useRef } from "react";
import { X, Copy, Check, Plus, Trash2, Upload, ImageIcon } from "lucide-react";
import type { Surprise, GalleryPhoto } from "@/lib/surprise-schema";
import { compressImage } from "@/lib/compressImage";

interface SurpriseFormProps {
  surprise?: Surprise | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SurpriseForm({ surprise, onSuccess, onCancel }: SurpriseFormProps) {
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(surprise?.title || "مفاجأة خاصة 💖");
  const [message, setMessage] = useState(surprise?.message || "عملتلك حاجة كدة كريتيف خصيصاً ليك! هل تقبل تكون معايا للأبد؟");
  const [password, setPassword] = useState(surprise?.password || "love");
  const [senderName, setSenderName] = useState(surprise?.senderName || "");
  const [recipientName, setRecipientName] = useState(surprise?.recipientName || "");
  const [musicUrl, setMusicUrl] = useState(surprise?.musicUrl || "");
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState(surprise?.coverPhoto || "");
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(surprise?.coverPhoto || "");
  const [caption, setCaption] = useState(surprise?.caption || "بحبك 💖");
  const [startDate, setStartDate] = useState(surprise?.startDate || "");
  const [startDateLabel, setStartDateLabel] = useState(surprise?.startDateLabel || "من يوم ما اتقابلنا");
  const [confessionDate, setConfessionDate] = useState(surprise?.confessionDate || "");
  const [confessionLabel, setConfessionLabel] = useState(surprise?.confessionLabel || "يوم ما قولتلك بحبك");
  const [photos, setPhotos] = useState<GalleryPhoto[]>(surprise?.photos || []);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [newPhotoCaptions, setNewPhotoCaptions] = useState<string[]>([]);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [finalLetter, setFinalLetter] = useState(surprise?.finalLetter || "");
  const [copiedLink, setCopiedLink] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const musicRef = useRef<HTMLInputElement>(null);

  const inputClass = "w-full px-4 py-2.5 rounded-lg glass bg-dark-card border border-white/10 text-sm text-slate-light placeholder:text-slate-muted/40 focus:outline-none focus:border-gold/50 transition-all duration-200";
  const labelClass = "block text-sm text-slate-muted mb-1.5";
  const sectionClass = "glass bg-white/5 border border-white/10 rounded-xl p-4 space-y-3";

  const uploadFile = async (file: File): Promise<string> => {
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
    if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
    return data.url;
  };

  const uploadAudio = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok || !data.url) throw new Error(data.error || "Audio upload failed");
    return data.url;
  };

  const handleCoverChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverPhotoFile(file);
    setCoverPhotoPreview(URL.createObjectURL(file));
  }, []);

  const handleGalleryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 10 - photos.length - photoFiles.length;
    const toAdd = files.slice(0, remaining);
    setPhotoFiles((prev) => [...prev, ...toAdd]);
    setNewPhotoCaptions((prev) => [...prev, ...toAdd.map(() => "")]);
  }, [photos.length, photoFiles.length]);

  const removeGalleryPhoto = useCallback((index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const removeGalleryFile = useCallback((index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPhotoCaptions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updatePhotoCaption = useCallback((index: number, value: string) => {
    setPhotos((prev) => prev.map((p, i) => i === index ? { ...p, caption: value } : p));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim() || !password.trim()) return;
    setSaving(true);

    try {
      let finalCoverPhoto = coverPhoto;
      if (coverPhotoFile) {
        finalCoverPhoto = await uploadFile(coverPhotoFile);
      }

      let finalMusicUrl = musicUrl.trim();
      if (musicFile) {
        finalMusicUrl = await uploadAudio(musicFile);
      }

      const uploadedPhotos: GalleryPhoto[] = [...photos];
      for (let i = 0; i < photoFiles.length; i++) {
        const url = await uploadFile(photoFiles[i]);
        uploadedPhotos.push({ url, caption: newPhotoCaptions[i] || "" });
      }

      const payload = {
        title: title.trim(),
        message: message.trim(),
        password: password.trim(),
        senderName: senderName.trim(),
        recipientName: recipientName.trim(),
        musicUrl: finalMusicUrl,
        coverPhoto: finalCoverPhoto,
        caption: caption.trim(),
        startDate: startDate || "",
        startDateLabel: startDateLabel.trim(),
        confessionDate: confessionDate || "",
        confessionLabel: confessionLabel.trim(),
        photos: uploadedPhotos,
        finalLetter: finalLetter.trim(),
        active: true,
      };

      if (surprise?.id) {
        await fetch(`/api/surprises/${surprise.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        const res = await fetch("/api/surprises", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        setCreatedId(data.id);
      }
      onSuccess();
    } catch (error) {
      console.error("Save surprise error:", error);
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = useCallback(() => {
    const id = createdId || surprise?.id;
    if (!id) return;
    const url = `${window.location.origin}/ar/surprise/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }).catch(() => {
      prompt("انسخ اللينك:", url);
    });
  }, [createdId, surprise?.id]);

  return (
    <div className="glass bg-matte-card/95 border border-white/10 rounded-2xl p-6 relative max-h-[85vh] overflow-y-auto">
      <button
        onClick={onCancel}
        className="sticky top-0 left-full ml-2 p-2 rounded-lg bg-white/5 text-slate-muted hover:text-white hover:bg-white/10 transition-all z-10"
      >
        <X className="w-4 h-4" />
      </button>

      <h2 className="text-xl font-bold text-slate-light mb-6">
        {surprise?.id ? "تعديل المفاجأة" : "إنشاء مفاجأة جديدة"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className={sectionClass}>
          <h3 className="text-sm font-semibold text-gold mb-2">المعلومات الأساسية</h3>
          <div>
            <label className={labelClass}>العنوان</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مفاجأة خاصة 💖" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>الرسالة التمهيدية (اللي هتظهر بالـ Typing Effect)</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="اكتب الرسالة التمهيدية هنا..." rows={3} className={inputClass + " resize-none"} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>كلمة السر 🔑</label>
              <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="love" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>الموسيقى 🎵</label>
              <input ref={musicRef} type="file" accept="audio/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setMusicFile(f); setMusicUrl(""); } }} />
              {musicFile ? (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-muted flex-1 truncate">🎵 {musicFile.name}</span>
                  <button type="button" onClick={() => { setMusicFile(null); musicRef.current?.click(); }} className="text-xs text-pink-400 hover:text-pink-300">تغيير</button>
                </div>
              ) : musicUrl ? (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-muted flex-1 truncate">🎵 مرفوع</span>
                  <button type="button" onClick={() => { setMusicUrl(""); }} className="text-xs text-red-400 hover:text-red-300">حذف</button>
                </div>
              ) : (
                <button type="button" onClick={() => musicRef.current?.click()} className="w-full py-2.5 rounded-lg border border-dashed border-white/10 text-slate-muted text-xs hover:border-pink-400/40 hover:text-pink-400 transition-all">
                  اضغط لرفع ملف MP3
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>اسم المبادر</label>
              <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="أحمد" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>اسم الشخص</label>
              <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="سارة" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Cover Photo */}
        <div className={sectionClass}>
          <h3 className="text-sm font-semibold text-gold mb-2">صورة الغلاف 📸</h3>
          <div>
            <label className={labelClass}>الصورة الكبيرة اللي هتظهر في الخطوة 3</label>
            <input ref={coverRef} type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
            {coverPhotoPreview ? (
              <div className="relative rounded-lg overflow-hidden border border-white/10">
                <img src={coverPhotoPreview} alt="cover" className="w-full h-48 object-cover" />
                <button type="button" onClick={() => { setCoverPhoto(""); setCoverPhotoFile(null); setCoverPhotoPreview(""); coverRef.current?.click(); }} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white/70 hover:text-white">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => coverRef.current?.click()} className="w-full h-32 rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-slate-muted hover:border-gold/40 hover:text-gold transition-all">
                <ImageIcon className="w-8 h-8" />
                <span className="text-sm">اضغط لرفع صورة الغلاف</span>
              </button>
            )}
          </div>
          <div>
            <label className={labelClass}>النص تحت الصورة</label>
            <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="بحبك 💖" className={inputClass} />
          </div>
        </div>

        {/* Date Counters */}
        <div className={sectionClass}>
          <h3 className="text-sm font-semibold text-gold mb-2">العدادات ⏱️</h3>
          <div>
            <label className={labelClass}>تسمية العداد الأول</label>
            <input type="text" value={startDateLabel} onChange={(e) => setStartDateLabel(e.target.value)} placeholder="من يوم ما اتقابلنا" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>تاريخ البداية</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>تسمية العداد التاني</label>
            <input type="text" value={confessionLabel} onChange={(e) => setConfessionLabel(e.target.value)} placeholder="يوم ما قولتلك بحبك" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>تاريخ الاعتراف</label>
            <input type="date" value={confessionDate} onChange={(e) => setConfessionDate(e.target.value)} className={inputClass} />
          </div>
        </div>

        {/* Photo Gallery */}
        <div className={sectionClass}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gold mb-2">معرض الصور 🖼️ ({photos.length + photoFiles.length}/10)</h3>
            <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handleGalleryChange} className="hidden" />
            <button type="button" onClick={() => galleryRef.current?.click()} disabled={photos.length + photoFiles.length >= 10} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-all disabled:opacity-40">
              <Plus className="w-3 h-3" /> إضافة صور
            </button>
          </div>

          {photos.length === 0 && photoFiles.length === 0 && (
            <p className="text-xs text-slate-muted/60">اضغط "إضافة صور" لرفع صور المعرض (حد أقصى 10)</p>
          )}

          <div className="space-y-3">
            {photos.map((photo, i) => (
              <div key={`existing-${i}`} className="flex items-start gap-3 p-2 rounded-lg bg-white/5 border border-white/5">
                <img src={photo.url} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                <input type="text" value={photo.caption} onChange={(e) => updatePhotoCaption(i, e.target.value)} placeholder="Caption..." className={inputClass + " flex-1"} />
                <button type="button" onClick={() => removeGalleryPhoto(i)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}

            {photoFiles.map((file, i) => (
              <div key={`new-${i}`} className="flex items-start gap-3 p-2 rounded-lg bg-white/5 border border-white/5">
                <img src={URL.createObjectURL(file)} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                <input type="text" value={newPhotoCaptions[i] || ""} onChange={(e) => setNewPhotoCaptions((prev) => prev.map((c, j) => j === i ? e.target.value : c))} placeholder="Caption..." className={inputClass + " flex-1"} />
                <button type="button" onClick={() => removeGalleryFile(i)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Final Letter */}
        <div className={sectionClass}>
          <h3 className="text-sm font-semibold text-gold mb-2">الرسالة الختامية ✉️</h3>
          <textarea value={finalLetter} onChange={(e) => setFinalLetter(e.target.value)} placeholder="اكتب رسالتك الطويلة هنا... الرسالة اللي هتظهر في آخر شاشة" rows={6} className={inputClass + " resize-none"} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving || !title.trim() || !message.trim() || !password.trim()} className="flex-1 py-3 rounded-lg bg-gold text-matte-dark font-bold hover:bg-gold-light transition-colors duration-200 disabled:opacity-50">
            {saving ? "جاري الحفظ..." : surprise?.id ? "حفظ التعديلات" : "إنشاء المفاجأة ✨"}
          </button>
          <button type="button" onClick={onCancel} className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-slate-muted hover:text-white transition-all">
            إلغاء
          </button>
        </div>

        {(createdId || surprise?.id) && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <button type="button" onClick={handleCopyLink} className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-medium">
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedLink ? "تم النسخ!" : "نسخ لينك المفاجأة"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
