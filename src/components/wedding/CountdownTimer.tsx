"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface CountdownTimerProps {
  targetDate: string;
  targetTime: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function CountdownTimer({ targetDate, targetTime }: CountdownTimerProps) {
  const t = useTranslations("wedding");
  const target = new Date(`${targetDate}T${targetTime || "00:00"}`);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft(target));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calcTimeLeft(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  const isOver = target.getTime() <= Date.now();

  if (isOver) {
    return (
      <div className="text-center py-6">
        <p className="text-xl text-gold font-bold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
          🎉 The wedding has begun! 🎉
        </p>
      </div>
    );
  }

  const items = [
    { value: timeLeft.days, label: t("days") },
    { value: timeLeft.hours, label: t("hours") },
    { value: timeLeft.minutes, label: t("minutes") },
    { value: timeLeft.seconds, label: t("seconds") },
  ];

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/5 backdrop-blur-md border border-gold/30 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <span className="text-2xl sm:text-3xl font-bold text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
              {String(item.value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-xs text-slate-muted mt-2 uppercase tracking-wider">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
