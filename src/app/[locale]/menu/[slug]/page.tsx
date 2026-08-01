"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { UtensilsCrossed, Share2, ArrowUp, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import type { MenuDocument } from "@/lib/menu-schema";
import { MENU_GROUPS, getGroupByLabel, getBadgeText, type MenuGroup } from "@/lib/menu-groups";
import { CAFE_THEMES, type CafeTheme } from "@/lib/cafe-themes";
import TreeCarousel from "@/components/menu/TreeCarousel";

const ACCENT_OLIVE_DEFAULT = "#7A8B3E";
const BG_DEFAULT = "#1A1A1A";

function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: BG_DEFAULT }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#E5C158]/20 border-t-[#E5C158] animate-spin" style={{ borderTopColor: "#E5C158" }} />
        <div className="w-40 h-4 rounded-full bg-white/5" />
        <div className="w-24 h-3 rounded-full bg-white/5" />
      </div>
    </div>
  );
}

function ParentTabs({
  groups,
  activeGroup,
  onGroupChange,
  accent = ACCENT_OLIVE_DEFAULT,
  isTreeTheme,
}: {
  groups: MenuGroup[];
  activeGroup: string;
  onGroupChange: (g: string) => void;
  accent?: string;
  isTreeTheme?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current.querySelector<HTMLButtonElement>(`[data-group="${activeGroup}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeGroup]);

  return (
    <div dir="ltr" className="-mx-3 px-3 mb-5">
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: "none" }}>
        <button
          data-group="all"
          onClick={() => onGroupChange("all")}
          className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 whitespace-nowrap border ${
            isTreeTheme
              ? activeGroup === "all"
                ? "text-[#E5C158] border-[#E5C158]/40 bg-[#E5C158]/10"
                : "text-[#E2E8F0]/40 border-[#E5C158]/10 bg-[#2A1812]/80 hover:text-[#E2E8F0]/70 hover:border-[#E5C158]/30"
              : activeGroup === "all"
                ? "text-white"
                : "text-white/40 border-white/10 bg-white/5 hover:text-white/70 hover:border-white/20"
          }`}
          style={{
            fontFamily: isTreeTheme ? "var(--font-outfit), sans-serif" : "var(--font-cairo), sans-serif",
            ...(isTreeTheme
              ? {}
              : {
                  borderColor: activeGroup === "all" ? accent : undefined,
                  backgroundColor: activeGroup === "all" ? `${accent}26` : undefined,
                  boxShadow: activeGroup === "all" ? `0 0 20px ${accent}26` : undefined,
                }),
          }}
        >
          {isTreeTheme ? "ALL" : "الكل"}
        </button>
        {groups.map((g) => (
          <button
            key={g.labelEn}
            data-group={g.labelEn}
            onClick={() => onGroupChange(g.labelEn)}
            className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 whitespace-nowrap border ${
              isTreeTheme
                ? activeGroup === g.labelEn
                  ? "text-[#E5C158] border-[#E5C158]/40 bg-[#E5C158]/10"
                  : "text-[#E2E8F0]/40 border-[#E5C158]/10 bg-[#2A1812]/80 hover:text-[#E2E8F0]/70 hover:border-[#E5C158]/30"
                : activeGroup === g.labelEn
                  ? "text-white"
                  : "text-white/40 border-white/10 bg-white/5 hover:text-white/70 hover:border-white/20"
            }`}
            style={{
              fontFamily: "var(--font-outfit), var(--font-cairo), sans-serif",
              ...(isTreeTheme
                ? {}
                : {
                    borderColor: activeGroup === g.labelEn ? accent : undefined,
                    backgroundColor: activeGroup === g.labelEn ? `${accent}26` : undefined,
                    boxShadow: activeGroup === g.labelEn ? `0 0 20px ${accent}26` : undefined,
                  }),
            }}
          >
            <span className="ml-1.5 text-base">{g.icon}</span>
            {g.labelEn}
          </button>
        ))}
      </div>
    </div>
  );
}

function SubCategoryTabs({
  subCategories,
  activeSub,
  onSubChange,
  accent = ACCENT_OLIVE_DEFAULT,
  isTreeTheme,
}: {
  subCategories: string[];
  activeSub: string;
  onSubChange: (s: string) => void;
  accent?: string;
  isTreeTheme?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current.querySelector<HTMLButtonElement>(`[data-sub="${activeSub}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeSub]);

  return (
    <div dir="ltr" className="-mx-3 px-3 mb-6">
      <div ref={scrollRef} className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: "none" }}>
        <button
          data-sub="all"
          onClick={() => onSubChange("all")}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 whitespace-nowrap border ${
            isTreeTheme
              ? activeSub === "all"
                ? "text-[#E5C158] border-[#E5C158]/50 bg-[#E5C158]/15"
                : "text-[#E2E8F0]/30 border-[#E5C158]/10 hover:text-[#E2E8F0]/50 hover:border-[#E5C158]/30"
              : activeSub === "all"
                ? "text-white"
                : "text-white/30 border-white/10 hover:text-white/50 hover:border-white/20"
          }`}
          style={{
            fontFamily: isTreeTheme ? "var(--font-outfit), sans-serif" : "var(--font-cairo), sans-serif",
            ...(isTreeTheme ? {} : {
              borderColor: activeSub === "all" ? `${accent}b3` : undefined,
              backgroundColor: activeSub === "all" ? `${accent}1a` : undefined,
            }),
          }}
        >
          {isTreeTheme ? "ALL" : "الكل"}
        </button>
        {subCategories.map((sub) => (
          <button
            key={sub}
            data-sub={sub}
            onClick={() => onSubChange(sub)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 whitespace-nowrap border ${
              isTreeTheme
                ? activeSub === sub
                  ? "text-[#E5C158] border-[#E5C158]/50 bg-[#E5C158]/15"
                  : "text-[#E2E8F0]/30 border-[#E5C158]/10 hover:text-[#E2E8F0]/50 hover:border-[#E5C158]/30"
                : activeSub === sub
                  ? "text-white"
                  : "text-white/30 border-white/10 hover:text-white/50 hover:border-white/20"
            }`}
            style={{
              fontFamily: isTreeTheme ? "var(--font-outfit), sans-serif" : "var(--font-cairo), sans-serif",
              ...(isTreeTheme ? {} : {
                borderColor: activeSub === sub ? `${accent}b3` : undefined,
                backgroundColor: activeSub === sub ? `${accent}1a` : undefined,
              }),
            }}
          >
            {sub}
          </button>
        ))}
      </div>
    </div>
  );
}

