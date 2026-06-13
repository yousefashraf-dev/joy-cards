import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("products.footer");

  return (
    <footer className="bg-matte-dark border-t border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-silver flex items-center justify-center">
              <span className="text-matte-dark font-bold text-xs">G</span>
            </div>
            <span className="text-lg font-bold text-gradient-silver">GoTap</span>
          </div>
          <p className="text-slate-muted text-sm text-center">{t("tagline")}</p>
          <p className="text-slate-muted/60 text-xs">
            &copy; {new Date().getFullYear()} GoTap. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
