"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface CountdownTimerProps {
  targetDate: string;
  targetTime: string;
  accentHex?: string;
  dark?: boolean;
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

export default function CountdownTimer({ targetDate, targetTime, accentHex = "#D4AF37", dark = false }: CountdownTimerProps) {
  const t = useTranslations("wedding");
  const targetStr = targetDate ? `${targetDate}T${targetTime || "00:00"}` : "";
  const target = targetStr ? new Date(targetStr) : null;
  const isValid = target && !isNaN(target.getTime());
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(isValid ? calcTimeLeft(target) : { days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!isValid) return;
    const interval = setInterval(() => {
      setTimeLeft(calcTimeLeft(target!));
    }, 1000);
    return () => clearInterval(interval);
  }, [target, isValid]);

  if (!isValid) {
    return (
      <div className="text-center py-6">
        <p style={{ color: accentHex }} className="text-xl font-bold opacity-60">
          {t("countdown")}
        </p>
      </div>
    );
  }

  const isOver = target.getTime() <= Date.now();

  if (isOver) {
    return (
      <div className="text-center py-6">
        <p className="text-xl font-bold" style={{ color: accentHex }}>
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
    <div className="flex items-center justify-center gap-3 sm:gap-8 flex-wrap" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      {items.map((item, i) => (
        <div key={item.label} className="flex flex-col items-center gap-2 min-w-[70px]">
          <span className="text-4xl sm:text-6xl md:text-7xl font-light leading-none" style={{ color: accentHex }}>
            {String(item.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] tracking-[4px] uppercase font-light" style={{ color: dark ? `${accentHex}99` : `${accentHex}99` }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
