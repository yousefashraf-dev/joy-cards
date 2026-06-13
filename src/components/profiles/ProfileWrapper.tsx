"use client";

import type { Profile, ProfileButton, ThemeArchetype } from "@/lib/types";
import ClassicLuxuryProfile from "./ClassicLuxuryProfile";
import SportyCarbonProfile from "./SportyCarbonProfile";
import MinimalistCleanProfile from "./MinimalistCleanProfile";
import CyberCyanDriftProfile from "./CyberCyanDriftProfile";
import NeonRedTrackProfile from "./NeonRedTrackProfile";
import NardoStealthProfile from "./NardoStealthProfile";
import ClassicRoyalSilverProfile from "./ClassicRoyalSilverProfile";
import LiquidAuroraProfile from "./LiquidAuroraProfile";
import TerminalDarkGlowProfile from "./TerminalDarkGlowProfile";
import { CldImage } from "next-cloudinary";
import { THEME_ARCHETYPE } from "@/lib/constants";
import {
  Camera, ThumbsUp, Music2, Ghost, MessageCircle, Phone,
  Globe, MapPin, Briefcase, Mail, FileText, Utensils, Star, ShoppingCart,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Instagram: Camera,
  Facebook: ThumbsUp,
  TikTok: Music2,
  Snapchat: Ghost,
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

const AUTO_TAP_THEMES = new Set([
  "cyber-cyan-drift",
  "neon-red-track",
  "auto-nardo-stealth",
  "classic-royal-silver",
  "liquid-aurora",
]);

function buildButtons(profile: Profile): ProfileButton[] {
  const buttons: ProfileButton[] = [];
  const l = profile.links || {};

  if (l.instagram)    buttons.push({ icon: "Instagram", url: l.instagram, label: "Instagram" });
  if (l.facebook)     buttons.push({ icon: "Facebook", url: l.facebook, label: "Facebook" });
  if (l.tiktok)       buttons.push({ icon: "TikTok", url: l.tiktok, label: "TikTok" });
  if (l.snapchat)     buttons.push({ icon: "Snapchat", url: l.snapchat, label: "Snapchat" });
  if (l.whatsapp)     buttons.push({ icon: "MessageCircle", url: l.whatsapp, label: "WhatsApp" });
  if (l.phoneSocial)  buttons.push({ icon: "Phone", url: l.phoneSocial, label: "Call" });

  const dc = profile.digitalCardsFields;
  if (dc) {
    if (dc.website)    buttons.push({ icon: "Globe", url: dc.website, label: "Website" });
    if (dc.googleMaps) buttons.push({ icon: "MapPin", url: dc.googleMaps, label: "Location" });
    if (dc.linkedin)   buttons.push({ icon: "Linkedin", url: dc.linkedin, label: "LinkedIn" });
    if (dc.email)      buttons.push({ icon: "Mail", url: dc.email, label: "Email" });
    if (dc.pdfProfile) buttons.push({ icon: "FileText", url: dc.pdfProfile, label: "Company Profile" });
  }

  const bt = profile.businessTapFields;
  if (bt) {
    if (bt.menuLink)         buttons.push({ icon: "Utensils", url: bt.menuLink, label: "Digital Menu" });
    if (bt.googleReviews)    buttons.push({ icon: "Star", url: bt.googleReviews, label: "Google Reviews" });
    if (bt.onlineOrdering)   buttons.push({ icon: "ShoppingCart", url: bt.onlineOrdering, label: "Order Online" });
  }

  return buttons;
}

function getArchetype(theme: string): ThemeArchetype {
  return THEME_ARCHETYPE[theme] || "dark-premium";
}

interface ProfileWrapperProps {
  profile: Profile;
}

export default function ProfileWrapper({ profile }: ProfileWrapperProps) {
  const buttons = buildButtons(profile);
  const archetype = getArchetype(profile.theme);

  const renderLogo = () => {
    if (!profile.logo) {
      return (
        <div className="w-28 h-28 rounded-full bg-dark-card border-2 border-white/10 flex items-center justify-center">
          <span className="text-3xl font-bold text-slate-muted">
            {profile.name?.charAt(0)?.toUpperCase() || "?"}
          </span>
        </div>
      );
    }

    if (profile.logo.includes("cloudinary")) {
      return (
        <CldImage
          src={profile.logo}
          alt={profile.name}
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
        alt={profile.name}
        className="w-28 h-28 rounded-full object-cover border-2"
      />
    );
  };

  const sharedProps = {
    name: profile.name,
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
