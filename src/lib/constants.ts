import type { Theme, ThemeArchetype, ProductType } from "./types";

export const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL || "https://script.google.com/macros/s/AKfycbw-PmI1T_L_Gogf_ikeY2W-bZslG7Z2_8mcvxsioGI8lCv6R6FWgHLmhw8l21Vtnelfpg/exec";

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201558599678";
export const WHATSAPP_ORDERS_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_ORDERS_NUMBER || "201095976766";

export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
export const WHATSAPP_ORDERS_LINK = `https://wa.me/${WHATSAPP_ORDERS_NUMBER}`;
export const WHATSAPP_BUSINESS_MSG = `https://wa.me/${WHATSAPP_ORDERS_NUMBER}?text=${encodeURIComponent("السلام عليكم جو تابل، كنت محتاج أستفسر عن خدمة الكافيهات والمطاعم")}`;
export const GAS_CAFE_URL = process.env.NEXT_PUBLIC_GAS_CAFE_URL || GAS_URL;

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://gotap.vercel.app";

export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dliaxor9r";

export const PRICES = {
  SINGLE_USER: 200,
  MULTIPLE_USERS: 200,
  LOGO_STICKER: 50,
  SHIPPING_CAIRO: 50,
  SHIPPING_GOVERNORATES: 50,
  SHIPPING_UPPER_EGYPT: 70,
  SHIPPING_COASTAL: 70,
  SHIPPING_DURATION: "2 - 3 days",
  DIGITAL_CARD_BASE: 150,
  DIGITAL_CARD_PRINT: 50,
};

export const PLATFORM_OPTIONS = [
  { id: "instagram", label: "Instagram", icon: "Instagram" },
  { id: "facebook", label: "Facebook", icon: "Facebook" },
  { id: "tiktok", label: "TikTok", icon: "TikTok" },
  { id: "snapchat", label: "Snapchat", icon: "Snapchat" },
  { id: "whatsapp", label: "WhatsApp", icon: "MessageCircle" },
  { id: "phoneSocial", label: "Phone", icon: "Phone" },
] as const;

export const SOCIAL_PLATFORMS = [
  { id: "instagram", labelKey: "forms.fields.instagram", icon: "Instagram", baseUrl: "https://instagram.com/" },
  { id: "facebook", labelKey: "forms.fields.facebook", icon: "Facebook", baseUrl: "https://facebook.com/" },
  { id: "tiktok", labelKey: "forms.fields.tiktok", icon: "TikTok", baseUrl: "https://tiktok.com/@" },
  { id: "snapchat", labelKey: "forms.fields.snapchat", icon: "Snapchat", baseUrl: "https://snapchat.com/add/" },
  { id: "whatsapp", labelKey: "forms.fields.whatsapp", icon: "MessageCircle", baseUrl: "https://wa.me/" },
  { id: "phoneSocial", labelKey: "forms.fields.phoneSocial", icon: "Phone", baseUrl: "tel:" },
] as const;

export interface ThemeConfig {
  id: Theme;
  icon: string;
  gradient: string;
  border: string;
  labelKey: string;
  descKey: string;
}

