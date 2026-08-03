export interface MenuCategory {
  name: string;
  icon: string;
}

const CATEGORY_ICON_MAP: Record<string, string> = {
  "فراخ": "🍗",
  "لحوم": "🥩",
  "خفيفة": "🥟",
  "ميكسات": "🍱",
  "ساندوتش": "🥪",
  "سوري": "🌯",
  "إضافات": "🧀",
  "new mix": "🌟",
  "كريب": "🥞",
  "كريبات": "🥞",
  "سلطة": "🥗", salad: "🥗",
  "مشروبات ساخنة": "☕", "مشروبات ساخنه": "☕", "hot drinks": "☕", coffee: "☕", قهوة: "☕", شاي: "🍵",
  "مشروبات باردة": "🥤", "مشروبات بارده": "🥤", "cold drinks": "🥤", juice: "🧃", عصير: "🧃", عصائر: "🧃",
  بيتزا: "🍕", pizza: "🍕",
  برجر: "🍔", burger: "🍔",
  سوشي: "🍣", sushi: "🍣",
  حلويات: "🍰", sweets: "🍰", dessert: "🍰", "آيس كريم": "🍦",
  شوربة: "🍜", soup: "🍜",
  باستا: "🍝", pasta: "🍝",
  مقبلات: "🥓", appetizer: "🥓", starters: "🥓",
  steak: "🥩",
  مشاوي: "🍖", grill: "🍖",
  فطار: "🍳", breakfast: "🍳", "وجبة فطار": "🍳",
  سموذي: "🥑", smoothie: "🥑",
  ميلك: "🥛", "ميلك شيك": "🥛",
  دونات: "🍩", donut: "🍩",
  مخبوزات: "🥨", bakery: "🥨", خبز: "🍞",
  سمك: "🐟", fish: "🐟", seafood: "🦐",
  دجاج: "🍗", chicken: "🍗",
  "وجبات أطفال": "👶", kids: "👶",
};

export function resolveCategoryIcon(name: string): string {
  const lower = (name || "").trim().toLowerCase();
  if (!lower) return "";
  for (const [key, emoji] of Object.entries(CATEGORY_ICON_MAP)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return emoji;
    }
  }
  return "";
}

export function normalizeCategories(cats: unknown): MenuCategory[] {
  if (!Array.isArray(cats)) return [];
  if (cats.length === 0) return [];
  if (typeof cats[0] === "string") {
    return (cats as string[]).map((name) => {
      const trimmed = name.trim();
      return { name: trimmed, icon: resolveCategoryIcon(trimmed) };
    });
  }
  return (cats as { name?: string; icon?: string }[]).map((c) => {
    const name = (c.name || "").trim();
    const icon = (c.icon || "").trim();
    return { name, icon: icon || resolveCategoryIcon(name) };
  });
}
