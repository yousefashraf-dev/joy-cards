export type ProductCategory = "clear_card" | "nfc_sticker" | "clear_medallion";
export type ProductColor = "silver" | "black" | "transparent" | "white";
export type CatalogServiceType = "product" | "restaurant_menu";
export type CatalogOrderType = "shipping" | "pickup";
export type CatalogOrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface DiscountTier {
  minQty: number;
  maxQty: number | null;
  discountPercent: number;
}

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface FeatureItem {
  ar: string;
  en: string;
}

export interface CatalogProduct {
  id: string;
  slug: string;
  name: LocalizedText;
  shortName: LocalizedText;
  description: LocalizedText;
  tagline: LocalizedText;
  base_price: number;
  category: ProductCategory;
  features: FeatureItem[];
  images: string[];
  colorImages?: Partial<Record<ProductColor, string>>;
  available_colors: ProductColor[] | null;
  discount_tiers: DiscountTier[];
  active: boolean;
  order_index: number;
}

export const CATEGORY_ORDER: ProductCategory[] = ["clear_card", "nfc_sticker", "clear_medallion"];

export function categoryHasColors(category: ProductCategory): boolean {
  return category === "clear_card" || category === "clear_medallion";
}

export const PRODUCT_COLORS: { id: ProductColor; hex: string }[] = [
  { id: "silver", hex: "#C0C0C0" },
  { id: "black", hex: "#1A1A1A" },
  { id: "transparent", hex: "transparent" },
  { id: "white", hex: "#FFFFFF" },
];