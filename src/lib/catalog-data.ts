import type { CatalogProduct, ProductColor } from "./catalog-schema";
import { DEFAULT_DISCOUNT_TIERS } from "./pricing";

const C = "/catalog";

export const LOCAL_CATALOG: CatalogProduct[] = [
  {
    id: "clear-card",
    slug: "clear-card",
    name: { ar: "قطعة أكريليك (استاند)", en: "Acrylic Stand Piece" },
    shortName: { ar: "قطعة أكريليك", en: "Acrylic Piece" },
    description: {
      ar: "قطعة أكليرك شفافة بتقف على مكتبك أو كاونتر محلك — استاند أنيق بشريحة NFC + طباعة حسب تصميمك. لمسة واحدة وتظهر بياناتك أو المنيو.",
      en: "A clear acrylic piece that stands on your desk or counter — an elegant stand powered by an NFC chip with custom printing. One tap reveals your info or menu.",
    },
    tagline: { ar: "استاند كاونتر أنيق بلمسة ذكية", en: "An elegant counter stand with a smart touch" },
    base_price: 350,
    category: "clear_card",
    features: [
      { ar: "استاند/قطعة أكليرك شفافة بتقف وحدها", en: "A free-standing clear acrylic stand piece" },
      { ar: "شريحة NFC + QR في نفس القطعة", en: "NFC chip + QR code on the same piece" },
      { ar: "طباعة شعارك وتصميمك حسب طلبك", en: "Custom printed with your logo & design" },
      { ar: "مقاوم للماء", en: "Waterproof" },
      { ar: "لا يحتاج بطارية — لمسة وتفتح", en: "No battery needed — tap and go" },
    ],
    images: [
      `${C}/clear-stand.svg`,
      `${C}/clear-stand-silver.svg`,
      `${C}/clear-stand-black.svg`,
      `${C}/clear-stand-white.svg`,
    ],
    colorImages: {
      transparent: `${C}/clear-stand.svg`,
      silver: `${C}/clear-stand-silver.svg`,
      black: `${C}/clear-stand-black.svg`,
      white: `${C}/clear-stand-white.svg`,
    },
    available_colors: ["silver", "black", "transparent", "white"],
    discount_tiers: DEFAULT_DISCOUNT_TIERS,
    active: true,
    order_index: 1,
  },
  {
    id: "nfc-sticker",
    slug: "nfc-sticker",
    name: { ar: "استيكر NFC (لزق)", en: "NFC Sticker" },
    shortName: { ar: "استيكر NFC", en: "NFC Sticker" },
    description: {
      ar: "استيكر لزق فاخر مقاوم للماء، يحتوي على شريحة NFC + QR كود في نفس الوقت لأقصى توافق مع كل الأجهزة.",
      en: "A premium waterproof sticky NFC tag with both an NFC chip and QR code for maximum device compatibility.",
    },
    tagline: { ar: "أصغر تابل — على أي سطح", en: "The smallest tap — on any surface" },
    base_price: 250,
    category: "nfc_sticker",
    features: [
      { ar: "لزق فاخر مقاوم للماء", en: "Premium waterproof adhesive" },
      { ar: "شريحة NFC + QR كود معًا", en: "NFC chip + QR code together" },
      { ar: "لا يحتاج بطارية — لمسة وتفتح", en: "No battery needed — tap and go" },
      { ar: "يثبت على الموبايل، الكارنيه، أو أي سطح", en: "Sticks to phones, cards or any surface" },
      { ar: "يدعم كل أجهزة أندرويد وiOS الحديثة", en: "Works on modern Android & iOS devices" },
    ],
    images: [`${C}/nfc-sticker.svg`],
    colorImages: undefined,
    available_colors: null,
    discount_tiers: DEFAULT_DISCOUNT_TIERS,
    active: true,
    order_index: 2,
  },
  {
    id: "clear-medallion",
    slug: "clear-medallion",
    name: { ar: "ميدالية أكليرك (ماديلية)", en: "Clear Acrylic Medallion" },
    shortName: { ar: "الميدالية", en: "Medallion" },
    description: {
      ar: "ميدالية شفافة أنيقة (كيرينج/إكسسوار) مزوّدة بشريحة NFC، مثالية كهدية أو إكسسوار للمفاتيح والشنطة.",
      en: "An elegant clear acrylic keyring medallion powered by NFC — perfect as a gift or accessory for keys and bags.",
    },
    tagline: { ar: "إكسسوارك الفاخر بلمسة ذكية", en: "Your luxury accessory with a smart touch" },
    base_price: 200,
    category: "clear_medallion",
    features: [
      { ar: "ميدالية شفافة زجاجية أنيقة", en: "Elegant clear glassy medallion" },
      { ar: "شريحة NFC + QR مدمجة", en: "Built-in NFC chip + QR" },
      { ar: "شكل هدية فاخر للمفاتيح والشنطة", en: "A premium gift for keys & bags" },
      { ar: "لا يحتاج بطارية", en: "No battery needed" },
      { ar: "يعمل مع كل الموبايلات الحديثة", en: "Works with all modern phones" },
    ],
    images: [
      `${C}/clear-medallion.svg`,
      `${C}/clear-medallion-silver.svg`,
      `${C}/clear-medallion-black.svg`,
      `${C}/clear-medallion-white.svg`,
    ],
    colorImages: {
      transparent: `${C}/clear-medallion.svg`,
      silver: `${C}/clear-medallion-silver.svg`,
      black: `${C}/clear-medallion-black.svg`,
      white: `${C}/clear-medallion-white.svg`,
    },
    available_colors: ["silver", "black", "transparent", "white"],
    discount_tiers: DEFAULT_DISCOUNT_TIERS,
    active: true,
    order_index: 3,
  },
];

export const PRODUCTS_BY_ID = new Map(LOCAL_CATALOG.map((p) => [p.id, p]));

export function getShopProducts(products: CatalogProduct[]): CatalogProduct[] {
  return products
    .filter((p) => p.active)
    .sort((a, b) => a.order_index - b.order_index);
}

export function getColorName(color: ProductColor, locale: "ar" | "en"): string {
  const map: Record<ProductColor, { ar: string; en: string }> = {
    silver: { ar: "فضي", en: "Silver" },
    black: { ar: "أسود", en: "Black" },
    transparent: { ar: "شفاف", en: "Transparent" },
    white: { ar: "أبيض", en: "White" },
  };
  return map[color][locale] || map[color].ar;
}