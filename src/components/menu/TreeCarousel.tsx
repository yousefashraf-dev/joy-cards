"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getGroupIcon } from "./LineArtIcons";
import type { MenuGroup } from "@/lib/menu-groups";

const GOLD = "#E5C158";
const GREEN = "#4CAF50";

const CAROUSEL_ORDER: Record<string, number> = {
  SUSHI: 1,
  SALAD: 2,
  SOUP: 3,
  "TREE APPETIZER": 4,
  PIZZA: 5,
  PASTA: 6,
  BURGER: 7,
  "BEEF MEAL": 8,
  "CHICKEN MEAL": 9,
  FAJITA: 10,
  "FRIED CHICKEN": 11,
  QUESADILLA: 12,
  "COLD DRINKS": 13,
  "HOT DRINKS": 14,
  DESSERTS: 15,
};

interface TreeCarouselProps {
  groups: MenuGroup[];
  onGroupChange: (groupEn: string) => void;
}

export default function TreeCarousel({ groups, onGroupChange }: TreeCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  const sorted = useMemo(
    () =>
      [...groups].sort(
        (a, b) => (CAROUSEL_ORDER[a.labelEn] || 99) - (CAROUSEL_ORDER[b.labelEn] || 99)
      ),
    [groups]
  );

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => Math.min(sorted.length - 1, prev + 1));
  }, [sorted.length]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = false;
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (Math.abs(e.clientX - dragStartX.current) > 10) {
      isDragging.current = true;
    }
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging.current) {
        const diff = e.clientX - dragStartX.current;
        if (diff < -40) goNext();
        else if (diff > 40) goPrev();
      }
      isDragging.current = false;
    },
    [goNext, goPrev]
  );

  if (sorted.length === 0) return null;

  return (
    <div className="relative w-full select-none" style={{ height: "360px" }}>
      <div
        className="absolute inset-0 flex items-center justify-center"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ perspective: "1200px" }}
      >
        {sorted.map((group, i) => {
          const offset = i - activeIndex;
          const isActive = offset === 0;
          const absOffset = Math.abs(offset);

          const scale = isActive ? 1.15 : Math.max(0.55, 1 - absOffset * 0.22);
          const opacity = isActive ? 1 : Math.max(0.15, 1 - absOffset * 0.4);
          const rotateY = offset * -14;
          const translateX = offset * 145;
          const zIndex = sorted.length - absOffset;

          return (
            <motion.div
              key={group.labelEn}
              animate={{
                x: translateX,
                scale,
                opacity,
                rotateY,
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 30,
                mass: 0.9,
              }}
              onClick={() => {
                if (isDragging.current) return;
                if (isActive) {
                  onGroupChange(group.labelEn);
                } else {
                  setActiveIndex(i);
                }
              }}
              style={{
                position: "absolute",
                cursor: "pointer",
                zIndex,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              <div
                className="flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm transition-all duration-300"
                style={{
                  width: "186px",
                  height: "250px",
                  background: isActive
                    ? "linear-gradient(145deg, rgba(42,24,18,0.9), rgba(30,17,11,0.95))"
                    : "linear-gradient(145deg, rgba(42,24,18,0.6), rgba(30,17,11,0.7))",
                  border: isActive
                    ? "1px solid rgba(229,193,88,0.25)"
                    : "1px solid rgba(229,193,88,0.06)",
                  boxShadow: isActive
                    ? "0 8px 32px rgba(229,193,88,0.08), 0 0 60px rgba(229,193,88,0.04)"
                    : "none",
                }}
              >
                <div
                  className="w-[80px] h-[80px] flex items-center justify-center transition-all duration-300"
                  style={{
                    color: isActive ? GOLD : "rgba(226,232,240,0.25)",
                    filter: isActive
                      ? "drop-shadow(0 0 20px rgba(229,193,88,0.3))"
                      : "none",
                  }}
                >
                  {getGroupIcon(group.labelEn, "w-full h-full")}
                </div>
                <div className="text-center mt-5 px-3">
                  <p
                    className="text-sm font-black tracking-[0.15em] uppercase"
                    style={{ color: isActive ? GOLD : "rgba(226,232,240,0.25)" }}
                  >
                    {group.labelEn}
                  </p>
                  <p
                    className="text-[11px] mt-1.5 leading-tight line-clamp-1"
                    style={{
                      color: isActive ? "rgba(226,232,240,0.6)" : "rgba(226,232,240,0.2)",
                      fontFamily: "var(--font-cairo), sans-serif",
                    }}
                  >
                    {group.label}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation arrows */}
      {activeIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-50 w-9 h-9 rounded-full flex items-center justify-center transition-all backdrop-blur-sm hover:-translate-y-1/2 hover:scale-105"
          style={{
            background: "rgba(229,193,88,0.08)",
            border: "1px solid rgba(229,193,88,0.15)",
            color: GOLD,
          }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {activeIndex < sorted.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-50 w-9 h-9 rounded-full flex items-center justify-center transition-all backdrop-blur-sm hover:-translate-y-1/2 hover:scale-105"
          style={{
            background: "rgba(229,193,88,0.08)",
            border: "1px solid rgba(229,193,88,0.15)",
            color: GOLD,
          }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Indicator dots */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {sorted.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === activeIndex ? 20 : 6,
              height: 6,
              backgroundColor: i === activeIndex ? GOLD : "rgba(229,193,88,0.12)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
