"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface CsvRow {
  Category: string;
  "Item Name": string;
  "Size/Pieces": string;
  Price: string;
  Notes: string;
}

export default function CsvImport({ onSuccess }: { onSuccess: () => void }) {
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [menuName, setMenuName] = useState("");
  const [menuSlug, setMenuSlug] = useState("");
  const [importing, setImporting] = useState(false);
  const [status, setStatus] = useState<"idle" | "preview" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const parseCsv = useCallback((text: string) => {
    const lines = text.split("\n").filter((l) => l.trim());
    if (lines.length < 2) return [];

    const header = lines[0].split(",").map((h) => h.trim());
    const catIdx = header.indexOf("Category");
    const nameIdx = header.indexOf("Item Name");
    const sizeIdx = header.indexOf("Size/Pieces");
    const priceIdx = header.indexOf("Price");
    const notesIdx = header.indexOf("Notes");

    if (catIdx === -1 || nameIdx === -1 || priceIdx === -1) {
      setMessage("الملف غير صالح: تأكد من وجود الأعمدة Category, Item Name, Price");
      return [];
    }

    const parsed: CsvRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim());
      const category = cols[catIdx] || "";
      const name = cols[nameIdx] || "";
      const sizeOrPieces = sizeIdx !== -1 ? (cols[sizeIdx] || "") : "";
      const price = priceIdx !== -1 ? (cols[priceIdx] || "") : "";
      const notes = notesIdx !== -1 ? (cols[notesIdx] || "") : "";
      if (name && category) {
        parsed.push({
          Category: category,
          "Item Name": name,
          "Size/Pieces": sizeOrPieces,
          Price: price,
          Notes: notes,
        });
      }
    }
    return parsed;
  }, []);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage("");

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCsv(text);
      if (parsed.length === 0) {
        setMessage("لم يتم العثور على أصناف صالحة في الملف");
        setStatus("error");
        return;
      }
      setRows(parsed);
      setStatus("preview");
      setMessage(`تم العثور على ${parsed.length} صنف من ${new Set(parsed.map((r) => r.Category)).size} أقسام`);

      const nameFromFile = file.name.replace(/\.csv$/i, "").replace(/[_-]/g, " ");
      setMenuName(nameFromFile);
      setMenuSlug(nameFromFile.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
    };
    reader.readAsText(file);
  }, [parseCsv]);

  const importMenu = useCallback(async () => {
    if (!menuName.trim() || rows.length === 0) return;
    setImporting(true);
    setMessage("");

    const items = rows.map((r) => ({
      name: r["Item Name"],
      price: r.Price || "0",
      category: r.Category,
      size: r["Size/Pieces"] || "",
      description: r.Notes || "",
    }));

    try {
      const res = await fetch("/api/menus/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: menuName.trim(),
          slug: menuSlug.trim() || menuName.trim().toLowerCase().replace(/\s+/g, "-"),
          theme: "standard",
          items,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "فشل الاستيراد");
      }

      setStatus("done");
      setMessage(`✅ تم استيراد "${menuName.trim()}" بنجاح (${items.length} صنف)`);
      onSuccess();
    } catch (err) {
      setStatus("error");
      setMessage(`❌ ${err instanceof Error ? err.message : "خطأ غير متوقع"}`);
    } finally {
      setImporting(false);
    }
  }, [menuName, menuSlug, rows, onSuccess]);

  const grouped = rows.reduce<Record<string, CsvRow[]>>((acc, row) => {
    if (!acc[row.Category]) acc[row.Category] = [];
    acc[row.Category].push(row);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-dark-card/50 p-6">
        <h3 className="text-lg font-semibold text-slate-light mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-neon-green" />
          استيراد منيو من ملف CSV
        </h3>

        <label className="flex flex-col items-center gap-3 p-8 rounded-xl border-2 border-dashed border-white/20 hover:border-neon-green/50 cursor-pointer transition-all bg-dark-card/30">
          <FileText className="w-10 h-10 text-slate-muted" />
          <span className="text-sm text-slate-muted">اختر ملف CSV</span>
          <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
        </label>

        {message && (
          <p className={`mt-3 text-sm flex items-center gap-1.5 ${status === "error" ? "text-red-400" : status === "done" ? "text-green-400" : "text-slate-muted"}`}>
            {status === "error" ? <AlertCircle className="w-4 h-4" /> : status === "done" ? <CheckCircle className="w-4 h-4" /> : null}
            {message}
          </p>
        )}
      </div>

      {status === "preview" && (
        <div className="rounded-xl border border-white/10 bg-dark-card/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-slate-light">معاينة البيانات</h4>
            <span className="text-xs text-slate-muted">{rows.length} صنف · {Object.keys(grouped).length} قسم</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1">
              <label className="text-xs text-slate-muted block mb-1">اسم المنيو</label>
              <input
                type="text"
                value={menuName}
                onChange={(e) => {
                  setMenuName(e.target.value);
                  setMenuSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                }}
                className="w-full px-3 py-2 rounded-lg bg-dark-card border border-white/10 text-sm text-slate-light placeholder:text-slate-muted/40 focus:outline-none focus:border-neon-green/50"
                placeholder="اسم المنيو"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-slate-muted block mb-1">الرابط (Slug)</label>
              <input
                type="text"
                value={menuSlug}
                onChange={(e) => setMenuSlug(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-dark-card border border-white/10 text-sm text-slate-light placeholder:text-slate-muted/40 focus:outline-none focus:border-neon-green/50"
                placeholder="menu-slug"
                dir="ltr"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-dark-card/80 border-b border-white/10">
                  <th className="text-right p-2 text-slate-muted font-medium">القسم</th>
                  <th className="text-right p-2 text-slate-muted font-medium">الاسم</th>
                  <th className="text-center p-2 text-slate-muted font-medium">الحجم</th>
                  <th className="text-center p-2 text-slate-muted font-medium">السعر</th>
                  <th className="text-right p-2 text-slate-muted font-medium">ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(grouped).map(([cat, catRows]) =>
                  catRows.map((row, i) => (
                    <tr key={`${cat}-${i}`} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-2 text-slate-light font-medium">{row.Category}</td>
                      <td className="p-2 text-slate-light">{row["Item Name"]}</td>
                      <td className="p-2 text-center text-slate-muted text-xs">{row["Size/Pieces"] || "—"}</td>
                      <td className="p-2 text-center text-slate-light tabular-nums" dir="ltr">{row.Price}</td>
                      <td className="p-2 text-slate-muted text-xs max-w-[200px] truncate">{row.Notes || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={importMenu}
              disabled={importing || !menuName.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-neon-green/20 text-neon-green border border-neon-green/30 hover:bg-neon-green/30 disabled:opacity-40 transition-all font-medium"
            >
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {importing ? "جاري الاستيراد..." : "استيراد المنيو"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
