"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Truck, Store, MessageCircle, Loader2, Check } from "lucide-react";
import type { ProductColor, CatalogOrderType } from "@/lib/catalog-schema";
import { categoryHasColors } from "@/lib/catalog-schema";
import { getColorName } from "@/lib/catalog-data";
import { calculatePrice, GOVERNORATES } from "@/lib/pricing";
import { submitCatalogOrder, whatsappOrderUrl, type CatalogOrderInput } from "@/lib/catalog-order";
import { useCatalog } from "@/lib/use-catalog";

const FEATURE_IDS = [
  "placeName", "logo", "whatsapp", "instagram", "tiktok", "snapchat", "telegram",
  "facebook", "email", "linkedin", "website", "menu", "instaPay", "vodafoneCash",
  "googleMaps", "googleReviews", "workingHours", "wifi", "bio", "theme",
] as const;

const DEFAULT_ON: ReadonlySet<string> = new Set([
  "placeName", "logo", "whatsapp", "instagram",
  "instaPay", "vodafoneCash", "googleMaps", "workingHours",
]);

interface SmartOrderModalProps {
  open: boolean;
  onClose: () => void;
  initialProductId?: string | null;
  allowProductSwitch?: boolean;
  mode?: "product" | "menu";
  defaultOrderType?: "shipping" | "pickup";
}

