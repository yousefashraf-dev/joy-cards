"use client";

import { useState } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, Globe } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: t("home") },
    { href: "/auto-tap", label: t("autoTap") },
    { href: "/digital-cards", label: t("digitalCards") },
    { href: "/business-tap", label: t("businessTap") },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass-strong bg-matte-black/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-silver flex items-center justify-center">
              <span className="text-matte-dark font-bold text-sm">G</span>
            </div>
            <span className="text-xl font-bold text-gradient-silver">GoTap</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                 className={`text-sm font-medium transition-colors duration-200 ${
                   isActive(link.href)
                     ? "text-nardo"
                     : "text-slate-muted hover:text-slate-light"
                 }`}
               >
                 {link.label}
               </Link>
             ))}
              <button
                onClick={toggleLocale}
                className="w-10 h-10 rounded-full glass bg-dark-card/80 border border-white/10 flex items-center justify-center gap-1 text-xs font-bold text-slate-muted hover:text-nardo hover:border-nardo/50 transition-all duration-200"
                aria-label="Toggle language"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{locale === "en" ? "AR" : "EN"}</span>
              </button>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggleLocale}
              className="w-9 h-9 rounded-full glass bg-dark-card/80 border border-white/10 flex items-center justify-center gap-0.5 text-[10px] font-bold text-slate-muted hover:text-nardo hover:border-nardo/50 transition-all duration-200"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{locale === "en" ? "AR" : "EN"}</span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-light p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 start-0 top-16 bg-matte-black/95 backdrop-blur-xl z-[60]">
          <div className="flex flex-col items-stretch gap-2 h-full overflow-y-auto px-6 py-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                 className={`text-center text-lg font-medium py-3 px-4 rounded-xl transition-colors ${
                   isActive(link.href)
                     ? "text-nardo bg-nardo/10"
                     : "text-slate-muted hover:text-slate-light hover:bg-white/5"
                 }`}
               >
                 {link.label}
               </Link>
             ))}
              <button
                onClick={toggleLocale}
                className="flex items-center justify-center gap-2 text-lg text-slate-muted hover:text-nardo transition-colors mt-4 py-3 px-4 rounded-xl hover:bg-white/5"
              >
                <Globe className="w-5 h-5" />
                <span>{locale === "en" ? "AR" : "EN"}</span>
              </button>
          </div>
        </div>
      )}
    </nav>
  );
}
