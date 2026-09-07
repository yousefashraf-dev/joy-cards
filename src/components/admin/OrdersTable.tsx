"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Package, RefreshCw, ChevronDown, MessageCircle, MapPin, StickyNote } from "lucide-react";

interface CatalogOrderDoc {
  id: string;
  productId: string;
  productSlug: string;
  productName?: { ar: string; en: string } | string;
  color?: string | null;
  serviceType?: "product" | "restaurant_menu";
  orderType?: "shipping" | "pickup";
  qty: number;
  unitPrice: number;
  discountPercent: number;
  totalPrice: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  notes?: string | null;
  shippingGovernorate?: string | null;
  shippingCity?: string | null;
  shippingAddress?: string | null;
  restaurantName?: string | null;
  menuDetail?: string | null;
  status?: string;
  createdAt?: number;
}

export default function OrdersTable() {
  const t = useTranslations("admin");
  const locale = useLocale() as "ar" | "en";
  const [orders, setOrders] = useState<CatalogOrderDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const doLoad = () => {
    setLoading(true);
    fetch("/api/catalog-orders")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let active = true;
    fetch("/api/catalog-orders")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (active) setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setOrders([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const colorName = (c?: string | null) => {
    if (!c) return "—";
    const map: Record<string, { ar: string; en: string }> = {
      silver: { ar: "فضي", en: "Silver" },
      black: { ar: "أسود", en: "Black" },
      transparent: { ar: "شفاف", en: "Transparent" },
      white: { ar: "أبيض", en: "White" },
    };
    return map[c] ? map[c][locale] : c;
  };

  const productLabel = (o: CatalogOrderDoc) => {
    if (o.productName && typeof o.productName === "object") return o.productName[locale] || o.productName.ar;
    if (typeof o.productName === "string") return o.productName;
    if (o.restaurantName) return o.restaurantName;
    return o.productId;
  };

  const isMenu = (o: CatalogOrderDoc) => o.serviceType === "restaurant_menu";

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-20 text-slate-muted">
        <RefreshCw className="w-5 h-5 text-gold animate-spin" />
        <span className="text-sm">{t("orderLoading")}</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 glass-card rounded-2xl">
        <Package className="w-14 h-14 text-slate-muted/20 mx-auto mb-4" />
        <p className="text-slate-muted">{t("ordersEmpty")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <button
          onClick={doLoad}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-muted hover:text-gold hover:border-gold/30 transition-all text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          {t("orderRefresh")}
        </button>
      </div>

      {orders.map((o, i) => {
        const open = expanded === o.id;
        const isShipping = o.orderType === "shipping";
        return (
          <motion.div
            key={o.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.4) }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setExpanded(open ? null : o.id)}
              className="w-full flex items-center gap-4 p-4 text-start hover:bg-white/[0.02] transition-colors"
            >
              <span className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold text-sm font-bold shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-light truncate">
                    {isMenu(o) ? `${t("orderMenuService")} · ${productLabel(o)}` : productLabel(o)}
                  </span>
                  {o.discountPercent > 0 && (
                    <span className="badge-discount shrink-0 no-underline">{o.discountPercent}%</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-muted mt-0.5">
                  <span>{o.customerName}</span>
                  <span dir="ltr" className="text-gold/80">+20{o.customerPhone}</span>
                  <span>{o.qty} × {o.unitPrice}</span>
                  <span className="text-slate-light font-bold" dir="ltr">{o.totalPrice} EGP</span>
                  <span>{isShipping ? t("orderShipping") : t("orderPickup")}</span>
                  {isMenu(o) && <span className="text-gold/80">{t("orderMenuService")}</span>}
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-[10px] font-bold">
                  {o.status === "pending" ? t("statusPending") : o.status}
                </span>
                <span className="text-[10px] text-slate-muted/60" dir="ltr">
                  {o.createdAt ? new Date(o.createdAt).toLocaleString(locale === "ar" ? "ar-EG" : "en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-muted shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="details"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-3 text-xs">
                    <div className="grid sm:grid-cols-2 gap-3 pt-3">
                      <div className="space-y-1">
                        <p className="text-slate-muted/60">{t("orderProduct")}</p>
                        <p className="text-slate-light font-semibold">{isMenu(o) ? productLabel(o).replace(`${t("orderMenuService")} · `, "") : productLabel(o)}</p>
                      </div>
                      {!isMenu(o) && o.color && (
                        <div className="space-y-1">
                          <p className="text-slate-muted/60">{t("orderColorCol")}</p>
                          <p className="text-slate-light font-semibold">{colorName(o.color)}</p>
                        </div>
                      )}
                      {isMenu(o) && (
                        <div className="space-y-1">
                          <p className="text-slate-muted/60">{t("orderRestaurant")}</p>
                          <p className="text-slate-light font-semibold">{o.restaurantName || "—"}</p>
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="text-slate-muted/60">{t("orderTotal")}</p>
                        <p className="text-slate-light font-bold" dir="ltr">{(o.qty * o.unitPrice).toLocaleString()} → {o.totalPrice} EGP</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-muted/60">{t("orderPhone")}</p>
                        <a
                          href={`https://wa.me/20${o.customerPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold font-semibold inline-flex items-center gap-1.5 hover:underline"
                          dir="ltr"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          +20{o.customerPhone}
                        </a>
                      </div>
                    </div>

                    {isShipping && (o.shippingGovernorate || o.shippingCity || o.shippingAddress) && (
                      <div className="flex items-start gap-2 text-slate-muted">
                        <MapPin className="w-4 h-4 text-gold/70 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">
                          {[o.shippingGovernorate, o.shippingCity, o.shippingAddress].filter(Boolean).join(" · ")}
                        </span>
                      </div>
                    )}

                    {o.notes && (
                      <div className="flex items-start gap-2 text-slate-muted">
                        <StickyNote className="w-4 h-4 text-gold/70 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{t("orderNotes")}: {o.notes}</span>
                      </div>
                    )}
                    {isMenu(o) && o.menuDetail && (
                      <div className="flex items-start gap-2 text-slate-muted">
                        <StickyNote className="w-4 h-4 text-gold/70 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{o.menuDetail}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}