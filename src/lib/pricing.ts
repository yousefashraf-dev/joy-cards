import { PRICES } from "./constants";

const CUSTOM_PRINT_FEE = 50;

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

export function calcBasePrice(profileType: "single" | "multiple"): number {
  const base = profileType === "single" ? PRICES.SINGLE_USER : PRICES.MULTIPLE_USERS;
  return base + CUSTOM_PRINT_FEE;
}

export function calcTotal(profileType: "single" | "multiple", address: string): {
  basePrice: number;
  shippingFee: number;
  total: number;
} {
  const basePrice = calcBasePrice(profileType);
  const shippingFee = calcShippingFee(address);
  return { basePrice, shippingFee, total: basePrice + shippingFee };
}
