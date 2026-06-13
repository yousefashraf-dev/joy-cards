"use client";

import { useTranslations } from "next-intl";
import { SOCIAL_PLATFORMS } from "@/lib/constants";
import { formatSocialLink, type Platform } from "@/lib/formatSocialLink";
import { Camera, ThumbsUp, Music2, MessageCircle, Phone, Ghost } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Instagram: Camera,
  Facebook: ThumbsUp,
  TikTok: Music2,
  Snapchat: Ghost,
  MessageCircle,
  Phone,
};

interface SocialLinksBlockProps {
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
  errors: Record<string, string>;
}

export default function SocialLinksBlock({ values, onChange, errors }: SocialLinksBlockProps) {
  const t = useTranslations("products.forms");

  return (
    <div>
      <p className="text-xs text-nardo/80 mb-3 italic">{t("socialHelperText")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SOCIAL_PLATFORMS.map((platform) => {
          const Icon = iconMap[platform.icon] || Camera;
          return (
            <div key={platform.id}>
              <label className="flex items-center gap-2 text-sm text-slate-muted mb-1.5">
                <Icon className="w-4 h-4" />
                <span>{t(`fields.${platform.id}`)}</span>
                <span className="text-xs text-slate-muted/50">(Optional)</span>
              </label>
              <input
                type="text"
                value={values[platform.id] || ""}
                onChange={(e) => onChange(platform.id, e.target.value)}
                onBlur={() => {
                  const formatted = formatSocialLink(
                    values[platform.id] || "",
                    platform.id as Platform
                  );
                  if (formatted && formatted !== values[platform.id]) {
                    onChange(platform.id, formatted);
                  }
                }}
                placeholder={t(`fields.${platform.id}`)}
                className="w-full px-4 py-2.5 rounded-lg glass bg-dark-card border border-white/10 text-slate-light text-sm placeholder:text-slate-muted/40 focus:outline-none focus:border-nardo/50 focus:ring-1 focus:ring-nardo/20 transition-all duration-200"
              />
              {errors[platform.id] && (
                <p className="text-red-400 text-xs mt-1">{errors[platform.id]}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
