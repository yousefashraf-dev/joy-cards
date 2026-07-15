"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { MenuItem, MenuCategory } from "@/lib/cafe-schema";

const CATEGORY_ICONS = [
  "🥗", "☕", "🥤", "🧃", "🍕", "🍔",
  "🍣", "🍰", "🍜", "🍝", "🥓", "🥩",
  "🍖", "🍗", "🍳", "🥑", "🥛", "🍦",
  "🍩", "🥨", "🍞", "🐟", "🦐", "🌮",
  "🌯", "🍛", "🍲", "🥘", "🧆", "🫓",
];

interface MenuBuilderProps {
  categories: MenuCategory[];
  items: MenuItem[];
  onCategoriesChange: (categories: MenuCategory[]) => void;
  onItemsChange: (items: MenuItem[]) => void;
}

const inputClass =
  "w-full px-3 py-2 rounded-lg bg-dark-card border border-white/10 text-sm text-slate-light placeholder:text-slate-muted/40 focus:outline-none focus:border-neon-green/50 transition-all duration-200";

const priceInputClass =
  "w-full px-3 py-2 rounded-lg bg-dark-card border border-white/10 text-sm text-slate-light placeholder:text-slate-muted/40 focus:outline-none focus:border-neon-green/50 transition-all duration-200 text-center";

export default function MenuBuilder({
  categories,
  items,
  onCategoriesChange,
  onItemsChange,
}: MenuBuilderProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  const addCategory = () => {
    const name = newCategoryName.trim();
    if (!name || categories.some((c) => c.name === name)) return;
    const icon = selectedIcon || "📋";
    onCategoriesChange([...categories, { name, icon }]);
    setNewCategoryName("");
    setSelectedIcon("");
  };

  const removeCategory = (catName: string) => {
    onCategoriesChange(categories.filter((c) => c.name !== catName));
    onItemsChange(items.filter((i) => i.category !== catName));
  };

  const addItem = (category: string) => {
    onItemsChange([...items, { name: "", price: "", description: "", category }]);
  };

  const updateItem = (index: number, field: "name" | "price" | "size" | "description", value: string) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onItemsChange(updated);
  };

  const removeItem = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  const getItemsByCategory = (cat: string) =>
    items.filter((i) => i.category === cat);

  return (
    <div className="space-y-4">
      {/* Add Category */}
      <div>
        <label className="block text-sm text-slate-muted mb-1.5">
          التصنيفات
        </label>

        {/* Emoji Grid */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {CATEGORY_ICONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setSelectedIcon(selectedIcon === emoji ? "" : emoji)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-lg transition-all duration-200 ${
                selectedIcon === emoji
                  ? "bg-neon-green/20 ring-2 ring-neon-green scale-110"
                  : "bg-dark-card border border-white/10 hover:border-white/30"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            className={inputClass}
            placeholder={selectedIcon ? `مثال: اسم التصنيف` : "اختر إيموجي أولاً (اختياري)"}
          />
          <button
            type="button"
            onClick={addCategory}
            disabled={!newCategoryName.trim()}
            className="shrink-0 p-2.5 rounded-lg bg-neon-green/20 text-neon-green border border-neon-green/30 hover:bg-neon-green/30 disabled:opacity-40 transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {categories.length === 0 && (
        <p className="text-sm text-slate-muted/50 text-center py-4">
          اختر إيموجي + اكتب اسم التصنيف (مثلاً: 🥗 سلطة)
        </p>
      )}

      {/* Categories */}
      {categories.map((cat) => {
        const catItems = getItemsByCategory(cat.name);
        const isExpanded = expandedCats[cat.name] !== false;

        return (
          <div
            key={cat.name}
            className="rounded-xl border border-white/10 bg-dark-card/50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExpandedCats((prev) => ({ ...prev, [cat.name]: !isExpanded }))}
                  className="text-slate-muted hover:text-slate-light transition-colors"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                <span className="text-lg">{cat.icon}</span>
                <span className="text-sm font-semibold text-slate-light">
                  {cat.name}
                </span>
                <span className="text-xs text-slate-muted/50">
                  ({catItems.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeCategory(cat.name)}
                className="p-1.5 rounded-lg text-red-400/70 hover:bg-red-400/10 hover:text-red-400 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {isExpanded && (
              <div className="px-4 pb-4 space-y-2">
                {items
                  .map((item, globalIdx) => ({ item, globalIdx }))
                  .filter(({ item }) => item.category === cat.name)
                  .map(({ item, globalIdx }) => (
                    <div key={globalIdx} className="flex flex-col gap-1.5 p-2 rounded-lg bg-dark-card/30">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            updateItem(globalIdx, "name", e.target.value)
                          }
                          className={`${inputClass} flex-[3] min-w-0`}
                          placeholder="اسم الصنف"
                        />
                        <input
                          type="text"
                          value={item.size || ""}
                          onChange={(e) =>
                            updateItem(globalIdx, "size", e.target.value)
                          }
                          className={`${inputClass} w-16 shrink-0 text-center text-xs`}
                          placeholder="حجم"
                          dir="ltr"
                        />
                        <div className="relative w-16 shrink-0">
                          <input
                            type="text"
                            value={item.price}
                            onChange={(e) =>
                              updateItem(globalIdx, "price", e.target.value)
                            }
                            className={`${priceInputClass} pl-5`}
                            placeholder="0"
                            dir="ltr"
                          />
                          <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-muted/40 pointer-events-none">
                            ﷼
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(globalIdx)}
                          className="p-2 shrink-0 rounded-lg text-red-400/70 hover:bg-red-400/10 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.description || ""}
                        onChange={(e) =>
                          updateItem(globalIdx, "description", e.target.value)
                        }
                        className={`${inputClass} text-xs opacity-70`}
                        placeholder="وصف اختياري — مثلاً: دجاج مشوي مع صوص الباربكيو"
                      />
                    </div>
                  ))}
                <button
                  type="button"
                  onClick={() => addItem(cat.name)}
                  className="flex items-center gap-1.5 text-xs text-slate-muted hover:text-neon-green transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  إضافة صنف
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
