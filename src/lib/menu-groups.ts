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
      "ASIAN APPETIZER",
      "ASIAN SOUP",
    ],
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
      "ASIAN APPETIZER",
      "ASIAN SOUP",
    ],
  },
  {
    label: "سلطة",
    labelEn: "SALAD",
    icon: "🥗",
    children: ["SALAD"],
  },
  {
    label: "شوربة",
    labelEn: "SOUP",
    icon: "🍜",
    children: ["SOUP"],
  },
  {
    label: "مقبلات",
    labelEn: "TREE APPETIZER",
    icon: "🥟",
    children: ["TREE APPETIZER"],
  },
  {
    label: "بيتزا",
    labelEn: "PIZZA",
    icon: "🍕",
    children: ["PIZZA"],
  },
  {
    label: "باستا",
    labelEn: "PASTA",
    icon: "🍝",
    children: ["PASTA"],
  },
  {
    label: "برجر",
    labelEn: "BURGER",
    icon: "🍔",
    children: ["BURGER"],
  },
  {
    label: "لحوم",
    labelEn: "BEEF MEAL",
    icon: "🥩",
    children: ["BEEF MEAL"],
  },
  {
    label: "دجاج",
    labelEn: "CHICKEN MEAL",
    icon: "🍗",
    children: ["CHICKEN MEAL"],
  },
  {
    label: "فاهيتا",
    labelEn: "FAJITA",
    icon: "🌮",
    children: ["FAJITA"],
  },
  {
    label: "دجاج مقلي",
    labelEn: "FRIED CHICKEN",
    icon: "🍗",
    children: ["FRIED CHICKEN"],
  },
  {
    label: "كويساديلا",
    labelEn: "QUESADILLA",
    icon: "🫓",
    children: ["QUESADILLA"],
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
