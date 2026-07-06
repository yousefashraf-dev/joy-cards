"use client";

import { useTranslations } from "next-intl";
import type { Profile, ProfileButton, ThemeArchetype } from "@/lib/types";
import { formatSocialLink } from "@/lib/formatSocialLink";
import ClassicLuxuryProfile from "./ClassicLuxuryProfile";
import SportyCarbonProfile from "./SportyCarbonProfile";
import MinimalistCleanProfile from "./MinimalistCleanProfile";
import CyberCyanDriftProfile from "./CyberCyanDriftProfile";
import NeonRedTrackProfile from "./NeonRedTrackProfile";
import NardoStealthProfile from "./NardoStealthProfile";
import ClassicRoyalSilverProfile from "./ClassicRoyalSilverProfile";
import LiquidAuroraProfile from "./LiquidAuroraProfile";
import TerminalDarkGlowProfile from "./TerminalDarkGlowProfile";
import EnergyLightningProfile from "./EnergyLightningProfile";
import BatmanProfile from "./BatmanProfile";
import SpidermanProfile from "./SpidermanProfile";
import EnergyPowerProfile from "./EnergyPowerProfile";
import YellowPokemonProfile from "./YellowPokemonProfile";
import GameOfThronesProfile from "./GameOfThronesProfile";
import BatreqProfile from "./BatreqProfile";
import StitchProfile from "./StitchProfile";
import { CldImage } from "next-cloudinary";
import { THEME_ARCHETYPE } from "@/lib/constants";
import {
  Camera, ThumbsUp, Music2, Ghost, MessageCircle, Phone, Send,
  Globe, MapPin, Briefcase, Mail, FileText, Utensils, Star, ShoppingCart,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Instagram: Camera,
  Facebook: ThumbsUp,
  TikTok: Music2,
  Snapchat: Ghost,
  Telegram: Send,
  MessageCircle,
  Phone,
  Globe,
  MapPin,
  Linkedin: Briefcase,
  Mail,
  FileText,
  Utensils,
  Star,
  ShoppingCart,
};

function ensureUrl(url: string, isEmail = false): string {
  if (!url) return url;
  if (isEmail && url.includes("@")) {
    if (!url.startsWith("mailto:")) return `mailto:${url}`;
    return url;
  }
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return url;
  }
  if (url.includes("@")) return `mailto:${url}`;
  return `https://${url}`;
}

function getArchetype(theme: string): ThemeArchetype {
  return THEME_ARCHETYPE[theme] || "dark-premium";
}

interface ProfileWrapperProps {
  profile: Profile;
}

function buildButtons(profile: Profile, pl: (key: string) => string): ProfileButton[] {
  const buttons: ProfileButton[] = [];
  const l = profile.links || {};

  if (l.instagram)    buttons.push({ icon: "Instagram", url: formatSocialLink(l.instagram, "instagram"), label: "Instagram" });
  if (l.tiktok)       buttons.push({ icon: "TikTok", url: formatSocialLink(l.tiktok, "tiktok"), label: "TikTok" });
  if (l.facebook) {
    let fbUrl = l.facebook.trim();
    if (/^https?:\/\/([a-z0-9-]+\.)?(facebook\.com|fb\.watch)\//i.test(fbUrl)) {
      fbUrl = fbUrl.replace(/\?.*$/, "");
    } else {
      fbUrl = `https://www.facebook.com/${fbUrl.replace(/^https?:\/\//, "").replace(/^www\./, "")}`;
    }
    buttons.push({ icon: "Facebook", url: fbUrl, label: "Facebook" });
  }
  if (l.snapchat)     buttons.push({ icon: "Snapchat", url: formatSocialLink(l.snapchat, "snapchat"), label: "Snapchat" });
  if (l.telegram)     buttons.push({ icon: "Telegram", url: formatSocialLink(l.telegram, "telegram"), label: "Telegram" });
  if (l.phoneSocial)  buttons.push({ icon: "Phone", url: formatSocialLink(l.phoneSocial, "phoneSocial"), label: "Call" });
  if (l.whatsapp)     buttons.push({ icon: "MessageCircle", url: formatSocialLink(l.whatsapp, "whatsapp"), label: "WhatsApp" });

  const dc = profile.digitalCardsFields;
  if (dc) {
    if (dc.website)    buttons.push({ icon: "Globe", url: ensureUrl(dc.website), label: pl("website") });
    if (dc.googleMaps) buttons.push({ icon: "MapPin", url: ensureUrl(dc.googleMaps), label: pl("location") });
    if (dc.linkedin)   buttons.push({ icon: "Linkedin", url: ensureUrl(dc.linkedin), label: pl("linkedin") });
    if (dc.email)      buttons.push({ icon: "Mail", url: ensureUrl(dc.email, true), label: pl("email") });
    if (dc.pdfProfile) buttons.push({ icon: "FileText", url: ensureUrl(dc.pdfProfile), label: pl("companyProfile") });
  }

  const bt = profile.businessTapFields;
  if (bt) {
    if (bt.menuLink)         buttons.push({ icon: "Utensils", url: ensureUrl(bt.menuLink), label: pl("digitalMenu") });
    if (bt.googleReviews)    buttons.push({ icon: "Star", url: ensureUrl(bt.googleReviews), label: pl("googleReviews") });
    if (bt.onlineOrdering)   buttons.push({ icon: "ShoppingCart", url: ensureUrl(bt.onlineOrdering), label: pl("orderOnline") });
  }

  return buttons;
}

