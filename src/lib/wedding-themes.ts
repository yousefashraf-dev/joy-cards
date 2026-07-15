export interface WeddingTheme {
  id: "champagne-rose" | "sage-emerald" | "navy-silver" | "blush-lilac";
  labelKey: string;
  accent: string;
  accentLight: string;
  bgColor: string;
  cardBg: string;
  sectionBg: string;
  textColor: string;
  mutedColor: string;
  lightColor: string;
  heroBg: string;
  countdownBg: string;
  heartIcon: string;
}

export const WEDDING_THEMES: WeddingTheme[] = [
  {
    id: "champagne-rose",
    labelKey: "weddingOrder.themes.champagneRose",
    accent: "#D4AF37",
    accentLight: "#f0d9b5",
    bgColor: "#FDF8F0",
    cardBg: "#FFFFFF",
    sectionBg: "#FFFCF8",
    textColor: "#3A2E28",
    mutedColor: "#6B5548",
    lightColor: "#9E8070",
    heroBg: "linear-gradient(160deg, #fdf5ee 0%, #f9ece8 30%, #f5e8f0 60%, #eef3ec 100%)",
    countdownBg: "linear-gradient(135deg, #3a2e28 0%, #4a3830 40%, #3d3028 100%)",
    heartIcon: "💗",
  },
  {
    id: "sage-emerald",
    labelKey: "weddingOrder.themes.sageEmerald",
    accent: "#2D6A4F",
    accentLight: "#8fa87e",
    bgColor: "#F0F7F4",
    cardBg: "#FFFFFF",
    sectionBg: "#F8FCF9",
    textColor: "#1A2E1A",
    mutedColor: "#4A6B50",
    lightColor: "#7A9E80",
    heroBg: "linear-gradient(160deg, #f0f7f0 0%, #e8f5ec 30%, #eef5e8 60%, #f0f7e8 100%)",
    countdownBg: "linear-gradient(135deg, #1a2e1a 0%, #2a4a30 40%, #1d3820 100%)",
    heartIcon: "💚",
  },
  {
    id: "navy-silver",
    labelKey: "weddingOrder.themes.navySilver",
    accent: "#E2E8F0",
    accentLight: "#94A3B8",
    bgColor: "#0F172A",
    cardBg: "#1E293B",
    sectionBg: "#1A2332",
    textColor: "#F1F5F9",
    mutedColor: "#94A3B8",
    lightColor: "#64748B",
    heroBg: "linear-gradient(160deg, #0f172a 0%, #1a2332 30%, #0f1a2e 60%, #0a1220 100%)",
    countdownBg: "linear-gradient(135deg, #070d1a 0%, #0f172a 40%, #050a14 100%)",
    heartIcon: "💙",
  },
  {
    id: "blush-lilac",
    labelKey: "weddingOrder.themes.blushLilac",
    accent: "#C084FC",
    accentLight: "#D8B4FE",
    bgColor: "#FAF5FF",
    cardBg: "#FFFFFF",
    sectionBg: "#FFFCFE",
    textColor: "#3A1E3A",
    mutedColor: "#7A5080",
    lightColor: "#A080B0",
    heroBg: "linear-gradient(160deg, #faf5ff 0%, #f5e8f8 30%, #f0e8f5 60%, #f8f0f5 100%)",
    countdownBg: "linear-gradient(135deg, #2a1a30 0%, #3a2a48 40%, #2a1a38 100%)",
    heartIcon: "💜",
  },
];

export function getWeddingTheme(id: string): WeddingTheme {
  return WEDDING_THEMES.find((t) => t.id === id) || WEDDING_THEMES[0];
}
