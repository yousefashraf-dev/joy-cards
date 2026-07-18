export type CafeTheme = "cafe" | "restaurant" | "cafe-restaurant" | "flowers" | "vape" | "standard" | "premium" | "tree";

export interface CafeThemeConfig {
  label: { ar: string; en: string };
  icon: string;
  bg: string;
  bgLoading: string;
  accent: string;
  ringOffset: string;
  decorationColor?: string;
  priceAccent?: string;
}

export const CAFE_THEMES: Record<CafeTheme, CafeThemeConfig> = {
  cafe: {
    label: { ar: "كافيه", en: "Cafe" },
    icon: "☕",
    bg: "linear-gradient(to bottom, #1A1A1A, #1A1A1A, #0D0D0D)",
    bgLoading: "#1A1A1A",
    accent: "#D4AF37",
    ringOffset: "#1A1A1A",
  },
  restaurant: {
    label: { ar: "مطعم", en: "Restaurant" },
    icon: "🍽️",
    bg: "linear-gradient(to bottom, #1C1510, #15100D, #0D0A08)",
    bgLoading: "#1C1510",
    accent: "#D4AF37",
    ringOffset: "#1C1510",
  },
  "cafe-restaurant": {
    label: { ar: "كافيه ومطعم", en: "Cafe & Restaurant" },
    icon: "☕🍽️",
    bg: "linear-gradient(to bottom, #0A0A0C, #08080A, #040406)",
    bgLoading: "#0A0A0C",
    accent: "#C4956A",
    ringOffset: "#0A0A0C",
    decorationColor: "#FFFFFF",
  },
  flowers: {
    label: { ar: "ورد", en: "Flowers" },
    icon: "🌹",
    bg: "linear-gradient(to bottom, #0D0A0A, #140A0A, #0D0505)",
    bgLoading: "#0D0A0A",
    accent: "#D4AF37",
    ringOffset: "#0D0A0A",
  },
  vape: {
    label: { ar: "فيب", en: "Vape" },
    icon: "💨",
    bg: "linear-gradient(to bottom, #0A0A0A, #0D0D0D, #050505)",
    bgLoading: "#0A0A0A",
    accent: "#FFFFFF",
    ringOffset: "#0A0A0A",
  },
  standard: {
    label: { ar: "ستاندرد", en: "Standard" },
    icon: "💼",
    bg: "linear-gradient(to bottom, #111827, #0f172a, #030712)",
    bgLoading: "#0f172a",
    accent: "#cbd5e1",
    ringOffset: "#0f172a",
  },
  premium: {
    label: { ar: "بريميم", en: "Premium" },
    icon: "💎",
    bg: "linear-gradient(to bottom, #0F0D0A, #0C0A08, #060504)",
    bgLoading: "#0F0D0A",
    accent: "#D4985C",
    ringOffset: "#0F0D0A",
    decorationColor: "#D4985C",
  },
  tree: {
    label: { ar: "غابة", en: "Tree" },
    icon: "🌳",
    bg: "linear-gradient(to bottom, #1A0F0A, #1E110B, #140B07)",
    bgLoading: "#1A0F0A",
    accent: "#E5C158",
    ringOffset: "#1A0F0A",
    decorationColor: "#E5C158",
    priceAccent: "#4CAF50",
  },
};
