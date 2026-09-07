import { PRICES } from "./constants";
import type { DiscountTier } from "./catalog-schema";

export const DEFAULT_DISCOUNT_TIERS: DiscountTier[] = [
  { minQty: 1, maxQty: 9, discountPercent: 0 },
  { minQty: 10, maxQty: 29, discountPercent: 10 },
  { minQty: 30, maxQty: null, discountPercent: 20 },
];

export interface PriceBreakdown {
  unitPrice: number;
  discountPercent: number;
  total: number;
  nextTier: DiscountTier | null;
}

export function calculatePrice(basePrice: number, qty: number, tiers: DiscountTier[] = DEFAULT_DISCOUNT_TIERS): PriceBreakdown {
  const tier =
    tiers.find((t) => qty >= t.minQty && (t.maxQty === null || qty <= t.maxQty)) || tiers[0];
  const unitPrice = Math.round(basePrice * (1 - tier.discountPercent / 100));
  const total = Math.round(unitPrice * qty);
  const nextTier = tiers.find((t) => t.minQty > qty) ?? null;
  return { unitPrice, discountPercent: tier.discountPercent, total, nextTier };
}

export const GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "القليوبية",
  "الشرقية",
  "الدقهلية",
  "الغربية",
  "المنوفية",
  "البحيرة",
  "كفر الشيخ",
  "دمياط",
  "بورسعيد",
  "الإسماعيلية",
  "السويس",
  "شمال سيناء",
  "جنوب سيناء",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
  "البحر الأحمر",
  "الوادي الجديد",
  "مطروح",
] as const;

const REMOTE_KEYWORDS = [
  "الصعيد", "صعيد",
  "دمياط",
  "السويس", "سويس",
  "شرم الشيخ",
  "العلمين",
  "الساحل", "الساحل الشمالي",
  "الغردقة", "غردقة",
  "الأقصر", "اقصر",
  "أسوان", "اسوان",
  "الوادي الجديد",
  "البحر الأحمر", "البحر الاحمر",
  "مرسى مطروح", "مطروح",
];

export function calcShippingFee(address: string): number {
  const lower = address.trim();
  if (!lower) return PRICES.SHIPPING_CAIRO;
  const isRemote = REMOTE_KEYWORDS.some((kw) => lower.includes(kw));
  return isRemote ? PRICES.SHIPPING_UPPER_EGYPT : PRICES.SHIPPING_CAIRO;
}

export const BASE_PRICE = 200;

export function calcTotal(address: string): {
  basePrice: number;
  shippingFee: number;
  total: number;
} {
  const shippingFee = calcShippingFee(address);
  return { basePrice: BASE_PRICE, shippingFee, total: BASE_PRICE + shippingFee };
}
