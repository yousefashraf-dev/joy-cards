export type Platform =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "snapchat"
  | "whatsapp"
  | "phoneSocial"
  | "linkedin"
  | "website"
  | "maps"
  | "email"
  | "menu"
  | "reviews"
  | "ordering";

const PLATFORM_CONFIG: Record<Platform, { prefix?: string; transform?: (input: string) => string }> = {
  instagram: { prefix: "https://instagram.com/" },
  facebook: { prefix: "https://facebook.com/" },
  tiktok: { prefix: "https://tiktok.com/@" },
  snapchat: { prefix: "https://snapchat.com/add/" },
  whatsapp: { prefix: "https://wa.me/", transform: (input) => input.replace(/[^0-9]/g, "") },
  phoneSocial: { prefix: "tel:+", transform: (input) => input.replace(/[^0-9]/g, "") },
  linkedin: { prefix: "https://linkedin.com/company/" },
  website: { prefix: "https://", transform: (input) => input.replace(/^https?:\/\//, "") },
  maps: { prefix: "" },
  email: { prefix: "mailto:" },
  menu: { prefix: "https://", transform: (input) => input.replace(/^https?:\/\//, "") },
  reviews: { prefix: "" },
  ordering: { prefix: "https://", transform: (input) => input.replace(/^https?:\/\//, "") },
};

export function formatSocialLink(input: string, platform: Platform): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  if (platform === "email") {
    if (trimmed.includes("@")) return `mailto:${trimmed}`;
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const config = PLATFORM_CONFIG[platform];
  if (!config) return trimmed;

  let value = trimmed;
  if (config.transform) {
    value = config.transform(trimmed);
    if (!value) return "";
  }

  if (config.prefix && !value.startsWith(config.prefix)) {
    return `${config.prefix}${value}`;
  }

  if (!config.prefix) return value;

  return value;
}

export function getSocialHelperText(): string {
  return "Please add your profile links or usernames directly, the system will format and verify them.";
}
