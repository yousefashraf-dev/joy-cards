"use client";

import { useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Edit3, Trash2, Heart, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import type { WeddingCard } from "@/lib/wedding-schema";
import { useToast } from "@/components/ui/ToastProvider";

interface WeddingTableProps {
  weddings: WeddingCard[];
  onEdit: (wedding: WeddingCard) => void;
  onRefresh: () => void;
}

export default function WeddingTable({ weddings, onEdit, onRefresh }: WeddingTableProps) {
  const t = useTranslations("admin");
  const { showToast } = useToast();
  const qrPrintRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

  if (weddings.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="w-16 h-16 text-slate-muted/30 mx-auto mb-4" />
        <p className="text-slate-muted text-sm">No wedding cards yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {weddings.map((wedding) => (
        <div
          key={wedding.id}
          className="glass bg-matte-card/50 border border-white/10 rounded-xl overflow-hidden hover:border-gold/30 transition-all duration-300"
        >
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-gold" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-light truncate">
                  {wedding.coupleName1} & {wedding.coupleName2}
                </p>
                <p className="text-xs text-slate-muted/60 truncate" dir="ltr">
                  /wedding/{wedding.slug}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-muted mb-3">
              <span className="px-2 py-0.5 rounded-full bg-white/5">
                {wedding.date || "No date"}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full ${
                  wedding.active
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {wedding.active ? "Active" : "Inactive"}
              </span>
            </div>

            <div ref={(el) => { qrPrintRefs.current[wedding.slug] = el; }} className="hidden">
              {wedding.slug && (
                <QRCodeCanvas
                  value={`https://gotap.vercel.app/ar/wedding/${wedding.slug}`}
                  size={2000}
                  level="H"
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(wedding)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-muted hover:text-gold hover:border-gold/40 transition-all text-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
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
