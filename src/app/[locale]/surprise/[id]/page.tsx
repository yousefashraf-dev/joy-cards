"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface SurpriseData {
  title: string;
  message: string;
  password: string;
  senderName: string;
  recipientName: string;
  musicUrl: string;
  coverPhoto: string;
  caption: string;
  startDate: string;
  startDateLabel: string;
  confessionDate: string;
  confessionLabel: string;
  photos: Array<{ url: string; caption: string }>;
  finalLetter: string;
}

function formatDateAr(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function useLiveTimer(targetDate: string) {
  const [elapsed, setElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    if (!targetDate) return;
    const tick = () => {
      const diff = Date.now() - new Date(targetDate).getTime();
      if (diff < 0) { setElapsed({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      const s = Math.floor(diff / 1000);
      setElapsed({ days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return elapsed;
}

function TypingEffect({ text, onDone }: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const callbackRef = useRef(onDone);
  callbackRef.current = onDone;

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); callbackRef.current?.(); }
    }, 35);
    return () => clearInterval(id);
  }, [text]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && <span className="animate-pulse text-pink-300">|</span>}
    </span>
  );
}

function TimerBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.span key={value} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.25 }}
        className="text-3xl sm:text-4xl font-black bg-gradient-to-b from-white via-pink-100 to-pink-300 bg-clip-text text-transparent drop-shadow-lg tabular-nums">
        {String(value).padStart(2, "0")}
      </motion.span>
      <span className="text-[10px] sm:text-xs text-white/40 mt-1.5 uppercase tracking-widest font-medium">{label}</span>
    </div>
  );
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`min-h-[100dvh] min-h-[100svh] w-full flex flex-col items-center justify-center p-5 snap-start snap-always overflow-hidden ${className}`}>
      {children}
    </section>
  );
}

function GoldDivider() {
  return <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent my-4" />;
}