export default function SmartOrderModal({
  open,
  onClose,
  initialProductId,
  allowProductSwitch = false,
  mode = "product",
  defaultOrderType = "shipping",
}: SmartOrderModalProps) {
  const t = useTranslations("smartOrder");
  const locale = useLocale() as "ar" | "en";
  const { products } = useCatalog();

  const pickProduct = (products.find((p) => p.id === initialProductId) || products[0]) ?? null;

  const [activeId, setActiveId] = useState<string | null>(pickProduct?.id ?? null);
  const product = products.find((p) => p.id === activeId) || products[0] || null;

  const hasColors = product ? categoryHasColors(product.category) && !!product.available_colors?.length : false;
  const [color, setColor] = useState<ProductColor | null>("transparent");
  const [qty, setQty] = useState(1);
  const [orderType, setOrderType] = useState<CatalogOrderType>(defaultOrderType);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [gov, setGov] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [menuDetail, setMenuDetail] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [featuresOn, setFeaturesOn] = useState<Set<string>>(
    () => new Set(FEATURE_IDS.filter((id) => DEFAULT_ON.has(id)))
  );

  const toggleFeature = (id: string) =>
    setFeaturesOn((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const pricing = useMemo(
    () => (product ? calculatePrice(product.base_price, qty, product.discount_tiers) : null),
    [product, qty]
  );

  const displayImage = useMemo(() => {
    if (!product) return null;
    if (hasColors && color && product.colorImages?.[color]) return product.colorImages[color];
    return product.images?.[0] || null;
  }, [product, hasColors, color]);

  const clearError = (key: string) =>
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (mode === "product") {
      if (hasColors && !color) errs.color = t("errorColor");
    }
    if (mode === "menu" && !restaurantName.trim()) errs.restaurantName = t("errorRequired");
    if (mode === "product" && !name.trim()) errs.name = t("errorRequired");
    if (!phone.trim()) errs.phone = t("errorRequired");
    else if (!/^(\+20|0)?1[0-9]{9}$/.test(phone.replace(/[\s-]/g, ""))) errs.phone = t("errorPhone");
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = t("errorEmail");
    if (orderType === "shipping") {
      if (!gov.trim()) errs.gov = t("errorRequired");
      if (!city.trim()) errs.city = t("errorRequired");
      if (!address.trim()) errs.address = t("errorRequired");
    }
    return errs;
  };

  const buildMessage = (input: CatalogOrderInput): string => {
    const e = (n: number) => `${n}`;
    const egp = t("egp");
    const lines: string[] = [t("waGreeting"), t("waWantOrder"), ""];

    if (mode === "menu") {
      lines.push(`${t("waRestaurant")}: ${input.restaurantName}`);
      if (input.menuDetail) lines.push(`${t("waMenuDetail")}: ${input.menuDetail}`);
      lines.push(`${t("waProduct")}: ${input.product.name[locale]}`);
    } else {
      lines.push(`${t("waProduct")}: ${input.product.name[locale]}`);
      if (input.color) lines.push(`${t("waColor")}: ${getColorName(input.color, locale)}`);
    }
    lines.push(`${t("waQty")}: ${e(input.qty)}`);
    if (input.discountPercent > 0) {
      lines.push(`${t("waUnitPrice")}: ${e(input.unitPrice)} ${egp} (${t("waAfterDiscount")} ${input.discountPercent}%)`);
    } else {
      lines.push(`${t("waUnitPrice")}: ${e(input.unitPrice)} ${egp}`);
    }
    lines.push(`${t("waTotal")}: ${e(input.totalPrice)} ${egp}`);
    lines.push("");
    lines.push(`${t("waName")}: ${input.customerName}`);
    lines.push(`${t("waPhone")}: +20${input.phone}`);
    if (input.email) lines.push(`${t("waEmail")}: ${input.email}`);
    if (orderType === "shipping") {
      lines.push(`${t("waShipping")}`);
      if (input.shippingGovernorate) lines.push(`${t("waGovernorate")}: ${input.shippingGovernorate}`);
      if (input.shippingCity) lines.push(`${t("waCity")}: ${input.shippingCity}`);
      if (input.shippingAddress) lines.push(`${t("waAddress")}: ${input.shippingAddress}`);
    } else {
      lines.push(`${t("waPickup")}`);
    }
    if (input.notes) lines.push(`${t("waNotes")}: ${input.notes}`);
    if (input.features?.length) {
      lines.push(`${t("waFeatures")}: ${input.features.map((id) => t(`features.${id}`)).join("، ")}`);
    }
    lines.push("");
    lines.push(t("waClosing"));
    return lines.join("\n");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!product || !pricing) return;
    setSubmitting(true);
    setErrors({});

    const input: CatalogOrderInput = {
      product,
      color: mode === "product" && hasColors ? color : null,
      serviceType: mode === "menu" ? "restaurant_menu" : "product",
      orderType,
      qty,
      unitPrice: pricing.unitPrice,
      discountPercent: pricing.discountPercent,
      totalPrice: pricing.total,
      customerName: mode === "menu" ? restaurantName.trim() : name.trim(),
      phone: phone.replace(/\s|-/g, ""),
      email: email.trim() || undefined,
      notes: notes.trim() || undefined,
      shippingGovernorate: orderType === "shipping" ? gov.trim() || undefined : undefined,
      shippingCity: orderType === "shipping" ? city.trim() || undefined : undefined,
      shippingAddress: orderType === "shipping" ? address.trim() || undefined : undefined,
      restaurantName: mode === "menu" ? restaurantName.trim() || undefined : undefined,
      menuDetail: mode === "menu" ? menuDetail.trim() || undefined : undefined,
      features: [...featuresOn],
    };

    try {
      await submitCatalogOrder(input);
      const url = whatsappOrderUrl(buildMessage(input));
      window.open(url, "_blank", "noopener,noreferrer");
      console.log("[GoTap] Order saved:", input);
    } catch (err) {
      console.error("[GoTap] Order save failed:", err);
      setErrors({ _form: t("sendFailed") });
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setErrors({});
    setSubmitting(false);
    onClose();
  };

  const inputClass = (key: string, extra = "") =>
    `form-input ${extra} ${errors[key] ? "input-invalid" : ""}`;
  const errorEl = (key: string) =>
    errors[key] ? <span className="form-error">{errors[key]}</span> : null;

  return (
    <AnimatePresence>
      {open && product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(ev) => {
            if (ev.target === ev.currentTarget) resetAndClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full sm:max-w-lg bg-matte-black/95 backdrop-blur-xl border border-gold/25 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(198,165,104,0.25)] max-h-[94dvh] flex flex-col"
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div className="p-5 pb-0 shrink-0">
              <div className="flex items-start gap-4">
                <div className="relative w-24 h-24 rounded-2xl bg-matte-dark border border-gold/20 overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                  {displayImage ? (
                    <img src={displayImage} alt={product.name[locale]} className="w-full h-full object-contain" />
                  ) : (
                    <ShoppingBag className="w-8 h-8 text-slate-muted/30" />
                  )}
                  {pricing && pricing.discountPercent > 0 && (
                    <span className="badge-discount absolute top-1.5 end-1.5 !px-1.5 !py-0.5 !text-[9px]">
                      {t("discount", { p: pricing.discountPercent })}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  {mode === "menu" ? (
                    <>
                      <p className="text-xs text-gold font-semibold mb-1">{t("serviceMenuMode")}</p>
                      <h3 className="text-lg font-bold text-slate-light leading-tight">{t("menuSection")}</h3>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-gold font-semibold mb-1">{t("productLabel")}</p>
                      <h3 className="text-lg font-bold text-slate-light leading-tight">{product.name[locale]}</h3>
                      <p className="text-sm text-slate-muted mt-0.5">
                        {product.base_price} {t("egp")} / {t("qtyLabel").toLowerCase()}
                      </p>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-gold/40 transition-all shrink-0"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {products.length > 0 && (allowProductSwitch || mode === "menu") && (
                <div className="flex gap-2 overflow-x-auto scrollbar-none mt-4 pb-1">
                  {products.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setActiveId(p.id);
                        setColor("transparent");
                        setQty(1);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all shrink-0 ${
                        p.id === product.id
                          ? "bg-gold/20 text-gold border-gold/50"
                          : "bg-white/5 text-slate-muted border-white/10 hover:border-gold/30"
                      }`}
                    >
                      {p.shortName[locale]} · {p.base_price} {t("egp")}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto scrollbar-none flex-1">
              {/* Order type toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType("shipping")}
                  className={`flex items-center gap-2 px-3 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                    orderType === "shipping"
                      ? "bg-gold/15 border-gold/50 text-gold shadow-[0_0_20px_rgba(198,165,104,0.15)]"
                      : "bg-white/5 border-white/10 text-slate-muted hover:bg-white/10"
                  }`}
                >
                  <Truck className="w-4 h-4 shrink-0" />
                  <span className="text-start leading-tight">
                    {t("orderTypeShipping")}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("pickup")}
                  className={`flex items-center gap-2 px-3 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                    orderType === "pickup"
                      ? "bg-gold/15 border-gold/50 text-gold shadow-[0_0_20px_rgba(198,165,104,0.15)]"
                      : "bg-white/5 border-white/10 text-slate-muted hover:bg-white/10"
                  }`}
                >
                  <Store className="w-4 h-4 shrink-0" />
                  <span className="text-start leading-tight">
                    {t("orderTypePickup")}
                  </span>
                </button>
              </div>

              {mode === "product" && hasColors && product.available_colors && (
                <div className="glass-card rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="form-label !mb-0">{t("colorLabel")}</label>
                    {color && <span className="text-xs font-bold text-gold">{getColorName(color, locale)}</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    {product.available_colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setColor(c);
                          clearError("color");
                        }}
                        className="flex flex-col items-center gap-1.5 group"
                        aria-pressed={color === c}
                      >
                        <span
                          className={`swatch w-10 h-10 rounded-2xl ${
                            c === "transparent"
                              ? "swatch-transparent"
                              : c === "silver"
                                ? "swatch-silver"
                                : c === "black"
                                  ? "swatch-black"
                                  : "swatch-white"
                          } ${color === c ? "swatch-selected" : ""}`}
                        />
                        <span className={`text-[10px] ${color === c ? "text-gold font-bold" : "text-slate-muted"}`}>
                          {getColorName(c, locale)}
                        </span>
                      </button>
                    ))}
                  </div>
                  {errorEl("color")}
                </div>
              )}

              {/* Quantity */}
              <div className="glass-card rounded-2xl p-4">
                <label className="form-label !mb-3">{mode === "menu" ? t("menuStickersQty") : t("qtyLabel")}</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-11 h-11 rounded-xl bg-white/5 border border-gold/30 flex items-center justify-center text-gold hover:bg-white/10 transition-all"
                    aria-label="decrease"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(ev) => {
                      const v = Math.max(1, parseInt(ev.target.value || "1", 10) || 1);
                      setQty(v);
                    }}
                    className="form-input !w-20 text-center text-xl font-bold text-gold"
                    inputMode="numeric"
                  />
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="w-11 h-11 rounded-xl bg-white/5 border border-gold/30 flex items-center justify-center text-gold hover:bg-white/10 transition-all"
                    aria-label="increase"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Live price calculator */}
              {pricing && (
                <div className="rounded-2xl border border-gold/25 bg-gold/5 p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-muted">{t("unitPrice")}</span>
                    <span className="text-sm">
                      {pricing.discountPercent > 0 ? (
                        <span className="flex items-center gap-2">
                          <span className="text-slate-muted line-through">{product.base_price} {t("egp")}</span>
                          <span className="text-gold font-bold text-lg" dir="ltr">
                            {pricing.unitPrice} {t("egp")}
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-light font-bold" dir="ltr">
                          {pricing.unitPrice} {t("egp")}
                        </span>
                      )}
                    </span>
                  </div>
                  {pricing.discountPercent > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-muted">{t("discountLabel", { p: pricing.discountPercent })}</span>
                      <span className="badge-discount">{pricing.discountPercent}%</span>
                    </div>
                  )}
                  <div className="w-full h-px bg-gold/20" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-muted">{t("total")}</span>
                    <span className="text-xl font-black text-gradient-gold" dir="ltr">
                      {pricing.total} {t("egp")}
                    </span>
                  </div>
                  {pricing.nextTier && (
                    <p className="text-xs text-success !text-[#4ADE80] font-semibold flex items-center gap-1.5 pt-1">
                      <Check className="w-3.5 h-3.5" />
                      {t("nextTier", { n: pricing.nextTier.minQty - qty, p: pricing.nextTier.discountPercent })}
                    </p>
                  )}
                </div>
              )}

              {/* Feature checklist */}
              <div className="glass-card rounded-2xl p-4">
                <h4 className="text-sm font-bold text-gold mb-1">{t("featuresTitle")}</h4>
                <p className="text-xs text-slate-muted mb-3">{t("featuresSub")}</p>
                <div className="flex flex-wrap gap-2">
                  {FEATURE_IDS.map((id) => {
                    const on = featuresOn.has(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleFeature(id)}
                        aria-pressed={on}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all ${
                          on
                            ? "bg-gold/20 border-gold/50 text-gold shadow-[0_0_14px_rgba(198,165,104,0.12)]"
                            : "bg-white/5 border-white/10 text-slate-muted hover:border-gold/30 hover:text-slate-body"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        {t(`features.${id}`)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Menu mode fields */}
              {mode === "menu" && (
                <div className="glass-card rounded-2xl p-4 space-y-4">
                  <div>
                    <label className="form-label">{t("restaurantName")}</label>
                    <input
                      type="text"
                      value={restaurantName}
                      onChange={(ev) => {
                        setRestaurantName(ev.target.value);
                        clearError("restaurantName");
                      }}
                      placeholder={t("restaurantNamePh")}
                      className={inputClass("restaurantName")}
                    />
                    {errorEl("restaurantName")}
                  </div>
                  <div>
                    <label className="form-label">{t("menuDetail")}</label>
                    <textarea
                      rows={2}
                      value={menuDetail}
                      onChange={(ev) => setMenuDetail(ev.target.value)}
                      placeholder={t("menuDetailPh")}
                      className="form-textarea resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Customer fields */}
              <div className="glass-card rounded-2xl p-4 space-y-4">
                <h4 className="text-sm font-bold text-gold">{t("customerSection")}</h4>
                {mode === "product" && (
                  <div>
                    <label className="form-label">{t("name")}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(ev) => {
                        setName(ev.target.value);
                        clearError("name");
                      }}
                      placeholder={t("namePh")}
                      lang={locale === "ar" ? "ar" : undefined}
                      className={inputClass("name")}
                    />
                    {errorEl("name")}
                  </div>
                )}
                <div>
                  <label className="form-label">{t("phone")}</label>
                  <div className="relative">
                    <span
                      className={`absolute inset-y-0 start-0 flex items-center ps-3 text-sm font-bold transition-colors ${
                        errors.phone ? "text-red-400" : "text-gold"
                      }`}
                      dir="ltr"
                    >
                      +20
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      dir="ltr"
                      value={phone}
                      onChange={(ev) => {
                        setPhone(ev.target.value);
                        clearError("phone");
                      }}
                      placeholder="1xxxxxxxxxx"
                      className={`${inputClass("phone")} ps-12 text-right`}
                    />
                  </div>
                  {errorEl("phone")}
                </div>
                <div>
                  <label className="form-label">{t("email")} <span className="text-xs text-slate-muted/60">({t("optional")})</span></label>
                  <input
                    type="email"
                    value={email}
                    onChange={(ev) => {
                      setEmail(ev.target.value);
                      clearError("email");
                    }}
                    placeholder={t("emailPh")}
                    className={inputClass("email")}
                  />
                  {errorEl("email")}
                </div>
              </div>

              {/* Shipping fields */}
              {orderType === "shipping" ? (
                <div className="glass-card rounded-2xl p-4 space-y-4">
                  <h4 className="text-sm font-bold text-gold">{t("shippingSection")}</h4>
                  <div>
                    <label className="form-label">{t("governorate")}</label>
                    <select
                      value={gov}
                      onChange={(ev) => {
                        setGov(ev.target.value);
                        clearError("gov");
                      }}
                      className={inputClass("gov")}
                    >
                      <option value="">{t("governorate")}…</option>
                      {GOVERNORATES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                    {errorEl("gov")}
                  </div>
                  <div>
                    <label className="form-label">{t("city")}</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(ev) => {
                        setCity(ev.target.value);
                        clearError("city");
                      }}
                      lang={locale === "ar" ? "ar" : undefined}
                      className={inputClass("city")}
                    />
                    {errorEl("city")}
                  </div>
                  <div>
                    <label className="form-label">{t("address")}</label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(ev) => {
                        setAddress(ev.target.value);
                        clearError("address");
                      }}
                      placeholder={t("addressPh")}
                      lang={locale === "ar" ? "ar" : undefined}
                      className="form-textarea resize-none"
                    />
                    {errorEl("address")}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-muted flex items-center gap-1.5 px-1">
                  <Store className="w-4 h-4 text-gold/70" />
                  {t("pickupHint")}
                </p>
              )}

              {/* Notes */}
              <div className="glass-card rounded-2xl p-4">
                <label className="form-label">{t("notes")} <span className="text-xs text-slate-muted/60">({t("optional")})</span></label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(ev) => setNotes(ev.target.value)}
                  placeholder={t("notesPh")}
                  lang={locale === "ar" ? "ar" : undefined}
                  className="form-textarea resize-none"
                />
              </div>

              {errors._form && <p className="form-error text-center">{errors._form}</p>}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-gradient-gold text-matte-dark font-black text-base hover:shadow-[0_0_35px_rgba(198,165,104,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <MessageCircle className="w-5 h-5" />
                )}
                {submitting ? t("submitting") : t("submitWhatsApp")}
              </button>
              {errors._form === undefined && (
                <p className="text-center text-[11px] text-slate-muted/70 leading-relaxed">
                  {t("priceNote")}
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}