"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import { Edit3, Trash2, Copy, Check, ExternalLink, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import type { Cafe } from "@/lib/cafe-schema";
import { BASE_URL } from "@/lib/constants";


interface CafeTableProps {
  cafes: Cafe[];
  onEdit: (cafe: Cafe) => void;
  onRefresh: () => void;
}

export default function CafeTable({ cafes, onEdit, onRefresh }: CafeTableProps) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrTarget, setQrTarget] = useState<string | null>(null);
  const hiddenQrRef = useRef<HTMLDivElement>(null);

  const handleDownloadQR = useCallback((slug: string) => {
    const link = `${BASE_URL}/${locale}/cafe/${slug}`;
    setQrTarget(link);
    setTimeout(() => {
      const canvas = hiddenQrRef.current?.querySelector("canvas");
      if (!canvas) return;
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-${slug}.png`;
      a.click();
    }, 100);
  }, [locale]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm(t("deleteConfirm"))) return;
      setDeletingId(id);
      try {
        await fetch(`/api/cafes/${id}`, { method: "DELETE" });
        onRefresh();
      } catch (error) {
        console.error("Delete error:", error);
        alert(t("errorOccurred"));
      } finally {
        setDeletingId(null);
      }
    },
    [t, onRefresh]
  );

  const handleCopyLink = useCallback(async (slug: string, id: string) => {
    const link = `${BASE_URL}/${locale}/cafe/${slug}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  }, [locale]);

  if (cafes.length === 0) {
    return (
      <div className="glass bg-dark-card/50 border border-white/5 rounded-2xl p-12 text-center">
        <p className="text-slate-muted text-sm">{t("addCafe")}</p>
      </div>
    );
  }

  return (
    <div className="glass bg-dark-card/50 border border-white/5 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-start text-slate-muted font-medium px-4 py-3">
                {t("tableName")}
              </th>
              <th className="text-start text-slate-muted font-medium px-4 py-3 hidden sm:table-cell">
                {t("tableSlug")}
              </th>
              <th className="text-start text-slate-muted font-medium px-4 py-3 hidden md:table-cell">
                {t("generatedLink")}
              </th>
              <th className="text-end text-slate-muted font-medium px-4 py-3">
                {t("tableActions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {cafes.map((cafe) => (
              <motion.tr
                key={cafe.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {cafe.logo ? (
                      <Image
                        src={cafe.logo}
                        alt={cafe.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-dark-card ring-1 ring-white/10 flex items-center justify-center">
                        <span className="text-xs text-slate-muted">
                          {cafe.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="text-slate-light font-medium">
                      {cafe.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-muted hidden sm:table-cell">
                  {cafe.slug}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <button
                    onClick={() =>
                      cafe.id && handleCopyLink(cafe.slug, cafe.id)
                    }
                    className="flex items-center gap-1.5 text-xs text-neon-green hover:text-emerald-300 transition-colors"
                  >
                    {copiedId === cafe.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        {t("copyLink")}
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        /cafe/{cafe.slug}
                      </>
                    )}
                  </button>
                  <a
                    href={`${BASE_URL}/${locale}/cafe/${cafe.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-muted/50 hover:text-slate-muted ml-2 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => handleDownloadQR(cafe.slug)}
                    className="inline-flex items-center gap-1 text-xs text-slate-muted/50 hover:text-neon-green ml-1 transition-colors"
                    title="Download QR"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(cafe)}
                      className="p-2 rounded-lg text-slate-muted hover:text-neon-green hover:bg-neon-green/10 transition-all duration-200"
                      title={t("editCafe")}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => cafe.id && handleDelete(cafe.id)}
                      disabled={deletingId === cafe.id}
                      className="p-2 rounded-lg text-slate-muted hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Hidden high-res QR canvas for print download */}
      <div ref={hiddenQrRef} className="hidden">
        {qrTarget && <QRCodeCanvas value={qrTarget} size={2000} level="H" />}
      </div>
    </div>
  );
}
