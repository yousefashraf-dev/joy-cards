"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Music2 } from "lucide-react";

export default function Footer() {
  const t = useTranslations("products.footer");
  const locale = useLocale();
  const router = useRouter();

  return (
    <footer className="bg-matte-dark border-t border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/gotap_eg?igsh=bW1pdGN4ZGZ0N2E5&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-muted hover:text-[#E4405F] transition-colors duration-200"
              aria-label={t("instagram")}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="5"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
              </svg>
            </a>

            <a
              href="https://www.tiktok.com/@go.tap.eg?_r=1&_t=ZS-97QgVchctJU"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-muted hover:text-white transition-colors duration-200"
              aria-label={t("tiktok")}
            >
              <Music2 className="w-5 h-5" />
            </a>
          </div>

          <p className="text-slate-muted text-sm text-center">{t("tagline")}</p>
          <p className="text-slate-muted/60 text-xs">
            &copy; {new Date().getFullYear()}{" "}
            <span
              onClick={() => router.push(`/${locale}/admin/dashboard`)}
              aria-hidden="true"
            >
              G
            </span>
            otap. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
