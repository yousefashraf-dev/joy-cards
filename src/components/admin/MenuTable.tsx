"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { Copy, ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { MenuDocument } from "@/lib/menu-schema";
import { BASE_URL } from "@/lib/constants";
import { useToast } from "@/components/ui/ToastProvider";

interface MenuTableProps {
  menus: MenuDocument[];
  onEdit: (menu: MenuDocument) => void;
  onRefresh: () => void;
}

export default function MenuTable({ menus, onEdit, onRefresh }: MenuTableProps) {
  const t = useTranslations("admin");
  const { showToast } = useToast();

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("هل أنت متأكد من حذف هذا المنيو؟")) return;
      try {
        const res = await fetch(`/api/menus/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        showToast("تم الحذف بنجاح!", "success");
        onRefresh();
      } catch {
        showToast("حدث خطأ. حاول مرة أخرى.", "error");
      }
    },
    [onRefresh, showToast]
  );

  const handleCopyLink = useCallback(
    (slug: string) => {
      const url = `${BASE_URL}/ar/menu/${slug}`;
      navigator.clipboard.writeText(url);
      showToast("تم نسخ الرابط!", "success");
    },
    [showToast]
  );

  const formatDate = (ts?: number) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="glass bg-matte-card/90 border border-white/10 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-right px-4 py-3 text-slate-muted font-medium">الاسم</th>
              <th className="text-right px-4 py-3 text-slate-muted font-medium">التصنيفات</th>
              <th className="text-right px-4 py-3 text-slate-muted font-medium">الأصناف</th>
              <th className="text-right px-4 py-3 text-slate-muted font-medium">تاريخ الإضافة</th>
              <th className="text-left px-4 py-3 text-slate-muted font-medium">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {menus.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-muted/50">
                  لا توجد منيوات بعد
                </td>
              </tr>
            )}
            {menus.map((menu) => (
              <tr key={menu.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <span className="text-slate-light font-medium">{menu.name}</span>
                  <span
                    className={`ml-2 inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                      menu.adminPin ? "bg-gold/15 text-gold" : "bg-white/5 text-slate-muted/40"
                    }`}
                    title={menu.adminPin ? "لصاحب المنيو كلمة سر للتعديل السريع" : "لا توجد كلمة سر للتعديل السريع"}
                  >
                    {menu.adminPin ? "🔒 سر" : "بدون سر"}
                  </span>
                  <div className="text-xs text-slate-muted/50 mt-0.5" dir="ltr">
                    /ar/menu/{menu.slug}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-muted">
                  {menu.categories?.length || 0}
                </td>
                <td className="px-4 py-3 text-slate-muted">
                  {menu.items?.length || 0}
                </td>
                <td className="px-4 py-3 text-slate-muted">
                  {formatDate(menu.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 justify-start">
                    <button
                      onClick={() => handleCopyLink(menu.slug)}
                      className="p-2 rounded-lg text-slate-muted hover:text-neon-green hover:bg-neon-green/10 transition-all"
                      title="نسخ الرابط"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <a
                      href={`/ar/menu/${menu.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-muted hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                      title="فتح الرابط"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => onEdit(menu)}
                      className="p-2 rounded-lg text-slate-muted hover:text-yellow-400 hover:bg-yellow-400/10 transition-all"
                      title="تعديل"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => menu.id && handleDelete(menu.id)}
                      className="p-2 rounded-lg text-slate-muted hover:text-red-400 hover:bg-red-400/10 transition-all"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