export default function ProfileWrapper({ profile }: ProfileWrapperProps) {
  const pl = useTranslations("products.profile.labels");
  const buttons = buildButtons(profile, pl);
  const archetype = getArchetype(profile.theme);

  const displayName = profile.displayName?.trim()
    || profile.name.split(' ')[0]
    || profile.name;

  const renderLogo = () => {
    if (!profile.logo) {
      return (
        <div className="w-28 h-28 rounded-full bg-dark-card border-2 border-white/10 flex items-center justify-center">
          <span className="text-3xl font-bold text-slate-muted">
            {displayName?.charAt(0)?.toUpperCase() || "?"}
          </span>
        </div>
      );
    }

    if (profile.logo.includes("cloudinary")) {
      return (
        <CldImage
          src={profile.logo}
          alt={displayName}
          width={120}
          height={120}
          crop="fill"
          gravity="auto"
          className="w-28 h-28 rounded-full object-cover border-2"
        />
      );
    }

    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={profile.logo}
        alt={displayName}
        className="w-28 h-28 rounded-full object-cover border-2"
      />
    );
  };

  const sharedProps = {
    name: displayName,
    logo: renderLogo(),
    buttons,
    iconMap,
  };

  // Auto-Tap themes: render the exact preview design
  if (profile.theme === "cyber-cyan-drift") return <CyberCyanDriftProfile {...sharedProps} />;
  if (profile.theme === "neon-red-track") return <NeonRedTrackProfile {...sharedProps} />;
  if (profile.theme === "auto-nardo-stealth") return <NardoStealthProfile {...sharedProps} />;
  if (profile.theme === "classic-royal-silver") return <ClassicRoyalSilverProfile {...sharedProps} />;
  if (profile.theme === "liquid-aurora") return <LiquidAuroraProfile {...sharedProps} />;
  if (profile.theme === "terminal-dark-glow") return <TerminalDarkGlowProfile {...sharedProps} />;
  if (profile.theme === "energy-lightning") return <EnergyLightningProfile {...sharedProps} />;
  if (profile.theme === "spiderman") return <SpidermanProfile {...sharedProps} />;
  if (profile.theme === "batman") return <BatmanProfile {...sharedProps} />;
  if (profile.theme === "energy-power") return <EnergyPowerProfile {...sharedProps} />;
  if (profile.theme === "game-of-thrones") return <GameOfThronesProfile {...sharedProps} />;
  if (profile.theme === "stitch") return <StitchProfile {...sharedProps} />;
  if (profile.theme === "batreq") return <BatreqProfile {...sharedProps} />;
  if (profile.theme === "yellow-pokemon") return <YellowPokemonProfile {...sharedProps} />;

  // Non-Auto-Tap themes: use archetype-based rendering
  switch (archetype) {
    case "neon-sporty":
      return <SportyCarbonProfile {...sharedProps} />;
    case "glass-clean":
      return <MinimalistCleanProfile {...sharedProps} />;
    case "dark-premium":
    default:
      return <ClassicLuxuryProfile {...sharedProps} />;
  }
}
