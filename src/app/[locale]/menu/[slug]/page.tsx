"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { UtensilsCrossed, Share2, ArrowUp, ShoppingBag } from "lucide-react";
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
        <div className="w-12 h-12 rounded-full border-2 border-[#7A8B3E]/30 border-t-[#7A8B3E] animate-spin" />
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
          الكل
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
              fontFamily: "var(--font-cairo), sans-serif",
              borderColor: activeGroup === g.labelEn ? accent : undefined,
              backgroundColor: activeGroup === g.labelEn ? `${accent}26` : undefined,
              boxShadow: activeGroup === g.labelEn ? `0 0 20px ${accent}26` : undefined,
            }}
          >
            <span className="ml-1.5 text-base">{g.icon}</span>
            {g.label}
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
          الكل
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

function MenuItemRow({ item, index, accent }: { item: { name: string; price: string; size?: string; description?: string }; index: number; accent?: string }) {
  const ac = accent || ACCENT_OLIVE_DEFAULT;
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

function LeafDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <svg className="absolute" style={{top:"5%",left:"-5%",width:"45%",height:"50%",transform:"rotate(-20deg)",opacity:0.08,filter:"blur(18px)"}} viewBox="0 0 300 300" fill="none">
        <path d="M150 20 C200 20, 250 80, 260 140 C250 200, 200 250, 150 270 C100 250, 50 200, 40 140 C50 80, 100 20, 150 20Z" stroke="#3D8B7A" strokeWidth="2"/>
        <path d="M150 20 L150 160" stroke="#3D8B7A" strokeWidth="1.5" opacity="0.5"/>
        <path d="M90 80 L150 160" stroke="#3D8B7A" strokeWidth="1" opacity="0.3"/>
        <path d="M210 80 L150 160" stroke="#3D8B7A" strokeWidth="1" opacity="0.3"/>
      </svg>
      <svg className="absolute" style={{top:"50%",right:"-8%",width:"50%",height:"55%",transform:"rotate(35deg)",opacity:0.07,filter:"blur(22px)"}} viewBox="0 0 300 300" fill="none">
        <path d="M150 30 C190 30, 240 90, 250 150 C240 210, 190 250, 150 260 C110 250, 60 210, 50 150 C60 90, 110 30, 150 30Z" stroke="#3D8B7A" strokeWidth="2"/>
        <path d="M150 30 L150 170" stroke="#3D8B7A" strokeWidth="1.5" opacity="0.5"/>
      </svg>
      <svg className="absolute" style={{bottom:"10%",left:"10%",width:"35%",height:"40%",transform:"rotate(60deg)",opacity:0.06,filter:"blur(25px)"}} viewBox="0 0 300 300" fill="none">
        <path d="M150 30 C200 30, 260 90, 270 160 C260 220, 200 260, 150 270 C100 260, 40 220, 30 160 C40 90, 100 30, 150 30Z" stroke="#3D8B7A" strokeWidth="2"/>
      </svg>
      <svg className="absolute" style={{top:"15%",right:"15%",width:"12%",height:"16%",transform:"rotate(45deg)",opacity:0.12,filter:"blur(6px)"}} viewBox="0 0 100 100" fill="none">
        <path d="M50 10 C65 10, 80 30, 82 50 C80 65, 65 80, 50 85 C35 80, 20 65, 18 50 C20 30, 35 10, 50 10Z" stroke="#3D8B7A" strokeWidth="1.2"/>
        <path d="M50 10 L50 55" stroke="#3D8B7A" strokeWidth="0.8" opacity="0.5"/>
      </svg>
      <svg className="absolute" style={{bottom:"25%",left:"20%",width:"10%",height:"14%",transform:"rotate(-30deg)",opacity:0.1,filter:"blur(5px)"}} viewBox="0 0 100 100" fill="none">
        <path d="M50 10 C65 10, 80 30, 82 50 C80 65, 65 80, 50 85 C35 80, 20 65, 18 50 C20 30, 35 10, 50 10Z" stroke="#3D8B7A" strokeWidth="1.2"/>
        <path d="M50 10 L50 55" stroke="#3D8B7A" strokeWidth="0.8" opacity="0.5"/>
      </svg>
      <svg className="absolute" style={{top:"60%",right:"5%",width:"8%",height:"20%",transform:"rotate(15deg)",opacity:0.09,filter:"blur(4px)"}} viewBox="0 0 60 120" fill="none">
        <path d="M30 5 C30 5, 20 40, 10 50" stroke="#3D8B7A" strokeWidth="1" strokeLinecap="round"/>
        <path d="M30 5 C30 5, 40 40, 50 50" stroke="#3D8B7A" strokeWidth="1" strokeLinecap="round"/>
        <path d="M25 20 C25 20, 15 45, 8 55" stroke="#3D8B7A" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
        <path d="M35 20 C35 20, 45 45, 52 55" stroke="#3D8B7A" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
        <path d="M30 5 L30 50" stroke="#3D8B7A" strokeWidth="0.8" opacity="0.4"/>
      </svg>
      <svg className="absolute" style={{bottom:"5%",right:"25%",width:"7%",height:"18%",transform:"rotate(-20deg)",opacity:0.08,filter:"blur(5px)"}} viewBox="0 0 60 120" fill="none">
        <path d="M30 5 C30 5, 20 40, 10 50" stroke="#3D8B7A" strokeWidth="1" strokeLinecap="round"/>
        <path d="M30 5 C30 5, 40 40, 50 50" stroke="#3D8B7A" strokeWidth="1" strokeLinecap="round"/>
        <path d="M28 15 C28 15, 18 45, 8 58" stroke="#3D8B7A" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
        <path d="M32 15 C32 15, 42 45, 52 58" stroke="#3D8B7A" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
        <path d="M30 5 L30 50" stroke="#3D8B7A" strokeWidth="0.8" opacity="0.4"/>
      </svg>

      {/* small crisp leaves */}
      <svg className="absolute" style={{top:"8%",left:"18%",width:28,height:20,opacity:0.2}} viewBox="0 0 60 40" fill="none">
        <path d="M10 30 Q30 5, 50 20 Q30 35, 10 30Z" stroke="#3D8B7A" strokeWidth="1.2"/>
        <path d="M10 30 L35 20" stroke="#3D8B7A" strokeWidth="0.6" opacity="0.5"/>
      </svg>
      <svg className="absolute" style={{top:"22%",right:"22%",width:22,height:16,opacity:0.18,transform:"rotate(120deg)"}} viewBox="0 0 60 40" fill="none">
        <path d="M10 30 Q30 5, 50 20 Q30 35, 10 30Z" stroke="#3D8B7A" strokeWidth="1"/>
      </svg>
      <svg className="absolute" style={{top:"40%",left:"12%",width:32,height:24,opacity:0.22,transform:"rotate(-40deg)"}} viewBox="0 0 60 40" fill="none">
        <path d="M10 30 Q30 5, 50 20 Q30 35, 10 30Z" stroke="#3D8B7A" strokeWidth="1.2"/>
        <path d="M10 30 L35 20" stroke="#3D8B7A" strokeWidth="0.6" opacity="0.5"/>
      </svg>
      <svg className="absolute" style={{top:"55%",right:"12%",width:26,height:18,opacity:0.2,transform:"rotate(80deg)"}} viewBox="0 0 60 40" fill="none">
        <path d="M10 30 Q30 5, 50 20 Q30 35, 10 30Z" stroke="#3D8B7A" strokeWidth="1"/>
        <path d="M10 25 Q20 15, 35 18" stroke="#3D8B7A" strokeWidth="0.6" opacity="0.4"/>
      </svg>
      <svg className="absolute" style={{top:"70%",left:"8%",width:20,height:14,opacity:0.16,transform:"rotate(160deg)"}} viewBox="0 0 60 40" fill="none">
        <path d="M10 30 Q30 5, 50 20 Q30 35, 10 30Z" stroke="#3D8B7A" strokeWidth="1"/>
      </svg>
      <svg className="absolute" style={{top:"85%",right:"18%",width:30,height:22,opacity:0.2,transform:"rotate(-70deg)"}} viewBox="0 0 60 40" fill="none">
        <path d="M10 30 Q30 5, 50 20 Q30 35, 10 30Z" stroke="#3D8B7A" strokeWidth="1.2"/>
        <path d="M10 30 L35 20" stroke="#3D8B7A" strokeWidth="0.6" opacity="0.5"/>
      </svg>
      <svg className="absolute" style={{top:"12%",left:"55%",width:18,height:13,opacity:0.15,transform:"rotate(30deg)"}} viewBox="0 0 60 40" fill="none">
        <ellipse cx="30" cy="20" rx="20" ry="12" stroke="#3D8B7A" strokeWidth="1"/>
        <path d="M30 8 L30 32" stroke="#3D8B7A" strokeWidth="0.5" opacity="0.4"/>
      </svg>
      <svg className="absolute" style={{top:"75%",left:"35%",width:24,height:17,opacity:0.18,transform:"rotate(-110deg)"}} viewBox="0 0 60 40" fill="none">
        <ellipse cx="30" cy="20" rx="20" ry="12" stroke="#3D8B7A" strokeWidth="1"/>
        <path d="M30 8 L30 32" stroke="#3D8B7A" strokeWidth="0.5" opacity="0.4"/>
      </svg>
      <svg className="absolute" style={{top:"35%",left:"40%",width:16,height:12,opacity:0.12,transform:"rotate(55deg)"}} viewBox="0 0 60 40" fill="none">
        <path d="M10 30 Q30 5, 50 20 Q30 35, 10 30Z" stroke="#3D8B7A" strokeWidth="0.8"/>
      </svg>
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
  const bgColor = themeConfig?.bgLoading || BG_DEFAULT;
  const bgGradient = themeConfig?.bg || BG_DEFAULT;

  const activeGroupConfig = activeGroup === "all" ? null : getGroupByLabel(activeGroup);

  const handleGroupChange = useCallback((g: string) => {
    setActiveGroup(g);
    setActiveSub("all");
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

  const parentGroups = useMemo(() => {
    return MENU_GROUPS.filter((g) =>
      g.children.some((child) => categories.some((c) => c.name === child))
    );
  }, [categories]);

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
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10">
            <UtensilsCrossed className="w-8 h-8 text-white/30" />
          </div>
          <h1 className="text-xl font-bold text-white/60" style={{ fontFamily: "var(--font-cairo), sans-serif" }}>غير موجود</h1>
          <p className="text-sm text-white/40" style={{ fontFamily: "var(--font-cairo), sans-serif" }}>المنيو غير موجود أو تم حذفه</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ background: bgGradient }}>
      {isTreeTheme && <LeafDecorations />}
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
                <div className="w-[68px] h-[68px] md:w-20 md:h-20 rounded-full overflow-hidden border border-white/10" style={{ boxShadow: `0 0 30px ${accent}33` }}>
                  <Image src={menu.logo} alt={menu.name} width={80} height={80} priority className="w-full h-full object-cover" />
                </div>
              </motion.div>
            )}
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              {menu.name}
            </h1>
            <div className="mt-2 flex items-center justify-center gap-3">
              <div className="h-px w-10 bg-white/10" />
              <span className="text-sm md:text-base font-black tracking-[0.25em] uppercase" style={{ color: accent }}>
                Menu
              </span>
              <div className="h-px w-10 bg-white/10" />
            </div>
          </motion.div>

          {/* Parent Category Tabs — hidden when carousel is showing */}
          {(!isTreeTheme || activeGroup !== "all") && parentGroups.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <ParentTabs groups={parentGroups} activeGroup={activeGroup} onGroupChange={handleGroupChange} accent={accent} />
            </motion.div>
          )}

          {/* Sub-category Tabs */}
          {activeGroup !== "all" && availableSubs.length > 1 && (
            <motion.div
              key={activeGroup}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SubCategoryTabs subCategories={availableSubs} activeSub={activeSub} onSubChange={setActiveSub} accent={accent} />
            </motion.div>
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
                style={{ color: accent, fontFamily: "var(--font-cairo), var(--font-outfit), sans-serif" }}
              >
                {activeGroupConfig.icon && <span className="ml-2">{activeGroupConfig.icon}</span>}
                {activeGroupConfig.label}
              </h2>
              <div className="h-[2px] w-10 mt-1 rounded-full" style={{ backgroundColor: accent }} />
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
                <p className="text-xs tracking-[0.2em] uppercase font-semibold" style={{ color: `${accent}99` }}>
                  اختر قسمك
                </p>
                <div className="h-px w-8 mx-auto mt-2 rounded-full" style={{ backgroundColor: `${accent}33` }} />
              </div>
              <TreeCarousel groups={parentGroups} onGroupChange={handleGroupChange} />
            </motion.div>
          ) : (
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
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10">
                      <ShoppingBag className="w-8 h-8 text-white/20" />
                    </div>
                    <p className="text-sm font-medium text-white/40" style={{ fontFamily: "var(--font-cairo), sans-serif" }}>
                      لا توجد أصناف في هذا القسم
                    </p>
                  </motion.div>
                )}

                {groupedBySub.map((group) => (
                  <div key={group.name}>
                    <motion.div
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="mb-4 pb-2 border-b border-white/10"
                    >
                      <h3
                        className="text-sm md:text-base font-bold tracking-wide"
                        style={{ color: accent, fontFamily: "var(--font-cairo), var(--font-outfit), sans-serif" }}
                      >
                        {activeGroup === "all" ? getBadgeText(group.name) : group.name}
                      </h3>
                    </motion.div>
                    <div className="space-y-4 md:space-y-5">
                      {group.items.map((item, i) => (
                        <MenuItemRow key={`${item.name}-${item.size || ""}-${i}`} item={item} index={i} accent={accent} />
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Footer */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-12 md:mt-16 pb-6">
            <div className="h-px max-w-xs mx-auto mb-5 bg-white/10" />
            <div className="flex items-center justify-center gap-4">
              <button onClick={shareMenu} className="flex items-center gap-1.5 text-[10px] tracking-wider text-white/40 hover:text-white/70 transition-colors">
                <Share2 className="w-3 h-3" />مشاركة
              </button>
              <span className="text-[10px] tracking-widest text-white/25">
                مدعوم من{" "}
                <a href="https://gotap.vercel.app/ar" target="_blank" rel="noopener noreferrer" className="hover:underline font-medium transition-opacity" style={{ color: accent }}>GoTap</a>
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
            style={{ backgroundColor: `${accent}20`, border: `1px solid ${accent}40`, boxShadow: `0 0 20px ${accent}20` }}
          >
            <ArrowUp className="w-5 h-5" style={{ color: accent }} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
