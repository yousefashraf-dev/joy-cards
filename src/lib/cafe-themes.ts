export type CafeTheme = "cafe" | "restaurant" | "flowers" | "vape" | "standard";

export interface CafeThemeConfig {
  label: { ar: string; en: string };
  icon: string;
  bg: string;
  bgLoading: string;
  accent: string;
  ringOffset: string;
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
};