export const ALL_THEMES: ThemeConfig[] = [
  { id: "nardo-stealth", icon: "Shield", gradient: "from-[#1A1A1A] to-[#222222]", border: "border-nardo", labelKey: "forms.themeOptions.nardoStealth", descKey: "forms.themeOptions.nardoStealthDesc" },
  { id: "carbon-track", icon: "Flame", gradient: "carbon-fiber", border: "border-neon-green", labelKey: "forms.themeOptions.carbonTrack", descKey: "forms.themeOptions.carbonTrackDesc" },
  { id: "neon-drift", icon: "Zap", gradient: "from-[#0D0D0D] to-[#1A1A1A]", border: "border-slate-300", labelKey: "forms.themeOptions.neonDrift", descKey: "forms.themeOptions.neonDriftDesc" },
  { id: "modern-bistro", icon: "Crown", gradient: "from-[#1A1A1A] to-[#222222]", border: "border-nardo", labelKey: "forms.themeOptions.modernBistro", descKey: "forms.themeOptions.modernBistroDesc" },
  { id: "luxury-lounge", icon: "Flame", gradient: "carbon-fiber", border: "border-neon-green", labelKey: "forms.themeOptions.luxuryLounge", descKey: "forms.themeOptions.luxuryLoungeDesc" },
  { id: "cyber-cafe", icon: "Zap", gradient: "from-[#0D0D0D] to-[#1A1A1A]", border: "border-slate-300", labelKey: "forms.themeOptions.cyberCafe", descKey: "forms.themeOptions.cyberCafeDesc" },
  { id: "classic-executive", icon: "Shield", gradient: "from-[#1A1A1A] to-[#222222]", border: "border-nardo", labelKey: "forms.themeOptions.classicExecutive", descKey: "forms.themeOptions.classicExecutiveDesc" },
  { id: "minimal-glass", icon: "Flame", gradient: "carbon-fiber", border: "border-neon-green", labelKey: "forms.themeOptions.minimalGlass", descKey: "forms.themeOptions.minimalGlassDesc" },
  { id: "midnight-slate", icon: "Zap", gradient: "from-[#0D0D0D] to-[#1A1A1A]", border: "border-slate-300", labelKey: "forms.themeOptions.midnightSlate", descKey: "forms.themeOptions.midnightSlateDesc" },
  { id: "neon-red-track", icon: "Flame", gradient: "from-[#1A0000] to-[#2A0000]", border: "border-red-500", labelKey: "forms.themeOptions.neonRedTrack", descKey: "forms.themeOptions.neonRedTrackDesc" },
  { id: "auto-nardo-stealth", icon: "Shield", gradient: "from-[#1A1A1A] to-[#222222]", border: "border-nardo", labelKey: "forms.themeOptions.autoNardoStealth", descKey: "forms.themeOptions.autoNardoStealthDesc" },
  { id: "cyber-cyan-drift", icon: "Zap", gradient: "from-[#0D1A1A] to-[#001A1A]", border: "border-cyan", labelKey: "forms.themeOptions.cyberCyanDrift", descKey: "forms.themeOptions.cyberCyanDriftDesc" },
  { id: "classic-royal-silver", icon: "Crown", gradient: "from-[#1A1A1A] to-[#222222]", border: "border-silver", labelKey: "forms.themeOptions.classicRoyalSilver", descKey: "forms.themeOptions.classicRoyalSilverDesc" },
  { id: "liquid-aurora", icon: "Flame", gradient: "from-[#0D001A] to-[#001A1A]", border: "border-cyan", labelKey: "forms.themeOptions.liquidAurora", descKey: "forms.themeOptions.liquidAuroraDesc" },
  { id: "terminal-dark-glow", icon: "Terminal", gradient: "from-[#0A0A0F] to-[#0F172A]", border: "border-cyan", labelKey: "forms.themeOptions.terminalDarkGlow", descKey: "forms.themeOptions.terminalDarkGlowDesc" },
  { id: "energy-lightning", icon: "Zap", gradient: "from-[#0F0A00] to-[#1A0F00]", border: "border-yellow-500", labelKey: "forms.themeOptions.energyLightning", descKey: "forms.themeOptions.energyLightningDesc" },
  { id: "spiderman", icon: "Flame", gradient: "from-red-700 via-slate-900 to-blue-900", border: "border-red-500", labelKey: "forms.themeOptions.spiderman", descKey: "forms.themeOptions.spidermanDesc" },
  { id: "batman", icon: "Shield", gradient: "from-neutral-950 to-black", border: "border-yellow-400", labelKey: "forms.themeOptions.batman", descKey: "forms.themeOptions.batmanDesc" },
  { id: "energy-power", icon: "Zap", gradient: "from-[#0A1628] via-[#1B2A4A] to-[#2A1A1A]", border: "border-red-600/50", labelKey: "forms.themeOptions.energyPower", descKey: "forms.themeOptions.energyPowerDesc" },
  { id: "game-of-thrones", icon: "Crown", gradient: "from-[#1C1C1C] via-[#2A2A2A] to-[#1A1A1A]", border: "border-[#B0B0B0]/30", labelKey: "forms.themeOptions.gameOfThrones", descKey: "forms.themeOptions.gameOfThronesDesc" },
  { id: "stitch", icon: "Ghost", gradient: "from-[#0A1628] via-[#1A3A5C] to-[#0D2137]", border: "border-[#4A9BD9]/40", labelKey: "forms.themeOptions.stitch", descKey: "forms.themeOptions.stitchDesc" },
  { id: "batreq", icon: "Ghost", gradient: "from-black via-[#1A1A1A] to-[#0D0D0D]", border: "border-[#E8E8E8]/30", labelKey: "forms.themeOptions.batreq", descKey: "forms.themeOptions.batreqDesc" },
  { id: "yellow-pokemon", icon: "Zap", gradient: "from-[#FFD700] via-[#FFA500] to-[#FF8C00]", border: "border-[#2D2D2D]/40", labelKey: "forms.themeOptions.yellowPokemon", descKey: "forms.themeOptions.yellowPokemonDesc" },
];

export const PRODUCT_THEMES: Record<ProductType, Theme[]> = {
  "auto-tap": ["batman", "spiderman", "energy-power", "game-of-thrones", "stitch", "batreq", "yellow-pokemon", "cyber-cyan-drift", "terminal-dark-glow"],
  "business-tap": ["modern-bistro", "luxury-lounge", "cyber-cafe"],
  "digital-cards": ["classic-executive", "minimal-glass", "midnight-slate"],
};

export const THEME_ARCHETYPE: Record<string, ThemeArchetype> = {
  "classic-luxury": "dark-premium",
  "sporty-carbon": "neon-sporty",
  "minimalist-clean": "glass-clean",
  "nardo-stealth": "dark-premium",
  "carbon-track": "neon-sporty",
  "neon-drift": "glass-clean",
  "modern-bistro": "dark-premium",
  "luxury-lounge": "neon-sporty",
  "cyber-cafe": "glass-clean",
  "classic-executive": "dark-premium",
  "minimal-glass": "neon-sporty",
  "midnight-slate": "glass-clean",
  "neon-red-track": "neon-sporty",
  "auto-nardo-stealth": "dark-premium",
  "cyber-cyan-drift": "glass-clean",
  "classic-royal-silver": "dark-premium",
  "liquid-aurora": "neon-sporty",
  "terminal-dark-glow": "dark-premium",
  "energy-lightning": "neon-sporty",
  "spiderman": "neon-sporty",
  "batman": "dark-premium",
  "energy-power": "neon-sporty",
  "game-of-thrones": "dark-premium",
  "stitch": "glass-clean",
  "batreq": "dark-premium",
  "yellow-pokemon": "neon-sporty",
};
