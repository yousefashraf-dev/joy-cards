"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="min-h-screen flex items-center justify-center bg-matte-black">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-nardo">404</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-light mb-3">{t("title")}</h1>
        <p className="text-slate-muted mb-8 max-w-sm mx-auto">
          {t("description")}
        </p>
        <Link href="/">
          <PrimaryButton>
            <Home className="w-4 h-4" />
            {t("backHome")}
          </PrimaryButton>
        </Link>
      </motion.div>
    </div>
  );
}
