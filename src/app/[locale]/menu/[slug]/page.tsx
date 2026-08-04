"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, animate } from "framer-motion";
import { UtensilsCrossed, Share2, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import type { MenuDocument } from "@/lib/menu-schema";
import type { MenuItem } from "@/lib/cafe-schema";
import { MENU_GROUPS, getBadgeText, type MenuGroup } from "@/lib/menu-groups";
import { CAFE_THEMES, type CafeTheme } from "@/lib/cafe-themes";
import TreeCarousel, { type CarouselGroup } from "@/components/menu/TreeCarousel";
import { getGroupIcon } from "@/components/menu/LineArtIcons";

const ACCENT_DEFAULT = "#C6A568";
const BG_DEFAULT = "#1A1A1A";

const CATEGORY_EN: Record<string, string> = {
  "كريبات فراخ": "Chicken Crepes",
  "كريبات خفيفة": "Light Crepes",
  "كريبات ميكسات": "Mix Crepes",
  "كريبات لحوم": "Meat Crepes",
  "الساندوتشات": "Sandwiches",
  "سوري": "Syrian Rolls",
  "الإضافات": "Add-ons",
  "الحلويات": "Desserts",
  "البيتزا": "Pizza",
  "New Mix": "New Mix",
};

function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: BG_DEFAULT }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
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
  accent = ACCENT_DEFAULT,
}: {
  groups: MenuGroup[];
  activeGroup: string;
  onGroupChange: (g: string) => void;
  accent?: string;
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
            activeGroup === "all"
              ? "text-white"
              : "text-white/40 border-white/10 bg-white/5 hover:text-white/70 hover:border-white/20"
          }`}
          style={{
            fontFamily: "var(--font-cairo), sans-serif",
            borderColor: activeGroup === "all" ? accent : undefined,
            backgroundColor: activeGroup === "all" ? `${accent}26` : undefined,
            boxShadow: activeGroup === "all" ? `0 0 20px ${accent}26` : undefined,
          }}
        >
          All
        </button>
        {groups.map((g) => (
          <button
            key={g.labelEn}
            data-group={g.labelEn}
            onClick={() => onGroupChange(g.labelEn)}
            className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 whitespace-nowrap border ${
              activeGroup === g.labelEn
                ? "text-white"
                : "text-white/40 border-white/10 bg-white/5 hover:text-white/70 hover:border-white/20"
            }`}
            style={{
              fontFamily: "var(--font-outfit), var(--font-cairo), sans-serif",
              borderColor: activeGroup === g.labelEn ? accent : undefined,
              backgroundColor: activeGroup === g.labelEn ? `${accent}26` : undefined,
              boxShadow: activeGroup === g.labelEn ? `0 0 20px ${accent}26` : undefined,
            }}
          >
            {g.icon && <span className="ml-1.5 text-base">{g.icon}</span>}
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
  accent = ACCENT_DEFAULT,
}: {
  subCategories: string[];
  activeSub: string;
  onSubChange: (s: string) => void;
  accent?: string;
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
            activeSub === "all"
              ? "text-white"
              : "text-white/30 border-white/10 hover:text-white/50 hover:border-white/20"
          }`}
          style={{
            fontFamily: "var(--font-cairo), sans-serif",
            borderColor: activeSub === "all" ? `${accent}b3` : undefined,
            backgroundColor: activeSub === "all" ? `${accent}1a` : undefined,
          }}
        >
          All
        </button>
        {subCategories.map((sub) => (
          <button
            key={sub}
            data-sub={sub}
            onClick={() => onSubChange(sub)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 whitespace-nowrap border ${
              activeSub === sub
                ? "text-white"
                : "text-white/30 border-white/10 hover:text-white/50 hover:border-white/20"
            }`}
            style={{
              fontFamily: "var(--font-cairo), sans-serif",
              borderColor: activeSub === sub ? `${accent}b3` : undefined,
              backgroundColor: activeSub === sub ? `${accent}1a` : undefined,
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

function MenuItemRow({ item, index, accent, priceAccent, cardBg }: {
  item: MenuItem;
  index: number;
  accent?: string;
  priceAccent?: string;
  cardBg?: string;
}) {
  const ac = accent || ACCENT_DEFAULT;
  const priceAc = priceAccent || ac;
  const badge = getItemBadge(item.name, item.description);
  const sizes =
    item.sizes && item.sizes.length > 0
      ? item.sizes
      : item.prices && item.prices.length > 0
        ? item.prices
        : null;

  return (
    <motion.div
      dir="rtl"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.025, duration: 0.3, ease: "easeOut" }}
      className="group rounded-xl border backdrop-blur-md p-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
      style={{
        background: cardBg || "rgba(255,255,255,0.04)",
        borderColor: `${ac}1a`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${ac}4d`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${ac}0d`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${ac}1a`;
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 rgba(0,0,0,0)";
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className="text-base md:text-lg font-extrabold leading-snug break-words"
              style={{ color: ac, fontFamily: "var(--font-cairo), var(--font-outfit), sans-serif" }}
            >
              {item.name}
            </h3>
            {item.size && (
              <span className="text-[10px] md:text-xs font-semibold text-white/30 tracking-wide whitespace-nowrap">
                {item.size}
              </span>
            )}
            {badge && <Badge type={badge} />}
          </div>
          {item.description && (
            <p
              className="mt-1.5 text-sm md:text-base leading-relaxed font-normal"
              style={{ color: "rgba(226,232,240,0.55)", fontFamily: "var(--font-cairo), var(--font-inter), sans-serif" }}
            >
              {item.description}
            </p>
          )}
        </div>
        {sizes ? (
          <div className="flex gap-4 shrink-0 pt-0.5">
            {sizes.map((s, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-[10px] font-semibold leading-tight max-w-[110px]"
                  style={{ color: `${priceAc}99`, fontFamily: "var(--font-cairo), sans-serif" }}
                >
                  {s.label}
                </div>
                <div
                  className="text-base md:text-lg font-extrabold tabular-nums leading-tight"
                  style={{ color: priceAc, fontFamily: "var(--font-outfit), var(--font-inter), sans-serif" }}
                >
                  {s.price}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span
            className="text-base md:text-lg font-extrabold tabular-nums whitespace-nowrap shrink-0 mt-0.5"
            style={{ color: priceAc, fontFamily: "var(--font-outfit), var(--font-inter), sans-serif" }}
          >
            {item.price}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function LuxuryDecorations({ color = "#E5C158" }: { color?: string }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Big blurred coffee cup - top left */}
      <svg className="absolute" style={{top:"3%",left:"-6%",width:"38%",height:"42%",transform:"rotate(-15deg)",opacity:0.025,filter:"blur(20px)"}} viewBox="0 0 200 200" fill="none">
        <ellipse cx="100" cy="160" rx="75" ry="14" stroke={color} strokeWidth="2"/>
        <ellipse cx="100" cy="160" rx="55" ry="10" stroke={color} strokeWidth="1" opacity="0.4"/>
        <path d="M45 80 C45 145, 50 152, 100 152 C150 152, 155 145, 155 80 Z" stroke={color} strokeWidth="2"/>
        <ellipse cx="100" cy="80" rx="55" ry="12" stroke={color} strokeWidth="2"/>
        <path d="M155 98 C185 98, 185 135, 155 135" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M78 58 C74 42, 90 32, 82 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
        <path d="M100 52 C105 38, 92 28, 100 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>
      </svg>

      {/* Big blurred juice glass - right side */}
      <svg className="absolute" style={{top:"45%",right:"-8%",width:"35%",height:"45%",transform:"rotate(25deg)",opacity:0.02,filter:"blur(22px)"}} viewBox="0 0 160 200" fill="none">
        <path d="M40 20 L30 150 C30 162, 130 162, 130 150 L120 20Z" stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round"/>
        <path d="M40 20 C40 12, 120 12, 120 20" stroke={color} strokeWidth="2" fill="none"/>
        <path d="M60 30 L58 70" stroke={color} strokeWidth="1" opacity="0.3" strokeLinecap="round"/>
        <path d="M100 30 L102 70" stroke={color} strokeWidth="1" opacity="0.3" strokeLinecap="round"/>
        <path d="M58 50 L102 50" stroke={color} strokeWidth="0.8" opacity="0.2" strokeLinecap="round"/>
        <path d="M80 20 L80 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M74 14 L86 14" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="80" cy="38" r="3" stroke={color} strokeWidth="0.8" opacity="0.15"/>
        <path d="M55 48 Q80 56, 105 48" stroke={color} strokeWidth="0.8" opacity="0.15" fill="none"/>
      </svg>

      {/* Plate with cutlery - bottom left */}
      <svg className="absolute" style={{bottom:"5%",left:"-5%",width:"40%",height:"40%",transform:"rotate(-10deg)",opacity:0.025,filter:"blur(18px)"}} viewBox="0 0 200 160" fill="none">
        <ellipse cx="100" cy="100" rx="85" ry="22" stroke={color} strokeWidth="1.5"/>
        <ellipse cx="100" cy="100" rx="60" ry="15" stroke={color} strokeWidth="1" opacity="0.4"/>
        <ellipse cx="100" cy="30" rx="50" ry="20" stroke={color} strokeWidth="1.5" fill="none"/>
        <path d="M100 10 L100 50" stroke={color} strokeWidth="0.8" opacity="0.2"/>
        <path d="M90 20 L110 20" stroke={color} strokeWidth="0.8" opacity="0.15"/>
      </svg>

      {/* Elegant branch - right top */}
      <svg className="absolute" style={{top:"8%",right:"5%",width:"18%",height:"30%",transform:"rotate(10deg)",opacity:0.025,filter:"blur(8px)"}} viewBox="0 0 80 160" fill="none">
        <path d="M10 155 C10 155, 20 100, 40 80 C60 60, 70 40, 70 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 155 L10 145" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M20 115 L15 108" stroke={color} strokeWidth="1" strokeLinecap="round"/>
        <path d="M30 95 L24 88" stroke={color} strokeWidth="1" strokeLinecap="round"/>
        <path d="M45 72 L38 66" stroke={color} strokeWidth="1" strokeLinecap="round"/>
        <path d="M55 50 L48 44" stroke={color} strokeWidth="1" strokeLinecap="round"/>
        <path d="M65 32 L58 26" stroke={color} strokeWidth="1" strokeLinecap="round"/>
        <path d="M70 20 L66 14" stroke={color} strokeWidth="0.8" strokeLinecap="round"/>
        <circle cx="72" cy="18" r="2" stroke={color} strokeWidth="0.8" opacity="0.3"/>
        <circle cx="60" cy="38" r="1.5" stroke={color} strokeWidth="0.8" opacity="0.2"/>
        <circle cx="42" cy="70" r="1.5" stroke={color} strokeWidth="0.8" opacity="0.15"/>
      </svg>

      {/* Second branch - bottom right */}
      <svg className="absolute" style={{bottom:"15%",right:"15%",width:"14%",height:"25%",transform:"rotate(-40deg)",opacity:0.02,filter:"blur(7px)"}} viewBox="0 0 60 120" fill="none">
        <path d="M8 115 C8 115, 15 80, 30 60 C45 40, 52 25, 52 10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15 88 L10 82" stroke={color} strokeWidth="1" strokeLinecap="round"/>
        <path d="M24 68 L18 62" stroke={color} strokeWidth="1" strokeLinecap="round"/>
        <path d="M38 45 L32 40" stroke={color} strokeWidth="1" strokeLinecap="round"/>
        <path d="M46 26 L42 22" stroke={color} strokeWidth="0.8" strokeLinecap="round"/>
        <circle cx="48" cy="18" r="1.5" stroke={color} strokeWidth="0.8" opacity="0.25"/>
      </svg>

      {/* Small sharp coffee cup - top right */}
      <svg className="absolute" style={{top:"12%",right:"20%",width:"10%",height:"12%",transform:"rotate(20deg)",opacity:0.03}} viewBox="0 0 100 100" fill="none">
        <ellipse cx="50" cy="78" rx="35" ry="7" stroke={color} strokeWidth="1.2"/>
        <path d="M22 42 C22 72, 25 76, 50 76 C75 76, 78 72, 78 42Z" stroke={color} strokeWidth="1.2"/>
        <ellipse cx="50" cy="42" rx="28" ry="8" stroke={color} strokeWidth="1.2"/>
        <path d="M78 54 C95 54, 95 72, 78 72" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>

      {/* Small juice glass - left */}
      <svg className="absolute" style={{bottom:"35%",left:"8%",width:"8%",height:"14%",transform:"rotate(-25deg)",opacity:0.025}} viewBox="0 0 60 80" fill="none">
        <path d="M15 10 L12 60 C12 66, 48 66, 48 60 L45 10Z" stroke={color} strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
        <path d="M15 10 C15 6, 45 6, 45 10" stroke={color} strokeWidth="1.2" fill="none"/>
        <path d="M30 10 L30 5" stroke={color} strokeWidth="1" strokeLinecap="round"/>
        <circle cx="30" cy="24" r="1.5" stroke={color} strokeWidth="0.6" opacity="0.2"/>
      </svg>

      {/* Small plate icon - bottom */}
      <svg className="absolute" style={{bottom:"8%",left:"35%",width:"10%",height:"8%",opacity:0.025}} viewBox="0 0 80 40" fill="none">
        <ellipse cx="40" cy="25" rx="38" ry="12" stroke={color} strokeWidth="1"/>
        <ellipse cx="40" cy="25" rx="25" ry="8" stroke={color} strokeWidth="0.8" opacity="0.4"/>
      </svg>

      {/* Tiny decorative dots scattered */}
      <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full" style={{backgroundColor: color, opacity: 0.035}} />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full" style={{backgroundColor: color, opacity: 0.025}} />
      <div className="absolute bottom-1/3 left-1/2 w-1 h-1 rounded-full" style={{backgroundColor: color, opacity: 0.02}} />
      <div className="absolute top-2/3 right-1/4 w-1 h-1 rounded-full" style={{backgroundColor: color, opacity: 0.03}} />
      <div className="absolute top-1/5 right-1/2 w-2 h-2 rounded-full" style={{backgroundColor: color, opacity: 0.015}} />
    </div>
  );
}

export default function MenuPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [menu, setMenu] = useState<MenuDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [deckIndex, setDeckIndex] = useState(0);
  const [activeSub, setActiveSub] = useState("all");

  const items = menu?.items || [];
  const categories = menu?.categories || [];

  const themeType: CafeTheme = menu?.theme || "cafe";
  const themeConfig = CAFE_THEMES[themeType];
  const accent = themeConfig?.accent || ACCENT_DEFAULT;
  const priceAccent = themeConfig?.priceAccent || accent;
  const cardBg = themeConfig?.cardBg;
  const bgColor = themeConfig?.bgLoading || BG_DEFAULT;
  const bgGradient = themeConfig?.bg || BG_DEFAULT;

  const parentGroups = useMemo(() => {
    const matched = MENU_GROUPS.filter((g) =>
      g.children.some((child) => categories.some((c) => c.name === child))
    );
    if (matched.length > 0) return matched;
    return categories
      .filter((c) => items.some((i) => i.category === c.name))
      .map((c) => ({
        label: c.name,
        labelEn: CATEGORY_EN[c.name] || c.name,
        icon: c.icon || "📋",
        children: [c.name],
      }));
  }, [categories, items]);

  const groupMap = useMemo(
    () => Object.fromEntries(parentGroups.map((g) => [g.labelEn, g])),
    [parentGroups]
  );

  const carouselGroups = useMemo<CarouselGroup[]>(
    () =>
      parentGroups.map((g) => ({
        labelEn: g.labelEn,
        label: g.label,
        icon: getGroupIcon(g.labelEn) ? undefined : (
          <span className="w-full h-full flex items-center justify-center text-4xl">{g.icon || "📋"}</span>
        ),
      })),
    [parentGroups]
  );

  const screens = useMemo(
    () => ["all", ...parentGroups.map((g) => g.labelEn)],
    [parentGroups]
  );

  const activeGroup = screens[Math.min(deckIndex, screens.length - 1)] || "all";

  /* ---------- Deck slide (fixed viewport, app-like) ---------- */
  const slideX = useMotionValue(0);
  const deckTransform = useMotionTemplate`translateX(${slideX}%)`;
  const deckRef = useRef<HTMLDivElement>(null);
  const dragInfo = useRef<{ startX: number; index: number; active: boolean; width: number }>({
    startX: 0,
    index: 0,
    active: false,
    width: 1,
  });
  const screenScrollRefs = useRef<(HTMLDivElement | null)[]>([]);

  const goToDeck = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(screens.length - 1, idx));
      setDeckIndex(clamped);
      setActiveSub("all");
      animate(slideX, -clamped * 100, { type: "spring", stiffness: 400, damping: 38 });
    },
    [screens.length, slideX]
  );

  const flipDeck = useCallback(
    (dir: 1 | -1) => {
      if (screens.length < 2) return;
      goToDeck((deckIndex + dir + screens.length) % screens.length);
    },
    [deckIndex, screens.length, goToDeck]
  );

  const handleGroupChange = useCallback(
    (g: string) => {
      const idx = screens.indexOf(g);
      goToDeck(idx === -1 ? 0 : idx);
    },
    [screens, goToDeck]
  );

  useEffect(() => {
    if (deckIndex >= screens.length) {
      const target = Math.max(0, screens.length - 1);
      setDeckIndex(target);
      slideX.set(-target * 100);
    }
  }, [screens.length, deckIndex, slideX]);

  useEffect(() => {
    const el = screenScrollRefs.current[deckIndex];
    if (el) el.scrollTop = 0;
  }, [deckIndex]);

  const deckDragEnabled =
    screens.length > 1 && (deckIndex !== 0 || carouselGroups.length === 0);

  const onDeckPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!deckDragEnabled) return;
      const el = deckRef.current;
      dragInfo.current = {
        startX: e.clientX,
        index: deckIndex,
        active: true,
        width: el?.getBoundingClientRect().width || 1,
      };
    },
    [deckDragEnabled, deckIndex]
  );

  const onDeckPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = dragInfo.current;
      if (!d.active) return;
      const dx = e.clientX - d.startX;
      slideX.set(-d.index * 100 + (dx / d.width) * 100);
    },
    [slideX]
  );

  const onDeckPointerUp = useCallback(
    (e: React.PointerEvent) => {
      const d = dragInfo.current;
      if (!d.active) return;
      d.active = false;
      const dx = e.clientX - d.startX;
      if (Math.abs(dx) > 60) {
        flipDeck(dx < 0 ? 1 : -1);
      } else {
        animate(slideX, -d.index * 100, { type: "spring", stiffness: 400, damping: 38 });
      }
    },
    [flipDeck, slideX]
  );

  const onDeckPointerCancel = useCallback(() => {
    const d = dragInfo.current;
    if (!d.active) return;
    d.active = false;
    animate(slideX, -d.index * 100, { type: "spring", stiffness: 400, damping: 38 });
  }, [slideX]);

  const [showSwipeHint, setShowSwipeHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSwipeHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  /* ---------- Per-screen data ---------- */
  const screenData = useMemo(() => {
    return screens.map((label) => {
      if (label === "all") return { label, type: "all" as const };
      const cfg = groupMap[label];
      const groupItems = cfg ? items.filter((i) => cfg.children.includes(i.category)) : [];
      const subs = cfg ? cfg.children.filter((c) => groupItems.some((i) => i.category === c)) : [];
      const cats =
        activeSub !== "all" && subs.includes(activeSub)
          ? [activeSub]
          : subs.length > 0
            ? subs
            : categories.map((c) => c.name);
      const grouped = cats
        .map((catName) => ({
          name: catName,
          icon: categories.find((c) => c.name === catName)?.icon || "",
          items: groupItems.filter((i) => i.category === catName),
        }))
        .filter((g) => g.items.length > 0);
      return { label, type: "group" as const, cfg, subs, grouped };
    });
  }, [screens, items, categories, activeSub, groupMap]);

  const allScreenGroups = useMemo(() => {
    const names =
      categories.length > 0
        ? categories.map((c) => c.name)
        : [...new Set(items.map((i) => i.category))];
    return names
      .map((catName) => ({
        name: catName,
        icon: categories.find((c) => c.name === catName)?.icon || "",
        items: items.filter((i) => i.category === catName),
      }))
      .filter((g) => g.items.length > 0);
  }, [categories, items]);

  const activeScreen = screenData[Math.min(deckIndex, screenData.length - 1)];
  const activeScreenSubs = activeScreen?.type === "group" ? activeScreen.subs : [];

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/menus?slug=${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setMenu(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

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
              background: `${accent}0d`,
              border: `1px solid ${accent}1a`,
            }}
          >
            <UtensilsCrossed className="w-8 h-8" style={{ color: `${accent}66` }} />
          </div>
          <h1 className="text-xl font-bold" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-cairo), sans-serif" }}>Not found</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-cairo), sans-serif" }}>This menu doesn't exist or was deleted</p>
        </motion.div>
      </div>
    );
  }

  const renderEmpty = () => (
    <motion.div initial={false} animate={{ opacity: 1 }} className="text-center py-16">
      <div
        className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
        style={{
          background: `${accent}0d`,
          border: `1px solid ${accent}1a`,
        }}
      >
        <ShoppingBag className="w-8 h-8" style={{ color: `${accent}40` }} />
      </div>
      <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-cairo), sans-serif" }}>
        No items in this section
      </p>
    </motion.div>
  );

  const renderGroupItems = (
    grouped: { name: string; icon: string; items: MenuItem[] }[],
    isAllScreen: boolean
  ) => (
    <>
      {grouped.length === 0 ? (
        renderEmpty()
      ) : (
        grouped.map((group) => (
          <div key={group.name} className="mb-6">
            <motion.div
              initial={{ x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-3 pb-2"
              style={{ borderBottom: `1px solid ${accent}14` }}
            >
              <h3
                className="text-sm md:text-base font-bold tracking-wide"
                style={{
                  color: accent,
                  fontFamily: "var(--font-cairo), var(--font-outfit), sans-serif",
                }}
              >
                {isAllScreen ? getBadgeText(group.name) : group.name}
              </h3>
            </motion.div>
            <div className="space-y-3 md:space-y-4">
              {group.items.map((item, i) => (
                <MenuItemRow key={`${item.name}-${item.size || ""}-${i}`} item={item} index={i} accent={accent} priceAccent={priceAccent} cardBg={cardBg} />
              ))}
            </div>
          </div>
        ))
      )}
    </>
  );

  return (
    <div
      className="h-dvh overflow-hidden relative flex flex-col"
      style={{
        background: bgGradient,
        overscrollBehaviorY: "contain",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <LuxuryDecorations color={accent} />
      <div className="relative z-10 flex flex-col h-full w-full">
        <div className="max-w-lg mx-auto w-full px-4 md:px-5 flex flex-col h-full">

          {/* Header */}
          <motion.div
            initial={{ y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center pt-6 md:pt-8 shrink-0"
          >
            {menu.logo && (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="flex justify-center mb-4">
                <div
                  className="w-[68px] h-[68px] md:w-20 md:h-20 rounded-full overflow-hidden"
                  style={{
                    border: `1px solid ${accent}33`,
                    boxShadow: `0 0 30px ${accent}33`,
                  }}
                >
                  <Image src={menu.logo} alt={menu.name} width={80} height={80} priority className="w-full h-full object-cover" />
                </div>
              </motion.div>
            )}
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight"
              style={{
                color: "white",
                fontFamily: "var(--font-cairo), var(--font-heading), Georgia, serif",
              }}
            >
              {menu.name}
            </h1>
            <div className="mt-2 flex items-center justify-center gap-3">
              <div className="h-px w-10" style={{ background: `linear-gradient(to left, transparent, ${accent}66)` }} />
              <span className="text-sm md:text-base font-black tracking-[0.25em] uppercase" style={{ color: accent }}>
                Menu
              </span>
              <div className="h-px w-10" style={{ background: `linear-gradient(to right, transparent, ${accent}66)` }} />
            </div>
          </motion.div>

          {/* Tabs (fixed, always visible — hidden on "all" screen) */}
          {activeGroup !== "all" && parentGroups.length > 0 && (
            <div className="shrink-0 pt-3">
              <motion.div initial={{ y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                <ParentTabs groups={parentGroups} activeGroup={activeGroup} onGroupChange={handleGroupChange} accent={accent} />
              </motion.div>

              {activeScreenSubs.length > 1 && (
                <motion.div
                  key={activeGroup}
                  initial={{ y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SubCategoryTabs subCategories={activeScreenSubs} activeSub={activeSub} onSubChange={setActiveSub} accent={accent} />
                </motion.div>
              )}
            </div>
          )}

          {/* Deck — fixed viewport, swipe between screens */}
          <div
            ref={deckRef}
            className="relative flex-1 min-h-0 mt-3 overflow-hidden"
            style={{ touchAction: "pan-y" }}
            onPointerDown={deckDragEnabled ? onDeckPointerDown : undefined}
            onPointerMove={deckDragEnabled ? onDeckPointerMove : undefined}
            onPointerUp={deckDragEnabled ? onDeckPointerUp : undefined}
            onPointerCancel={deckDragEnabled ? onDeckPointerCancel : undefined}
          >
            <motion.div dir="ltr" className="flex h-full" style={{ transform: deckTransform, width: "100%" }}>
              {screenData.map((scr, i) => (
                <div
                  key={scr.label}
                  ref={(el) => {
                    screenScrollRefs.current[i] = el;
                  }}
                  className="h-full overflow-y-auto overscroll-contain scrollbar-none"
                  style={{ flex: "0 0 100%", touchAction: "pan-y" }}
                >
                  {scr.type === "all" ? (
                    carouselGroups.length > 0 ? (
                      <div className="h-full flex flex-col items-center justify-center pb-2">
                        <p className="text-xs tracking-[0.2em] uppercase font-semibold" style={{ color: `${accent}99` }}>
                          Choose your section
                        </p>
                        <div className="h-px w-8 mx-auto mt-2 mb-3 rounded-full" style={{ backgroundColor: `${accent}33` }} />
                        <TreeCarousel
                          groups={carouselGroups}
                          onGroupChange={handleGroupChange}
                          onEdgeSwipe={flipDeck}
                          accent={accent}
                          cardBg={cardBg}
                        />
                      </div>
                    ) : (
                      <div className="pt-1 pb-6">{renderGroupItems(allScreenGroups, true)}</div>
                    )
                  ) : (
                    <div className="pt-1 pb-6">
                      {activeSub === "all" && scr.cfg && (
                        <motion.div initial={{ x: -4 }} animate={{ opacity: 1, x: 0 }} className="mb-4" dir="rtl">
                          <h2
                            className="text-lg md:text-xl font-bold tracking-wide"
                            style={{
                              color: accent,
                              fontFamily: "var(--font-cairo), var(--font-outfit), sans-serif",
                            }}
                          >
                            {scr.cfg.icon && <span className="ml-2">{scr.cfg.icon}</span>}
                            {scr.cfg.label}
                          </h2>
                          <div className="h-[2px] w-10 mt-1 rounded-full" style={{ backgroundColor: accent }} />
                        </motion.div>
                      )}
                      {renderGroupItems(scr.grouped, false)}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>

            {/* Swipe nav side arrows (tap fallback, group screens only) */}
            {screens.length > 1 && activeGroup !== "all" && (
              <>
                <button
                  onClick={() => flipDeck(-1)}
                  className="absolute left-1 top-1/3 z-30 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all opacity-35 hover:opacity-100 md:hidden"
                  style={{
                    background: `${accent}14`,
                    border: `1px solid ${accent}26`,
                    color: accent,
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => flipDeck(1)}
                  className="absolute right-1 top-1/3 z-30 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all opacity-35 hover:opacity-100 md:hidden"
                  style={{
                    background: `${accent}14`,
                    border: `1px solid ${accent}26`,
                    color: accent,
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Swipe hint pill */}
            <AnimatePresence>
              {showSwipeHint && screens.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
                >
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md"
                    style={{
                      background: "rgba(13,13,13,0.85)",
                      border: `1px solid ${accent}30`,
                    }}
                  >
                    <ChevronLeft className="w-3 h-3" style={{ color: accent }} />
                    <span className="text-[10px] font-semibold tracking-wide whitespace-nowrap" style={{ color: `${accent}cc` }}>
                      Swipe left / right
                    </span>
                    <ChevronRight className="w-3 h-3" style={{ color: accent }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <motion.div initial={false} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="shrink-0 pt-2 pb-4 text-center">
            <div className="h-px max-w-xs mx-auto mb-3" style={{ background: `linear-gradient(to right, transparent, ${accent}26, transparent)` }} />
            <div className="flex items-center justify-center gap-4">
              <button onClick={shareMenu} className="flex items-center gap-1.5 text-[10px] tracking-wider text-white/40 hover:text-white/70 transition-colors">
                <Share2 className="w-3 h-3" />Share
              </button>
              <span className="text-[10px] tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
                Powered by{" "}
                <a href="https://gotap.vercel.app/ar" target="_blank" rel="noopener noreferrer" className="hover:underline font-medium transition-opacity" style={{ color: accent }}>GoTap</a>
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
