"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Plus, Trash2, ImageIcon } from "lucide-react";
import { compressImage } from "@/lib/compressImage";
import type { GalleryPhoto } from "@/lib/surprise-schema";

export default function SurpriseCreatePage() {
  const [saving, setSaving] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const [title, setTitle] = useState("مفاجأة خاصة 💖");
  const [message, setMessage] = useState("عملتلك حاجة كدة كريتيف خصيصاً ليك! هل تقبل تكون معايا للأبد؟");
  const [password, setPassword] = useState("love");
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [caption, setCaption] = useState("بحبك 💖");
  const [startDate, setStartDate] = useState("");
  const [startDateLabel, setStartDateLabel] = useState("من يوم ما اتقابلنا");
  const [confessionDate, setConfessionDate] = useState("");
  const [confessionLabel, setConfessionLabel] = useState("يوم ما قولتلك بحبك");
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [newPhotoCaptions, setNewPhotoCaptions] = useState<string[]>([]);
  const [finalLetter, setFinalLetter] = useState("");

  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const musicRef = useRef<HTMLInputElement>(null);

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-400/60 focus:bg-white/15 transition-all duration-300 text-base backdrop-blur-sm";
  const labelClass = "block text-sm text-white/70 mb-1.5 font-medium";
  const sectionClass = "backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3";

  const uploadFile = async (file: File): Promise<string> => {
    const compressed = await compressImage(file);
    const fd = new FormData();
    fd.append("file", compressed);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
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
    setCoverPreview(URL.createObjectURL(file));
  }, []);

  const handleGalleryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 10 - photos.length - photoFiles.length;
    const toAdd = files.slice(0, remaining);
    setPhotoFiles((prev) => [...prev, ...toAdd]);
    setNewPhotoCaptions((prev) => [...prev, ...toAdd.map(() => "")]);
  }, [photos.length, photoFiles.length]);

  const updatePhotoCaption = useCallback((index: number, value: string) => {
    setPhotos((prev) => prev.map((p, i) => i === index ? { ...p, caption: value } : p));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim() || !password.trim()) return;
    setSaving(true);

    try {
      let coverUrl = "";
      if (coverPhotoFile) coverUrl = await uploadFile(coverPhotoFile);

      let finalMusicUrl = musicUrl.trim();
      if (musicFile) finalMusicUrl = await uploadAudio(musicFile);

      const uploadedPhotos: GalleryPhoto[] = [...photos];
      for (let i = 0; i < photoFiles.length; i++) {
        const url = await uploadFile(photoFiles[i]);
        uploadedPhotos.push({ url, caption: newPhotoCaptions[i] || "" });
      }

      const res = await fetch("/api/surprises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          password: password.trim(),
          senderName: senderName.trim(),
          recipientName: recipientName.trim(),
          musicUrl: finalMusicUrl,
          coverPhoto: coverUrl,
          caption: caption.trim(),
          startDate,
          startDateLabel: startDateLabel.trim(),
          confessionDate,
          confessionLabel: confessionLabel.trim(),
          photos: uploadedPhotos,
          finalLetter: finalLetter.trim(),
          active: true,
          createdVia: "link",
        }),
      });
      const data = await res.json();
      setCreatedId(data.id);
    } catch (error) {
      console.error("Create surprise error:", error);
      alert("حدث خطأ، حاول تاني");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = useCallback(() => {
    if (!createdId) return;
    const url = `${window.location.origin}/ar/surprise/${createdId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }).catch(() => prompt("انسخ اللينك:", url));
  }, [createdId]);

  if (createdId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-pink-950 to-rose-950 flex items-center justify-center p-4 relative overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div key={i} className="absolute text-pink-400/20 pointer-events-none" initial={{ x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000), y: typeof window !== "undefined" ? window.innerHeight + 50 : 900, scale: 0.5 + Math.random() }} animate={{ y: -100 }} transition={{ duration: 8 + Math.random() * 7, repeat: Infinity, delay: Math.random() * 5 }}>❤️</motion.div>
        ))}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="w-full max-w-lg relative z-10 text-center">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-6xl mb-6">🎉</motion.div>
            <h2 className="text-2xl font-bold text-white mb-3">المفاجأة جاهزة!</h2>
            <p className="text-white/60 mb-6">ابعت اللينك ده للشخص اللي عايز تبعتله المفاجأة</p>
            <div className="bg-black/30 rounded-xl p-4 mb-6 border border-white/10">
              <p className="text-pink-300 text-sm break-all font-mono">{typeof window !== "undefined" ? window.location.origin : ""}/ar/surprise/{createdId}</p>
            </div>
            <button onClick={handleCopyLink} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/25">
              {copiedLink ? <><Check className="w-5 h-5" /> تم النسخ!</> : <><Copy className="w-5 h-5" /> نسخ اللينك 📋</>}
            </button>
            <button onClick={() => { setCreatedId(null); setCopiedLink(false); }} className="mt-4 text-white/50 hover:text-white/80 text-sm transition-colors">عمل مفاجأة تانية +</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-pink-950 to-rose-950 flex items-center justify-center p-4 relative overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div key={i} className="absolute text-pink-400/20 pointer-events-none" initial={{ x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000), y: typeof window !== "undefined" ? window.innerHeight + 50 : 900, scale: 0.5 + Math.random() }} animate={{ y: -100 }} transition={{ duration: 8 + Math.random() * 7, repeat: Infinity, delay: Math.random() * 5 }}>❤️</motion.div>
      ))}

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg relative z-10">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-5xl mb-4">🎁</motion.div>
            <h1 className="text-2xl font-bold text-white">اعمل مفاجأتك بنفسك</h1>
            <p className="text-white/60 text-sm mt-2">املأ البيانات وهديك لينك تبعته للي تحبه</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic */}
            <div className={sectionClass}>
              <div>
                <label className={labelClass}>العنوان</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>الرسالة التمهيدية</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className={inputClass + " resize-none"} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>كلمة السر 🔑</label>
                  <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>موسيقى 🎵</label>
                  <input ref={musicRef} type="file" accept="audio/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setMusicFile(f); setMusicUrl(""); } }} />
                  {musicFile ? (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-xs text-white/60 flex-1 truncate">🎵 {musicFile.name}</span>
                      <button type="button" onClick={() => { setMusicFile(null); musicRef.current?.click(); }} className="text-xs text-pink-300 hover:text-pink-200">تغيير</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => musicRef.current?.click()} className="w-full py-3 rounded-xl border border-dashed border-white/10 text-white/40 text-xs hover:border-pink-400/40 hover:text-pink-300 transition-all">
                      اضغط لرفع ملف MP3
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>انت مين؟</label>
                  <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="اسمك" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>للمين؟</label>
                  <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="اسم الشخص" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Cover Photo */}
            <div className={sectionClass}>
              <h3 className="text-sm font-semibold text-pink-300">صورة الغلاف 📸</h3>
              <input ref={coverRef} type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
              {coverPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-white/10">
                  <img src={coverPreview} alt="cover" className="w-full h-40 object-cover" />
                  <button type="button" onClick={() => { setCoverPhotoFile(null); setCoverPreview(""); }} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white/70 hover:text-white"><Trash2 className="w-4 h-4" /></button>
                </div>
              ) : (
                <button type="button" onClick={() => coverRef.current?.click()} className="w-full h-24 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center gap-2 text-white/40 hover:border-pink-400/40 hover:text-pink-300 transition-all">
                  <ImageIcon className="w-6 h-6" /> <span className="text-sm">اضغط لرفع صورة</span>
                </button>
              )}
              <div>
                <label className={labelClass}>النص تحت الصورة</label>
                <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="بحبك 💖" className={inputClass} />
              </div>
            </div>

            {/* Dates */}
            <div className={sectionClass}>
              <h3 className="text-sm font-semibold text-pink-300">العدادات ⏱️ (اختياري)</h3>
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

            {/* Gallery */}
            <div className={sectionClass}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-pink-300">معرض الصور 🖼️ ({photos.length + photoFiles.length}/10)</h3>
                <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handleGalleryChange} className="hidden" />
                <button type="button" onClick={() => galleryRef.current?.click()} disabled={photos.length + photoFiles.length >= 10} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pink-500/10 text-pink-300 text-xs font-medium hover:bg-pink-500/20 transition-all disabled:opacity-40">
                  <Plus className="w-3 h-3" /> إضافة
                </button>
              </div>
              <div className="space-y-2">
                {photos.map((p, i) => (
                  <div key={`e-${i}`} className="flex items-center gap-2">
                    <img src={p.url} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <input type="text" value={p.caption} onChange={(e) => updatePhotoCaption(i, e.target.value)} placeholder="Caption..." className={inputClass + " flex-1 text-sm py-2"} />
                    <button type="button" onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))} className="text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                {photoFiles.map((f, i) => (
                  <div key={`f-${i}`} className="flex items-start gap-2">
                    <img src={URL.createObjectURL(f)} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <input type="text" value={newPhotoCaptions[i] || ""} onChange={(e) => setNewPhotoCaptions((prev) => prev.map((c, j) => j === i ? e.target.value : c))} placeholder="Caption..." className={inputClass + " flex-1 text-sm py-2"} />
                    <button type="button" onClick={() => { setPhotoFiles((prev) => prev.filter((_, j) => j !== i)); setNewPhotoCaptions((prev) => prev.filter((_, j) => j !== i)); }} className="text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Letter */}
            <div className={sectionClass}>
              <h3 className="text-sm font-semibold text-pink-300">الرسالة الختامية ✉️ (اختياري)</h3>
              <textarea value={finalLetter} onChange={(e) => setFinalLetter(e.target.value)} placeholder="اكتب رسالتك الطويلة هنا..." rows={5} className={inputClass + " resize-none"} />
            </div>

            <button type="submit" disabled={saving || !title.trim() || !message.trim() || !password.trim()} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2">
              {saving ? "جاري الإنشاء..." : <>✨ اعمل المفاجأة</>}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
