"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getGroupIcon } from "./LineArtIcons";

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

export interface CarouselGroup {
  labelEn: string;
  label: string;
  icon?: React.ReactNode;
}

interface TreeCarouselProps {
  groups: CarouselGroup[];
  onGroupChange: (groupEn: string) => void;
  onEdgeSwipe?: (dir: 1 | -1) => void;
  accent?: string;
  cardBg?: string;
  textMuted?: string;
}

const DEFAULT_ACCENT = "#E5C158";
const DEFAULT_CARD_BG =
  "linear-gradient(145deg, rgba(42,24,18,0.92), rgba(30,17,11,0.95))";
const DEFAULT_MUTED = "rgba(226,232,240,0.25)";

export default function TreeCarousel({
  groups,
  onGroupChange,
  onEdgeSwipe,
  accent = DEFAULT_ACCENT,
  cardBg = DEFAULT_CARD_BG,
  textMuted = DEFAULT_MUTED,
}: TreeCarouselProps) {
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
        if (diff < -40) {
          if (activeIndex >= sorted.length - 1) onEdgeSwipe?.(1);
          else goNext();
        } else if (diff > 40) {
          if (activeIndex <= 0) onEdgeSwipe?.(-1);
          else goPrev();
        }
      }
      isDragging.current = false;
    },
    [goNext, goPrev, onEdgeSwipe, activeIndex, sorted.length]
  );

  if (sorted.length === 0) return null;

  return (
    <div className="relative w-full select-none overflow-hidden" style={{ height: "min(360px, 100%)" }}>
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
                  background: cardBg,
                  border: isActive
                    ? `1px solid ${accent}40`
                    : `1px solid ${accent}0f`,
                  boxShadow: isActive
                    ? `0 8px 32px ${accent}14, 0 0 60px ${accent}0a`
                    : "none",
                  opacity: isActive ? 1 : 0.65,
                }}
              >
                <div
                  className="w-[80px] h-[80px] flex items-center justify-center transition-all duration-300"
                  style={{
                    color: isActive ? accent : textMuted,
                    filter: isActive ? `drop-shadow(0 0 20px ${accent}4d)` : "none",
                  }}
                >
                  {group.icon || getGroupIcon(group.labelEn, "w-full h-full")}
                </div>
                <div className="text-center mt-5 px-3">
                  <p
                    className="text-sm font-black tracking-[0.15em] uppercase"
                    style={{ color: isActive ? accent : textMuted }}
                  >
                    {group.labelEn}
                  </p>
                  <p
                    className="text-[11px] mt-1.5 leading-tight line-clamp-1"
                    style={{
                      color: isActive ? "rgba(226,232,240,0.6)" : textMuted,
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
            background: `${accent}14`,
            border: `1px solid ${accent}26`,
            color: accent,
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
            background: `${accent}14`,
            border: `1px solid ${accent}26`,
            color: accent,
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
              backgroundColor: i === activeIndex ? accent : `${accent}1f`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