export default function SurprisePage() {
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  const [data, setData] = useState<SurpriseData | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const timer1 = useLiveTimer(data?.startDate || "");
  const timer2 = useLiveTimer(data?.confessionDate || "");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/surprises/${id}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  useEffect(() => {
    if (data?.musicUrl) {
      audioRef.current = new Audio(data.musicUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }
    return () => { audioRef.current?.pause(); audioRef.current = null; };
  }, [data?.musicUrl]);

  const handlePasswordSubmit = useCallback(() => {
    if (!data) return;
    if (password.trim().toLowerCase() === data.password.toLowerCase()) {
      setError("");
      audioRef.current?.play().catch(() => {});
      setUnlocked(true);
    } else {
      setError("كلمة السر خاطئة! 💔");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  }, [password, data]);

  const fireConfetti = useCallback(() => {
    const colors = ["#f43f5e", "#ec4899", "#d946ef", "#fbbf24", "#fb7185", "#fda4af"];
    const end = Date.now() + 4500;
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 50, origin: { x: 0, y: 0.7 }, colors, shapes: ["circle"], scalar: 1.1 });
      confetti({ particleCount: 4, angle: 120, spread: 50, origin: { x: 1, y: 0.7 }, colors, shapes: ["circle"], scalar: 1.1 });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    setTimeout(() => {
      confetti({ particleCount: 200, spread: 180, startVelocity: 35, origin: { y: 0.6, x: 0.5 }, colors, shapes: ["circle"], scalar: 1.4, gravity: 0.8 });
    }, 600);
  }, []);

  const handleShowLetter = useCallback(() => {
    setShowLetter(true);
    fireConfetti();
  }, [fireConfetti]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0a1e] via-[#2d0a2e] to-[#1a0a1e] flex items-center justify-center">
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} className="text-5xl drop-shadow-[0_0_30px_rgba(244,63,94,0.5)]">💖</motion.div>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0a1e] via-[#2d0a2e] to-[#1a0a1e] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">💔</div>
          <h1 className="text-2xl font-bold text-white mb-2">المفاجأة مش موجودة</h1>
          <p className="text-white/50">ممكن اللينك يكون غلط أو المفاجأة اتمسحت</p>
        </div>
      </div>
    );
  }

  /* ─── LOCK SCREEN ─── */
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0a1e] via-[#2d0a2e] to-[#1a0a1e] flex items-center justify-center p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.08)_0%,transparent_70%)]" />
        {[...Array(18)].map((_, i) => (
          <motion.div key={i} className="absolute pointer-events-none select-none" style={{ fontSize: `${10 + Math.random() * 16}px` }}
            initial={{ x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000), y: (typeof window !== "undefined" ? window.innerHeight : 900) + 50, opacity: 0.08 + Math.random() * 0.12 }}
            animate={{ y: -100 }} transition={{ duration: 10 + Math.random() * 8, repeat: Infinity, delay: Math.random() * 6, ease: "linear" }}>❤️</motion.div>
        ))}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="w-full max-w-sm relative z-10">
          <div className="backdrop-blur-2xl bg-white/[0.06] border border-white/[0.08] rounded-[2rem] p-8 sm:p-10 shadow-[0_0_60px_rgba(244,63,94,0.1)] text-center">
            <motion.div animate={{ rotateY: [0, 15, -15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl mb-6 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]">✉️</motion.div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">{data.title}</h1>
            <p className="text-white/40 text-sm mb-8 font-light">هناك مفاجأة خاصة بانتظارك</p>
            <div className="space-y-4">
              <motion.div animate={shake ? { x: [-12, 12, -12, 12, 0] } : {}} transition={{ duration: 0.4 }}>
                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                  placeholder="أدخل كلمة السر 🔑"
                  className="w-full px-5 py-4 rounded-2xl bg-white/[0.06] border border-white/[0.1] text-white text-center text-lg tracking-[0.3em] placeholder:text-white/20 placeholder:tracking-widest focus:outline-none focus:border-pink-400/40 focus:bg-white/[0.08] focus:shadow-[0_0_30px_rgba(244,63,94,0.15)] transition-all duration-500" autoFocus />
              </motion.div>
              {error && <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-rose-300/90 text-sm font-medium">{error}</motion.p>}
              <button onClick={handlePasswordSubmit}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white font-bold text-lg shadow-[0_0_40px_rgba(244,63,94,0.3)] hover:shadow-[0_0_50px_rgba(244,63,94,0.4)] active:scale-[0.97] transition-all duration-300">
                افتح المفاجأة ✨
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ─── UNLOCKED: FULL-SCREEN SNAP SECTIONS ─── */
  return (
    <div className="snap-y snap-mandatory overflow-y-auto h-[100dvh] h-[100svh] bg-gradient-to-br from-[#1a0a1e] via-[#2d0a2e] to-[#1a0a1e]" style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch", overscrollBehaviorY: "contain" }}>

      {/* Radial glow overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,63,94,0.06)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(217,70,239,0.05)_0%,transparent_60%)]" />
      </div>

      {/* Floating hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(10)].map((_, i) => (
          <motion.div key={i} className="absolute pointer-events-none select-none opacity-[0.06]" style={{ fontSize: `${10 + Math.random() * 12}px`, left: `${Math.random() * 100}%` }}
            initial={{ y: "110vh" }} animate={{ y: "-10vh" }}
            transition={{ duration: 14 + Math.random() * 8, repeat: Infinity, delay: Math.random() * 8, ease: "linear" }}>❤️</motion.div>
        ))}
      </div>

      {/* ── SECTION 1: INTRO MESSAGE ── */}
      <Section>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-md mx-auto backdrop-blur-2xl bg-white/[0.05] border border-white/[0.08] rounded-[2rem] p-8 sm:p-12 shadow-[0_0_80px_rgba(244,63,94,0.08)] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,63,94,0.06)_0%,transparent_50%)]" />
          <div className="relative">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-5xl mb-6 drop-shadow-[0_0_25px_rgba(244,63,94,0.4)]">💌</motion.div>
            {data.senderName && <p className="text-white/30 text-sm mb-4 font-light tracking-wide">رسالة من {data.senderName}{data.recipientName ? ` إلى ${data.recipientName}` : ""}</p>}
            <GoldDivider />
            <p className="text-white text-xl sm:text-2xl leading-[2.2] font-medium min-h-[100px] mt-4">
              <TypingEffect text={data.message} />
            </p>
          </div>
        </motion.div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="mt-8 text-white/20 text-xs tracking-widest font-light">اسحب لفوق ↓</motion.div>
      </Section>

      {/* ── SECTION 2: COVER PHOTO ── */}
      {(data.coverPhoto || data.caption) && (
        <Section>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeOut" }}
            className="w-full max-w-md mx-auto backdrop-blur-2xl bg-white/[0.05] border border-white/[0.08] rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(244,63,94,0.08)]">
            {data.coverPhoto ? (
              <img src={data.coverPhoto} alt="" className="w-full h-72 sm:h-96 object-cover" />
            ) : (
              <div className="w-full h-72 sm:h-96 bg-gradient-to-br from-rose-500/20 via-pink-500/10 to-fuchsia-500/20 flex items-center justify-center">
                <span className="text-7xl drop-shadow-[0_0_30px_rgba(244,63,94,0.4)]">💖</span>
              </div>
            )}
            {data.caption && (
              <div className="p-6 text-center bg-gradient-to-t from-white/[0.03] to-transparent">
                <GoldDivider />
                <p className="text-white text-xl sm:text-2xl font-bold tracking-tight">{data.caption}</p>
              </div>
            )}
          </motion.div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-8 text-white/20 text-xs tracking-widest font-light">اسحب لفوق ↓</motion.div>
        </Section>
      )}

      {/* ── SECTION 3: COUNTERS ── */}
      {(data.startDate || data.confessionDate) && (
        <Section>
          <div className="w-full max-w-md mx-auto backdrop-blur-2xl bg-white/[0.05] border border-white/[0.08] rounded-[2rem] p-8 sm:p-12 shadow-[0_0_80px_rgba(244,63,94,0.08)] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(217,70,239,0.05)_0%,transparent_50%)]" />
            <div className="relative space-y-10">
              {data.startDate && (
                <div className="text-center">
                  <p className="text-white/30 text-xs tracking-widest uppercase font-light mb-2">{data.startDateLabel || "من يوم ما اتقابلنا"}</p>
                  <p className="text-amber-300/60 text-[11px] tracking-wide mb-5 font-medium">{formatDateAr(data.startDate)}</p>
                  <div className="flex justify-center gap-3 sm:gap-5">
                    <TimerBlock value={timer1.days} label="يوم" />
                    <span className="text-white/15 text-2xl self-start mt-1">:</span>
                    <TimerBlock value={timer1.hours} label="ساعة" />
                    <span className="text-white/15 text-2xl self-start mt-1">:</span>
                    <TimerBlock value={timer1.minutes} label="دقيقة" />
                    <span className="text-white/15 text-2xl self-start mt-1">:</span>
                    <TimerBlock value={timer1.seconds} label="ثانية" />
                  </div>
                </div>
              )}
              {data.startDate && data.confessionDate && <GoldDivider />}
              {data.confessionDate && (
                <div className="text-center">
                  <p className="text-white/30 text-xs tracking-widest uppercase font-light mb-2">{data.confessionLabel || "يوم ما قولتلك بحبك"}</p>
                  <p className="text-amber-300/60 text-[11px] tracking-wide mb-5 font-medium">{formatDateAr(data.confessionDate)}</p>
                  <div className="flex justify-center gap-3 sm:gap-5">
                    <TimerBlock value={timer2.days} label="يوم" />
                    <span className="text-white/15 text-2xl self-start mt-1">:</span>
                    <TimerBlock value={timer2.hours} label="ساعة" />
                    <span className="text-white/15 text-2xl self-start mt-1">:</span>
                    <TimerBlock value={timer2.minutes} label="دقيقة" />
                    <span className="text-white/15 text-2xl self-start mt-1">:</span>
                    <TimerBlock value={timer2.seconds} label="ثانية" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-8 text-white/20 text-xs tracking-widest font-light">اسحب لفوق ↓</motion.div>
        </Section>
      )}

      {/* ── PHOTO GALLERY (each photo = full screen) ── */}
      {data.photos.length > 0 && data.photos.map((photo, i) => (
        <Section key={`photo-${i}`}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeOut" }}
            className="w-full max-w-md mx-auto backdrop-blur-2xl bg-white/[0.05] border border-white/[0.08] rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(244,63,94,0.08)]">
            <img src={photo.url} alt="" className="w-full h-80 sm:h-[28rem] object-cover" />
            {photo.caption && (
              <div className="px-5 py-4 text-center bg-gradient-to-t from-white/[0.03] to-transparent">
                <p className="text-white text-base sm:text-lg font-medium">{photo.caption}</p>
              </div>
            )}
          </motion.div>
          {i < data.photos.length - 1 && (
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="mt-8 text-white/20 text-xs tracking-widest font-light">اسحب لفوق ↓</motion.div>
          )}
        </Section>
      ))}

      {/* ── FINAL SECTION: SHOW MESSAGE ── */}
      <Section>
        {!showLetter ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-center">
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl mb-10 drop-shadow-[0_0_30px_rgba(244,63,94,0.5)]">💌</motion.div>
            <button onClick={handleShowLetter}
              className="px-12 py-5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white font-black text-xl tracking-wide shadow-[0_0_60px_rgba(244,63,94,0.35)] hover:shadow-[0_0_80px_rgba(244,63,94,0.45)] active:scale-[0.96] transition-all duration-300">
              ❤️ Show Message ❤️
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md mx-auto backdrop-blur-2xl bg-white/[0.05] border border-white/[0.08] rounded-[2rem] p-8 sm:p-12 shadow-[0_0_80px_rgba(244,63,94,0.08)] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,63,94,0.06)_0%,transparent_50%)]" />
            <div className="relative">
              <div className="text-center mb-6">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="text-4xl mb-3 drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]">💌</motion.div>
                {data.senderName && <p className="text-white/30 text-sm font-light tracking-wide">مع حب من {data.senderName}</p>}
              </div>
              <GoldDivider />
              {data.finalLetter ? (
                <div className="text-white/70 text-sm sm:text-base leading-[2] whitespace-pre-wrap max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar mt-4">
                  <TypingEffect text={data.finalLetter} />
                </div>
              ) : (
                <p className="text-white/30 text-center text-4xl py-10">❤️</p>
              )}
              <div className="flex justify-center mt-8">
                <button onClick={() => { const el = document.querySelector(".snap-y"); el?.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="px-6 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/40 hover:text-white/70 hover:bg-white/[0.1] transition-all text-sm tracking-wide">
                  🔄 Memories
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </Section>

      <style jsx global>{`
        html, body { overflow: hidden; height: 100dvh; height: 100svh; margin: 0; padding: 0; }
        .snap-y { scroll-behavior: smooth; scroll-snap-type: y mandatory; -webkit-overflow-scrolling: touch; }
        .snap-y::-webkit-scrollbar { display: none; }
        .snap-y { -ms-overflow-style: none; scrollbar-width: none; overscroll-behavior-y: contain; }
        .snap-always { scroll-snap-align: start; scroll-snap-stop: always; }
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(244,63,94,0.2); border-radius: 4px; }
      `}</style>
    </div>
  );
}
