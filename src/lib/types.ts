export type Theme =
  | "nardo-stealth"
  | "carbon-track"
  | "neon-drift"
  | "modern-bistro"
  | "luxury-lounge"
  | "cyber-cafe"
  | "classic-executive"
  | "minimal-glass"
  | "midnight-slate"
  | "neon-red-track"
  | "auto-nardo-stealth"
  | "cyber-cyan-drift"
  | "classic-royal-silver"
  | "liquid-aurora"
  | "terminal-dark-glow"
  | "energy-lightning"
  | "spiderman"
  | "batman"
  | "energy-power"
  | "game-of-thrones"
  | "stitch"
  | "batreq"
  | "yellow-pokemon";

export type ThemeArchetype = "dark-premium" | "neon-sporty" | "glass-clean";

export type ProductType = "digital-cards" | "auto-tap" | "business-tap";

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  snapchat?: string;
  whatsapp?: string;
  phoneSocial?: string;
}

export interface DigitalCardsFields {
  website?: string;
  googleMaps?: string;
  linkedin?: string;
  email?: string;
  pdfProfile?: string;
  customPrintDesign?: boolean;
}

export interface AutoTapFields {
  stickerType: "icon" | "username";
  selectedPlatform?: "instagram" | "tiktok" | "snapchat";
  logoWidthCm: string;
  orderNotes?: string;
  addressDetail: string;
  usernameValue?: string;
}

export interface AutoTapFormData {
  customerName: string;
  phone: string;
  addressDetail: string;
  orderNotes: string;
  stickerType: "icon" | "username";
  selectedPlatform: "instagram" | "tiktok" | "snapchat" | "";
  usernameValue: string;
  socialLinks: Record<string, string>;
  logo: string;
  logoWidthCm: string;
  displayName: string;
  theme: Theme;
}

export interface BusinessTapFields {
  establishmentName: string;
  quantity: number;
  menuLink?: string;
  googleReviews?: string;
  onlineOrdering?: string;
}

export interface OrderPayload {
  customerName: string;
  phone: string;
  governorate: string;
  city: string;
  street: string;
  theme: Theme;
  productType: ProductType;
  logo?: string;
  socialLinks: SocialLinks;
  displayName?: string;
  digitalCardsFields?: DigitalCardsFields;
  autoTapFields?: AutoTapFields;
  businessTapFields?: BusinessTapFields;
}

export interface Profile {
  id: string;
  name: string;
  displayName?: string;
  logo: string;
  theme: Theme;
  active: boolean;
  productType: ProductType;
  links: SocialLinks;
  digitalCardsFields?: DigitalCardsFields;
  autoTapFields?: AutoTapFields;
  businessTapFields?: BusinessTapFields;
  createdAt: number;
}

export interface ProfileButton {
  icon: string;
  url: string;
  label: string;
}