function getItemBadge(name: string, desc?: string): string | null {
  const lower = `${name} ${desc || ""}`.toLowerCase();
  if (lower.includes("bestseller") || lower.includes("الأكثر") || lower.includes("signature")) return "bestseller";
  if (lower.includes("spicy") || lower.includes("حار") || lower.includes("سبايسي")) return "spicy";
  if (lower.includes("chef") || lower.includes("special") || lower.includes("خاص") || lower.includes("شيف")) return "chef";
  if (lower.includes("new") || lower.includes("جديد")) return "new";
  return null;
}

function Badge({ type }: { type: string }) {
  const badgeMap: Record<string, { label: string; cls: string }> = {
    bestseller: { label: "الأكثر مبيعاً", cls: "bg-[#E5C158] text-[#1A0F0A]" },
    spicy: { label: "سبايسي 🌶️", cls: "bg-[#FF6B35] text-white" },
    chef: { label: "شيف", cls: "bg-[#4CAF50] text-white" },
    new: { label: "جديد", cls: "bg-[#4CAF50] text-white" },
  };
  const b = badgeMap[type] || { label: type, cls: "bg-white/10 text-white/60" };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase ${b.cls}`}>
      {b.label}
    </span>
  );
}

function MenuItemRow({ item, index, accent, isTreeTheme, priceAccent }: {
  item: { name: string; price: string; size?: string; description?: string };
  index: number;
  accent?: string;
  isTreeTheme?: boolean;
  priceAccent?: string;
}) {
  const ac = accent || ACCENT_OLIVE_DEFAULT;
  const badge = isTreeTheme ? getItemBadge(item.name, item.description) : null;

  if (isTreeTheme) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.025, duration: 0.3, ease: "easeOut" }}
        className="group rounded-xl border border-[#E5C158]/10 bg-gradient-to-br from-[#2A1812]/90 to-[#1E110B]/90 backdrop-blur-md p-4 transition-all duration-300 hover:scale-[1.01] hover:border-[#E5C158]/30 hover:shadow-lg hover:shadow-[#E5C158]/5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className="text-base md:text-lg font-extrabold leading-snug break-words"
                style={{ color: "#E5C158", fontFamily: "var(--font-cairo), var(--font-outfit), sans-serif" }}
              >
                {item.name}
              </h3>
              {item.size && (
                <span className="text-[10px] md:text-xs font-semibold text-[#E2E8F0]/30 tracking-wide whitespace-nowrap">
                  {item.size}
                </span>
              )}
              {badge && <Badge type={badge} />}
            </div>
            {item.description && (
              <p
                className="mt-1.5 text-sm md:text-base leading-relaxed font-normal"
                style={{ color: "#E2E8F0", fontFamily: "var(--font-cairo), var(--font-inter), sans-serif" }}
              >
                {item.description}
              </p>
            )}
          </div>
          <span
            className="text-base md:text-lg font-extrabold tabular-nums whitespace-nowrap shrink-0 mt-0.5"
            style={{ color: priceAccent || "#4CAF50", fontFamily: "var(--font-outfit), var(--font-inter), sans-serif" }}
          >
            {item.price}
          </span>
        </div>
        <div className="mt-3 h-px w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(to right, transparent, rgba(229,193,88,0.2), transparent)" }} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.025, duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2 min-w-0 flex-1">
          <span
            className="text-base md:text-lg font-bold text-white leading-snug break-words"
            style={{ fontFamily: "var(--font-outfit), var(--font-inter), sans-serif" }}
          >
            {item.name}
          </span>
          {item.size && (
            <span
              className="text-[10px] md:text-xs font-semibold text-white/30 tracking-wide whitespace-nowrap shrink-0"
              style={{ fontFamily: "var(--font-outfit), var(--font-inter), sans-serif" }}
            >
              {item.size}
            </span>
          )}
        </div>
        <span
          className="text-base md:text-lg font-bold text-white tabular-nums whitespace-nowrap shrink-0"
          style={{ fontFamily: "var(--font-outfit), var(--font-inter), sans-serif" }}
        >
          {item.price}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-0.5">
        <div className="h-[1px] flex-1 opacity-15" style={{ background: `linear-gradient(to left, transparent, ${ac}, transparent)` }} />
      </div>
      {item.description && (
        <p
          className="mt-1.5 text-sm md:text-base leading-relaxed text-white/55 font-normal"
          style={{ fontFamily: "var(--font-cairo), var(--font-inter), sans-serif" }}
        >
          {item.description}
        </p>
      )}
    </motion.div>
  );
}

function LuxuryDecorations() {
  const GOLD = "#E5C158";
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Big blurred coffee cup - top left */}
      <svg className="absolute" style={{top:"3%",left:"-6%",width:"38%",height:"42%",transform:"rotate(-15deg)",opacity:0.025,filter:"blur(20px)"}} viewBox="0 0 200 200" fill="none">
        <ellipse cx="100" cy="160" rx="75" ry="14" stroke={GOLD} strokeWidth="2"/>
        <ellipse cx="100" cy="160" rx="55" ry="10" stroke={GOLD} strokeWidth="1" opacity="0.4"/>
        <path d="M45 80 C45 145, 50 152, 100 152 C150 152, 155 145, 155 80 Z" stroke={GOLD} strokeWidth="2"/>
        <ellipse cx="100" cy="80" rx="55" ry="12" stroke={GOLD} strokeWidth="2"/>
        <path d="M155 98 C185 98, 185 135, 155 135" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M78 58 C74 42, 90 32, 82 16" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
        <path d="M100 52 C105 38, 92 28, 100 12" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>
      </svg>

      {/* Big blurred juice glass - right side */}
      <svg className="absolute" style={{top:"45%",right:"-8%",width:"35%",height:"45%",transform:"rotate(25deg)",opacity:0.02,filter:"blur(22px)"}} viewBox="0 0 160 200" fill="none">
        <path d="M40 20 L30 150 C30 162, 130 162, 130 150 L120 20Z" stroke={GOLD} strokeWidth="2" fill="none" strokeLinejoin="round"/>
        <path d="M40 20 C40 12, 120 12, 120 20" stroke={GOLD} strokeWidth="2" fill="none"/>
        <path d="M60 30 L58 70" stroke={GOLD} strokeWidth="1" opacity="0.3" strokeLinecap="round"/>
        <path d="M100 30 L102 70" stroke={GOLD} strokeWidth="1" opacity="0.3" strokeLinecap="round"/>
        <path d="M58 50 L102 50" stroke={GOLD} strokeWidth="0.8" opacity="0.2" strokeLinecap="round"/>
        <path d="M80 20 L80 12" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M74 14 L86 14" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="80" cy="38" r="3" stroke={GOLD} strokeWidth="0.8" opacity="0.15"/>
        <path d="M55 48 Q80 56, 105 48" stroke={GOLD} strokeWidth="0.8" opacity="0.15" fill="none"/>
      </svg>

      {/* Plate with cutlery - bottom left */}
      <svg className="absolute" style={{bottom:"5%",left:"-5%",width:"40%",height:"40%",transform:"rotate(-10deg)",opacity:0.025,filter:"blur(18px)"}} viewBox="0 0 200 160" fill="none">
        <ellipse cx="100" cy="100" rx="85" ry="22" stroke={GOLD} strokeWidth="1.5"/>
        <ellipse cx="100" cy="100" rx="60" ry="15" stroke={GOLD} strokeWidth="1" opacity="0.4"/>
        <ellipse cx="100" cy="30" rx="50" ry="20" stroke={GOLD} strokeWidth="1.5" fill="none"/>
        <path d="M100 10 L100 50" stroke={GOLD} strokeWidth="0.8" opacity="0.2"/>
        <path d="M90 20 L110 20" stroke={GOLD} strokeWidth="0.8" opacity="0.15"/>
      </svg>

      {/* Elegant branch - right top */}
      <svg className="absolute" style={{top:"8%",right:"5%",width:"18%",height:"30%",transform:"rotate(10deg)",opacity:0.025,filter:"blur(8px)"}} viewBox="0 0 80 160" fill="none">
        <path d="M10 155 C10 155, 20 100, 40 80 C60 60, 70 40, 70 20" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 155 L10 145" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M20 115 L15 108" stroke={GOLD} strokeWidth="1" strokeLinecap="round"/>
        <path d="M30 95 L24 88" stroke={GOLD} strokeWidth="1" strokeLinecap="round"/>
        <path d="M45 72 L38 66" stroke={GOLD} strokeWidth="1" strokeLinecap="round"/>
        <path d="M55 50 L48 44" stroke={GOLD} strokeWidth="1" strokeLinecap="round"/>
        <path d="M65 32 L58 26" stroke={GOLD} strokeWidth="1" strokeLinecap="round"/>
        <path d="M70 20 L66 14" stroke={GOLD} strokeWidth="0.8" strokeLinecap="round"/>
        <circle cx="72" cy="18" r="2" stroke={GOLD} strokeWidth="0.8" opacity="0.3"/>
        <circle cx="60" cy="38" r="1.5" stroke={GOLD} strokeWidth="0.8" opacity="0.2"/>
        <circle cx="42" cy="70" r="1.5" stroke={GOLD} strokeWidth="0.8" opacity="0.15"/>
      </svg>

      {/* Second branch - bottom right */}
      <svg className="absolute" style={{bottom:"15%",right:"15%",width:"14%",height:"25%",transform:"rotate(-40deg)",opacity:0.02,filter:"blur(7px)"}} viewBox="0 0 60 120" fill="none">
        <path d="M8 115 C8 115, 15 80, 30 60 C45 40, 52 25, 52 10" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15 88 L10 82" stroke={GOLD} strokeWidth="1" strokeLinecap="round"/>
        <path d="M24 68 L18 62" stroke={GOLD} strokeWidth="1" strokeLinecap="round"/>
        <path d="M38 45 L32 40" stroke={GOLD} strokeWidth="1" strokeLinecap="round"/>
        <path d="M46 26 L42 22" stroke={GOLD} strokeWidth="0.8" strokeLinecap="round"/>
        <circle cx="48" cy="18" r="1.5" stroke={GOLD} strokeWidth="0.8" opacity="0.25"/>
      </svg>

      {/* Small sharp coffee cup - top right */}
      <svg className="absolute" style={{top:"12%",right:"20%",width:"10%",height:"12%",transform:"rotate(20deg)",opacity:0.03}} viewBox="0 0 100 100" fill="none">
        <ellipse cx="50" cy="78" rx="35" ry="7" stroke={GOLD} strokeWidth="1.2"/>
        <path d="M22 42 C22 72, 25 76, 50 76 C75 76, 78 72, 78 42Z" stroke={GOLD} strokeWidth="1.2"/>
        <ellipse cx="50" cy="42" rx="28" ry="8" stroke={GOLD} strokeWidth="1.2"/>
        <path d="M78 54 C95 54, 95 72, 78 72" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>

      {/* Small juice glass - left */}
      <svg className="absolute" style={{bottom:"35%",left:"8%",width:"8%",height:"14%",transform:"rotate(-25deg)",opacity:0.025}} viewBox="0 0 60 80" fill="none">
        <path d="M15 10 L12 60 C12 66, 48 66, 48 60 L45 10Z" stroke={GOLD} strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
        <path d="M15 10 C15 6, 45 6, 45 10" stroke={GOLD} strokeWidth="1.2" fill="none"/>
        <path d="M30 10 L30 5" stroke={GOLD} strokeWidth="1" strokeLinecap="round"/>
        <circle cx="30" cy="24" r="1.5" stroke={GOLD} strokeWidth="0.6" opacity="0.2"/>
      </svg>

      {/* Small plate icon - bottom */}
      <svg className="absolute" style={{bottom:"8%",left:"35%",width:"10%",height:"8%",opacity:0.025}} viewBox="0 0 80 40" fill="none">
        <ellipse cx="40" cy="25" rx="38" ry="12" stroke={GOLD} strokeWidth="1"/>
        <ellipse cx="40" cy="25" rx="25" ry="8" stroke={GOLD} strokeWidth="0.8" opacity="0.4"/>
      </svg>

      {/* Tiny decorative dots scattered */}
      <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full" style={{backgroundColor: GOLD, opacity: 0.035}} />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full" style={{backgroundColor: GOLD, opacity: 0.025}} />
      <div className="absolute bottom-1/3 left-1/2 w-1 h-1 rounded-full" style={{backgroundColor: GOLD, opacity: 0.02}} />
      <div className="absolute top-2/3 right-1/4 w-1 h-1 rounded-full" style={{backgroundColor: GOLD, opacity: 0.03}} />
      <div className="absolute top-1/5 right-1/2 w-2 h-2 rounded-full" style={{backgroundColor: GOLD, opacity: 0.015}} />
    </div>
  );
}

export default function MenuPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [menu, setMenu] = useState<MenuDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState("all");
  const [activeSub, setActiveSub] = useState("all");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const items = menu?.items || [];
  const categories = menu?.categories || [];

  const themeType: CafeTheme = menu?.theme || "cafe";
  const isTreeTheme = themeType === "tree";
  const themeConfig = CAFE_THEMES[themeType];
  const accent = themeConfig?.accent || ACCENT_OLIVE_DEFAULT;
  const priceAccent = themeConfig?.priceAccent || accent;
  const bgColor = themeConfig?.bgLoading || BG_DEFAULT;
  const bgGradient = themeConfig?.bg || BG_DEFAULT;

  const activeGroupConfig = activeGroup === "all" ? null : getGroupByLabel(activeGroup);

  const parentGroups = useMemo(() => {
    return MENU_GROUPS.filter((g) =>
      g.children.some((child) => categories.some((c) => c.name === child))
    );
  }, [categories]);

  const handleGroupChange = useCallback((g: string) => {
    setActiveGroup(g);
    setActiveSub("all");
  }, []);

  const navigateBySwipe = useCallback(
    (dir: 1 | -1) => {
      if (parentGroups.length === 0) return;
      if (activeGroup === "all") {
        handleGroupChange(dir === 1 ? parentGroups[0].labelEn : parentGroups[parentGroups.length - 1].labelEn);
        return;
      }
      const idx = parentGroups.findIndex((g) => g.labelEn === activeGroup);
      if (idx === -1) return;
      const nextIdx = (idx + dir + parentGroups.length) % parentGroups.length;
      handleGroupChange(parentGroups[nextIdx].labelEn);
    },
    [activeGroup, parentGroups, handleGroupChange]
  );

  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const swiping = useRef(false);

  const onSwipePointerDown = useCallback((e: React.PointerEvent) => {
    swipeStart.current = { x: e.clientX, y: e.clientY };
    swiping.current = false;
  }, []);

  const onSwipePointerMove = useCallback((e: React.PointerEvent) => {
    if (!swipeStart.current) return;
    const dx = e.clientX - swipeStart.current.x;
    const dy = e.clientY - swipeStart.current.y;
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) swiping.current = true;
  }, []);

  const onSwipePointerEnd = useCallback(
    (e: React.PointerEvent) => {
      if (!swipeStart.current) return;
      const dx = e.clientX - swipeStart.current.x;
      const dy = e.clientY - swipeStart.current.y;
      if (swiping.current && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        if (dx < 0) navigateBySwipe(1);
        else navigateBySwipe(-1);
      }
      swipeStart.current = null;
      swiping.current = false;
    },
    [navigateBySwipe]
  );

  const onSwipePointerCancel = useCallback(() => {
    swipeStart.current = null;
    swiping.current = false;
  }, []);

  const [showSwipeHint, setShowSwipeHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSwipeHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const filteredByGroup = useMemo(() => {
    if (activeGroup === "all") return items;
    if (!activeGroupConfig) return items;
    const groupCats = new Set(activeGroupConfig.children);
    return items.filter((i) => groupCats.has(i.category));
  }, [activeGroup, activeGroupConfig, items]);

  const filteredBySub = useMemo(() => {
    if (activeSub === "all") return filteredByGroup;
    return filteredByGroup.filter((i) => i.category === activeSub);
  }, [activeSub, filteredByGroup]);

  const availableSubs = useMemo(() => {
    if (!activeGroupConfig) return [];
    const subs = activeGroupConfig.children.filter((child) =>
      filteredByGroup.some((i) => i.category === child)
    );
    return subs;
  }, [activeGroupConfig, filteredByGroup]);

  const groupedBySub = useMemo(() => {
    const cats = activeGroup !== "all" && activeSub === "all"
      ? availableSubs
      : activeSub !== "all"
        ? [activeSub]
        : categories.map((c) => c.name);

    return cats
      .map((catName) => ({
        name: catName,
        icon: categories.find((c) => c.name === catName)?.icon || "",
        items: filteredBySub.filter((i) => i.category === catName),
      }))
      .filter((g) => g.items.length > 0);
  }, [activeGroup, activeSub, availableSubs, categories, filteredBySub]);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/menus?slug=${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setMenu(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const shareMenu = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: menu?.name || "Menu", url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  if (loading) return <LoadingSkeleton />;

  if (!menu) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: bgColor }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: isTreeTheme ? "rgba(229,193,88,0.05)" : "rgba(255,255,255,0.05)",
              border: isTreeTheme ? "1px solid rgba(229,193,88,0.1)" : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <UtensilsCrossed className="w-8 h-8" style={{ color: isTreeTheme ? "rgba(229,193,88,0.3)" : "rgba(255,255,255,0.3)" }} />
          </div>
          <h1 className="text-xl font-bold" style={{ color: isTreeTheme ? "rgba(226,232,240,0.6)" : "rgba(255,255,255,0.6)", fontFamily: "var(--font-cairo), sans-serif" }}>غير موجود</h1>
          <p className="text-sm" style={{ color: isTreeTheme ? "rgba(226,232,240,0.4)" : "rgba(255,255,255,0.4)", fontFamily: "var(--font-cairo), sans-serif" }}>المنيو غير موجود أو تم حذفه</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: bgGradient,
        overscrollBehaviorY: "contain",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {isTreeTheme && <LuxuryDecorations />}
      <div className="relative z-10">
        <div className="max-w-lg mx-auto px-4 md:px-5 py-8 md:py-12">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-6"
          >
            {menu.logo && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="flex justify-center mb-4">
                <div
                  className="w-[68px] h-[68px] md:w-20 md:h-20 rounded-full overflow-hidden"
                  style={{
                    border: isTreeTheme ? "2px solid rgba(229,193,88,0.2)" : "1px solid rgba(255,255,255,0.1)",
                    boxShadow: isTreeTheme ? "0 0 40px rgba(229,193,88,0.15)" : `0 0 30px ${accent}33`,
                  }}
                >
                  <Image src={menu.logo} alt={menu.name} width={80} height={80} priority className="w-full h-full object-cover" />
                </div>
              </motion.div>
            )}
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight"
              style={{
                color: isTreeTheme ? "#E5C158" : "white",
                fontFamily: "var(--font-cairo), var(--font-heading), Georgia, serif",
              }}
            >
              {menu.name}
            </h1>
            <div className="mt-2 flex items-center justify-center gap-3">
              <div className="h-px w-10" style={{ background: isTreeTheme ? "linear-gradient(to left, transparent, rgba(229,193,88,0.3))" : "rgba(255,255,255,0.1)" }} />
              <span className="text-sm md:text-base font-black tracking-[0.25em] uppercase" style={{ color: isTreeTheme ? "#E5C158" : accent }}>
                Menu
              </span>
              <div className="h-px w-10" style={{ background: isTreeTheme ? "linear-gradient(to right, transparent, rgba(229,193,88,0.3))" : "rgba(255,255,255,0.1)" }} />
            </div>
          </motion.div>

          {/* Sticky Tabs — always visible while scrolling (app-like) */}
          {(!isTreeTheme || activeGroup !== "all") && parentGroups.length > 0 && (
            <div
              className="sticky top-0 z-40 -mx-4 md:-mx-5 px-4 md:px-5 pt-3 pb-1 backdrop-blur-xl"
              style={{
                backgroundColor: isTreeTheme ? "rgba(20,12,7,0.85)" : "rgba(13,13,13,0.85)",
                borderBottom: isTreeTheme ? "1px solid rgba(229,193,88,0.08)" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                <ParentTabs groups={parentGroups} activeGroup={activeGroup} onGroupChange={handleGroupChange} accent={accent} isTreeTheme={isTreeTheme} />
              </motion.div>

              {activeGroup !== "all" && availableSubs.length > 1 && (
                <motion.div
                  key={activeGroup}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SubCategoryTabs subCategories={availableSubs} activeSub={activeSub} onSubChange={setActiveSub} accent={accent} isTreeTheme={isTreeTheme} />
                </motion.div>
              )}
            </div>
          )}

          {/* Section title when viewing a group with no sub-tabs (or sub=all) */}
          {activeGroup !== "all" && activeSub === "all" && activeGroupConfig && (
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-5"
            >
              <h2
                className="text-lg md:text-xl font-bold tracking-wide"
                style={{
                  color: isTreeTheme ? "#E5C158" : accent,
                  fontFamily: "var(--font-outfit), var(--font-cairo), sans-serif",
                }}
              >
                {activeGroupConfig.icon && <span className="ml-2">{activeGroupConfig.icon}</span>}
                {activeGroupConfig.labelEn}
              </h2>
              <div className="h-[2px] w-10 mt-1 rounded-full" style={{ backgroundColor: isTreeTheme ? "#E5C158" : accent }} />
            </motion.div>
          )}

          {/* Content: Tree Carousel for "all" tab when tree theme, otherwise items */}
          {isTreeTheme && activeGroup === "all" ? (
            <motion.div
              key="tree-carousel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className="text-center mb-4">
                <p className="text-xs tracking-[0.2em] uppercase font-semibold" style={{ color: isTreeTheme ? "rgba(229,193,88,0.6)" : `${accent}99` }}>
                  اختر قسمك
                </p>
                <div className="h-px w-8 mx-auto mt-2 rounded-full" style={{ backgroundColor: isTreeTheme ? "rgba(229,193,88,0.2)" : `${accent}33` }} />
              </div>
              <TreeCarousel groups={parentGroups} onGroupChange={handleGroupChange} />
            </motion.div>
          ) : (
            <div
              className="relative"
              style={{ touchAction: "pan-y" }}
              onPointerDown={parentGroups.length > 1 ? onSwipePointerDown : undefined}
              onPointerMove={parentGroups.length > 1 ? onSwipePointerMove : undefined}
              onPointerUp={parentGroups.length > 1 ? onSwipePointerEnd : undefined}
              onPointerCancel={parentGroups.length > 1 ? onSwipePointerCancel : undefined}
            >
              {/* Swipe nav side arrows (tap fallback) */}
              {parentGroups.length > 1 && (
                <>
                  <button
                    onClick={() => navigateBySwipe(-1)}
                    className="absolute left-0 top-1/3 z-30 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all opacity-35 hover:opacity-100 md:hidden"
                    style={{
                      background: isTreeTheme ? "rgba(229,193,88,0.08)" : "rgba(255,255,255,0.06)",
                      border: isTreeTheme ? "1px solid rgba(229,193,88,0.15)" : `1px solid ${accent}30`,
                      color: isTreeTheme ? "#E5C158" : accent,
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigateBySwipe(1)}
                    className="absolute right-0 top-1/3 z-30 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all opacity-35 hover:opacity-100 md:hidden"
                    style={{
                      background: isTreeTheme ? "rgba(229,193,88,0.08)" : "rgba(255,255,255,0.06)",
                      border: isTreeTheme ? "1px solid rgba(229,193,88,0.15)" : `1px solid ${accent}30`,
                      color: isTreeTheme ? "#E5C158" : accent,
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Swipe hint pill */}
              <AnimatePresence>
                {showSwipeHint && parentGroups.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
                  >
                    <div
                      className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md"
                      style={{
                        background: isTreeTheme ? "rgba(20,12,7,0.85)" : "rgba(13,13,13,0.85)",
                        border: isTreeTheme ? "1px solid rgba(229,193,88,0.2)" : `1px solid ${accent}30`,
                      }}
                    >
                      <ChevronLeft className="w-3 h-3" style={{ color: isTreeTheme ? "#E5C158" : accent }} />
                      <span className="text-[10px] font-semibold tracking-wide whitespace-nowrap" style={{ color: isTreeTheme ? "rgba(229,193,88,0.7)" : accent }}>
                        اسحب يمين / شمال للتنقل
                      </span>
                      <ChevronRight className="w-3 h-3" style={{ color: isTreeTheme ? "#E5C158" : accent }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeGroup}-${activeSub}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-7"
                >
                {groupedBySub.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                    <div
                      className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                      style={{
                        background: isTreeTheme ? "rgba(229,193,88,0.05)" : "rgba(255,255,255,0.05)",
                        border: isTreeTheme ? "1px solid rgba(229,193,88,0.1)" : "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <ShoppingBag className="w-8 h-8" style={{ color: isTreeTheme ? "rgba(229,193,88,0.2)" : "rgba(255,255,255,0.2)" }} />
                    </div>
                    <p className="text-sm font-medium" style={{ color: isTreeTheme ? "rgba(226,232,240,0.4)" : "rgba(255,255,255,0.4)", fontFamily: "var(--font-cairo), sans-serif" }}>
                      لا توجد أصناف في هذا القسم
                    </p>
                  </motion.div>
                )}

                {groupedBySub.map((group) => (
                  <div key={group.name}>
                    <motion.div
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="mb-4 pb-2"
                      style={{ borderBottom: isTreeTheme ? "1px solid rgba(229,193,88,0.08)" : "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <h3
                        className="text-sm md:text-base font-bold tracking-wide"
                        style={{
                          color: isTreeTheme ? "#E5C158" : accent,
                          fontFamily: "var(--font-cairo), var(--font-outfit), sans-serif",
                        }}
                      >
                        {activeGroup === "all" ? getBadgeText(group.name) : group.name}
                      </h3>
                    </motion.div>
                    <div className={`space-y-4 md:space-y-5 ${isTreeTheme ? "space-y-3 md:space-y-3" : ""}`}>
                      {group.items.map((item, i) => (
                        <MenuItemRow key={`${item.name}-${item.size || ""}-${i}`} item={item} index={i} accent={accent} isTreeTheme={isTreeTheme} priceAccent={priceAccent} />
                      ))}
                    </div>
                </div>
              ))}
              </motion.div>
            </AnimatePresence>
            </div>
          )}

          {/* Footer */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-12 md:mt-16 pb-6">
            <div className="h-px max-w-xs mx-auto mb-5" style={{ background: isTreeTheme ? "linear-gradient(to right, transparent, rgba(229,193,88,0.15), transparent)" : "rgba(255,255,255,0.1)" }} />
            <div className="flex items-center justify-center gap-4">
              <button onClick={shareMenu} className={`flex items-center gap-1.5 text-[10px] tracking-wider transition-colors ${isTreeTheme ? "text-[#E2E8F0]/40 hover:text-[#E5C158]" : "text-white/40 hover:text-white/70"}`}>
                <Share2 className="w-3 h-3" />مشاركة
              </button>
              <span className="text-[10px] tracking-widest" style={{ color: isTreeTheme ? "rgba(229,193,88,0.3)" : "rgba(255,255,255,0.25)" }}>
                مدعوم من{" "}
                <a href="https://gotap.vercel.app/ar" target="_blank" rel="noopener noreferrer" className="hover:underline font-medium transition-opacity" style={{ color: isTreeTheme ? "#E5C158" : accent }}>GoTap</a>
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 md:bottom-8 right-4 md:right-8 z-50 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
            style={{
              backgroundColor: isTreeTheme ? "rgba(229,193,88,0.12)" : `${accent}20`,
              border: isTreeTheme ? "1px solid rgba(229,193,88,0.25)" : `1px solid ${accent}40`,
              boxShadow: isTreeTheme ? "0 0 20px rgba(229,193,88,0.12)" : `0 0 20px ${accent}20`,
            }}
          >
            <ArrowUp className="w-5 h-5" style={{ color: isTreeTheme ? "#E5C158" : accent }} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
