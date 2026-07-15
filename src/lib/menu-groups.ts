export interface MenuGroup {
  label: string;
  labelEn: string;
  icon?: string;
  children: string[];
}

export const MENU_GROUPS: MenuGroup[] = [
  {
    label: "سوشي",
    labelEn: "SUSHI",
    icon: "🍣",
    children: [
      "NIGIRI",
      "SASHIMI",
      "SPECIAL URA",
      "HOSOMAKI",
      "HOT ROLL",
      "ORAMAKI",
      "TEMAKI",
      "DYNAMITE ROLL",
      "COMBO SITION",
    ],
  },
  {
    label: "أطباق آسيوية",
    labelEn: "ASIAN KITCHEN",
    icon: "🥟",
    children: ["ASIAN APPETIZER", "ASIAN SOUP"],
  },
  {
    label: "مشروبات باردة",
    labelEn: "COLD DRINKS",
    icon: "🥤",
    children: [
      "MILK SHAKE",
      "FRAPPE",
      "FRAPPUCCINO",
      "TREE JUICES",
      "TREE SMOOTHIES",
      "TREE COCKTAILS",
      "ICE COFFEE",
      "ICE MATCHA",
      "BOBA",
      "SOFT DRINKS",
    ],
  },
  {
    label: "مشروبات ساخنة",
    labelEn: "HOT DRINKS",
    icon: "☕",
    children: ["TREE CLASSICS", "HOT DRINKS"],
  },
  {
    label: "مطبخ غربي",
    labelEn: "WESTERN FOOD",
    icon: "🍔",
    children: [
      "SALAD",
      "SOUP",
      "TREE APPETIZER",
      "PASTA",
      "PIZZA",
      "BEEF MEAL",
      "CHICKEN MEAL",
      "FAJITA",
      "FRIED CHICKEN",
      "QUESADILLA",
      "BURGER",
    ],
  },
  {
    label: "حلويات",
    labelEn: "DESSERTS",
    icon: "🍰",
    children: ["TREE DESSERT", "PANCAKE"],
  },
  {
    label: "إضافات وبن",
    labelEn: "EXTRAS & BEANS",
    icon: "🧋",
    children: ["EXTRAS", "TREE SPECIAL COFFEE"],
  },
];

export function getParentCategory(childCategory: string): string | null {
  for (const group of MENU_GROUPS) {
    if (group.children.includes(childCategory)) {
      return group.labelEn;
    }
  }
  return null;
}

export function getParentLabelEn(childCategory: string): string | null {
  for (const group of MENU_GROUPS) {
    if (group.children.includes(childCategory)) {
      return group.labelEn;
    }
  }
  return null;
}

export function getBadgeText(childCategory: string): string {
  for (const group of MENU_GROUPS) {
    if (group.children.includes(childCategory)) {
      return `${group.label} • ${childCategory}`;
    }
  }
  return childCategory;
}

export function getGroupByLabel(labelEn: string): MenuGroup | undefined {
  return MENU_GROUPS.find((g) => g.labelEn === labelEn);
}
