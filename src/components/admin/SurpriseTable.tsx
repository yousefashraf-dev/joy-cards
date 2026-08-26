"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Edit3, Trash2, Link2, Eye, EyeOff, Share2 } from "lucide-react";
import type { Surprise } from "@/lib/surprise-schema";

interface SurpriseTableProps {
  surprises: Surprise[];
  onEdit: (surprise: Surprise) => void;
  onRefresh: () => void;
}

export default function SurpriseTable({ surprises, onEdit, onRefresh }: SurpriseTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف المفاجأة؟")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/surprises/${id}`, { method: "DELETE" });
      onRefresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert("حدث خطأ أثناء الحذف");
    } finally {
      setDeletingId(null);
    }
  }, [onRefresh]);

  const handleToggleActive = useCallback(async (surprise: Surprise) => {
    try {
      await fetch(`/api/surprises/${surprise.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !surprise.active }),
      });
      onRefresh();
    } catch (error) {
      console.error("Toggle error:", error);
    }
  }, [onRefresh]);

  const handleCopyLink = useCallback(async (id: string) => {
    const url = `${window.location.origin}/ar/surprise/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      prompt("انسخ اللينك:", url);
    }
  }, []);

  if (surprises.length === 0) {
    return (
      <div className="text-center py-20 text-slate-muted">
        <p className="text-lg">لا توجد مفاجآت بعد</p>
        <p className="text-sm mt-2 text-slate-muted/60">اضغط &quot;+&quot; لإنشاء مفاجأة جديدة</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {surprises.map((surprise, i) => (
        <motion.div
          key={surprise.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass bg-matte-card/80 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-slate-light font-semibold truncate">{surprise.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${surprise.active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                {surprise.active ? "نشط" : "معطّل"}
              </span>
              {surprise.createdVia === "link" && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 flex items-center gap-1">
                  <Share2 className="w-3 h-3" /> عبر لينك
                </span>
              )}
            </div>
            <p className="text-sm text-slate-muted truncate mt-1">{surprise.message}</p>
            <div className="flex items-center gap-4 mt-1 text-xs text-slate-muted/60">
              {surprise.senderName && <span>من: {surprise.senderName}</span>}
              {surprise.recipientName && <span>إلى: {surprise.recipientName}</span>}
              <span>{new Date(surprise.createdAt!).toLocaleDateString("ar-EG")}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleCopyLink(surprise.id!)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                copiedId === surprise.id
                  ? "bg-green-500/20 text-green-400"
                  : "bg-white/5 text-slate-muted hover:text-gold hover:bg-gold/10"
              }`}
              title="نسخ لينك المفاجأة"
            >
              <Link2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleToggleActive(surprise)}
              className="p-2 rounded-lg bg-white/5 text-slate-muted hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200"
              title={surprise.active ? "تعطيل" : "تفعيل"}
            >
              {surprise.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onEdit(surprise)}
              className="p-2 rounded-lg bg-white/5 text-slate-muted hover:text-gold hover:bg-gold/10 transition-all duration-200"
              title="تعديل"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(surprise.id!)}
              disabled={deletingId === surprise.id}
              className="p-2 rounded-lg bg-white/5 text-slate-muted hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50"
              title="حذف"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
