"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Edit3, Trash2, Heart, Download, Copy, CheckCheck } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import type { WeddingCard } from "@/lib/wedding-schema";
import { useToast } from "@/components/ui/ToastProvider";
import { BASE_URL } from "@/lib/constants";

interface WeddingOrdersTableProps {
  weddings: WeddingCard[];
  onEdit: (wedding: WeddingCard) => void;
  onRefresh: () => void;
}

export default function WeddingOrdersTable({ weddings, onEdit, onRefresh }: WeddingOrdersTableProps) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const { showToast } = useToast();
  const qrPrintRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const orders = weddings.filter((w) => w.source === "order");

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm(t("deleteConfirm"))) return;
      try {
        await fetch(`/api/weddings/${id}`, { method: "DELETE" });
        showToast(t("deleteSuccess"), "success");
        onRefresh();
      } catch {
        showToast(t("errorOccurred"), "error");
      }
    },
    [t, showToast, onRefresh]
  );

  const handleCopyLink = useCallback(async (slug: string) => {
    const link = `${BASE_URL}/${locale}/wedding/${slug}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
      showToast("تم نسخ الرابط", "success");
    } catch {
      showToast("فشل نسخ الرابط", "error");
    }
  }, [locale, showToast]);

  const handleDownloadQR = useCallback((slug: string) => {
    const div = qrPrintRefs.current[slug];
    const canvas = div?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `wedding-qr-${slug}.png`;
    a.click();
  }, []);

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="w-16 h-16 text-slate-muted/30 mx-auto mb-4" />
        <p className="text-slate-muted text-sm">لا توجد طلبات كروت فرح حتى الآن</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((wedding) => (
        <div
          key={wedding.id}
          className="glass bg-matte-card/50 border border-white/10 rounded-xl overflow-hidden hover:border-gold/30 transition-all duration-300"
        >
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-pink-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-light truncate">
                  {wedding.coupleName1} & {wedding.coupleName2}
                </p>
                <p className="text-xs text-slate-muted/60 truncate" dir="ltr">
                  {wedding.customerName || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-muted mb-1">
              <span className="px-2 py-0.5 rounded-full bg-white/5">
                {wedding.date || "No date"}
              </span>
              <span className={`px-2 py-0.5 rounded-full ${wedding.active ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}>
                {wedding.active ? "مفعل" : "قيد الانتظار"}
              </span>
            </div>
            {wedding.customerPhone && (
              <p className="text-xs text-slate-muted/40 mb-3">{wedding.customerPhone}</p>
            )}

            <div ref={(el) => { qrPrintRefs.current[wedding.slug] = el; }} className="hidden">
              {wedding.slug && (
                <QRCodeCanvas
                  value={`${BASE_URL}/${locale}/wedding/${wedding.slug}`}
                  size={2000}
                  level="H"
                />
              )}
            </div>

            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => onEdit(wedding)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-muted hover:text-gold hover:border-gold/40 transition-all text-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                تعديل
              </button>
              <button
                onClick={() => handleCopyLink(wedding.slug)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-muted hover:text-gold hover:border-gold/40 transition-all text-xs"
              >
                {copiedSlug === wedding.slug ? (
                  <CheckCheck className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={() => handleDownloadQR(wedding.slug)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-muted hover:text-gold hover:border-gold/40 transition-all text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                QR
              </button>
              <button
                onClick={() => wedding.id && handleDelete(wedding.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-muted hover:text-red-400 hover:border-red-400/40 transition-all text-xs ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
