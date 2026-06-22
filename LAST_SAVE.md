# GoTap Project — Last Save Summary

> This file documents all changes made across sessions. The most recent session (Session 3) added 2 new themes (Spider-Man & Batman) with precise inline SVG paths, reordered themes for the Auto-Tap preview, and fixed mobile responsiveness.

---

## 📦 Session 3 — New Themes (Spider-Man & Batman) + Responsive Fix + Theme Reorder

> **Goal:** Add 2 new branded themes (Spider-Man, Batman) to the Auto-Tap preview slider, fix card responsiveness on mobile, replace generic SVGs with precise SVG paths, and reorder themes.

### Files Modified

| File | Change |
|------|--------|
| `src/lib/types.ts` | Added `"spiderman"` and `"batman"` to the `Theme` union type |
| `src/lib/constants.ts` | Added both themes to `ALL_THEMES`, `PRODUCT_THEMES["auto-tap"]`, and `THEME_ARCHETYPE` |
| `src/components/forms/AutoTapPreview.tsx` | Added 2 new theme blocks (Spider-Man, Batman) with inline SVG backgrounds; replaced generic SpiderWeb & BatmanLogoSvg with precise SVG paths; fixed responsive slider (mobile card width `max-w-[320px] w-[88%]`, arrows absolutely positioned at screen edges, `grid-cols-2 gap-3` for links); reordered all 9 themes |
| `src/components/profiles/ProfileWrapper.tsx` | Added routing: `spiderman` → `NeonRedTrackProfile`, `batman` → `NardoStealthProfile` |
| `src/messages/en.json` | Added `spiderman`, `spidermanDesc`, `batman`, `batmanDesc` translation keys |
| `src/messages/ar.json` | Added Arabic translations for the 4 new keys |

### Theme Details

| Theme | ID | Background | Overlay | Text |
|-------|-----|-----------|---------|------|
| **Batman** | `batman` | `bg-neutral-950` | Small Batman logos (`viewBox="0 0 24 12"`, `opacity-10`, 2:1 ratio) + foreground yellow logo below avatar | White, yellow-400 accent |
| **Spider-Man** | `spiderman` | `from-red-700 via-slate-900 to-blue-900` | 4 small spider web SVGs (`viewBox="0 0 100 100"`, `opacity-20`) at random positions | White, red/blue accent |
| **Energy Lightning** | `energy-lightning` | *(unchanged)* | *(unchanged)* | *(unchanged)* |
| **Neon Red Track** | `neon-red-track` | *(unchanged)* | *(unchanged)* | *(unchanged)* |
| **Cyber Cyan Drift** | `cyber-cyan-drift` | *(unchanged)* | *(unchanged)* | *(unchanged)* |
| **Nardo Stealth** | `auto-nardo-stealth` | *(unchanged)* | *(unchanged)* | *(unchanged)* |
| **Classic Royal Silver** | `classic-royal-silver` | *(unchanged)* | *(unchanged)* | *(unchanged)* |
| **Liquid Aurora** | `liquid-aurora` | *(unchanged)* | *(unchanged)* | *(unchanged)* |
| **Terminal Dark Glow** | `terminal-dark-glow` | *(unchanged)* | *(unchanged)* | *(unchanged)* |

### Precise SVG Paths Added

- **Spider Web**: `<path d="M50 0 L50 100 M0 50 L100 50 M15 15 L85 85 M15 85 L85 15" strokeWidth="0.5"/>` + curved `<path d="M50 20 Q40 30 30 50 Q40 70 50 80 Q60 70 70 50 Q60 30 50 20 Z M50 10 Q30 25 10 50 Q30 75 50 90 Q70 75 90 50 Q70 25 50 10 Z" strokeWidth="0.5"/>`
- **Batman Logo**: `<path d="M12 2c-.6 0-1 .4-1.5 1-.3.4-.4.8-.5 1.2-.4-.3-.9-.6-1.4-.7-.9-.2-1.8 0-2.6.5-.4.2-.7.6-.9 1-.5.9-.6 2-.2 3 .2.5.5.9.9 1.2.6.4 1.3.6 2 .5.8-.1 1.5-.5 2-1.1.2-.3.4-.6.5-1 .2.6.5 1.1.9 1.5.5.5 1.2.8 2 .9.7 0 1.4-.2 2-.6.4-.3.7-.7.9-1.2.4-1 .3-2.1-.2-3-.2-.4-.5-.8-.9-1-.8-.5-1.7-.7-2.6-.5-.5.1-1 .4-1.4.7 0-.4-.2-.8-.5-1.2C13 2.4 12.6 2 12 2z"/>` (viewBox 24×12)

### Responsive Fix (Mobile)

- Card width on mobile: `max-sm:w-[88%] max-sm:max-w-[320px] max-sm:mx-auto`
- Navigation arrows: moved to `absolute` at screen edges (`max-sm:absolute max-sm:left-2` / `max-sm:right-2`, `max-sm:top-1/2`) with semi-transparent background
- Social links grid: `grid grid-cols-2 gap-3` (was `gap-2`)

### New Theme Order (9 themes)

```
1. Batman          (was #9)
2. Spider-Man      (was #8)
3. Energy Lightning (was #7, moved up)
4. Neon Red Track
5. Cyber Cyan Drift
6. Nardo Stealth Luxury
7. Classic Royal Silver
8. Liquid Aurora
9. Terminal Dark Glow
```

---

## 📦 Session 2 — Complete i18n Localization

> **Goal:** When locale is `en` → all UI in English. When locale is `ar` → all UI in Arabic.  
> **Exception:** `customerName` (الاسم الثلاثي), `addressDetail`/`street` (تفاصيل العنوان) labels always show Arabic.

### Files Modified (Session 2)

| File | Change |
|------|--------|
| `src/messages/en.json` | Added: `liveStatsCounter`, `notFound`, `pricingInfo`, `uploadingWait`, `preview.*`, `totalLine`, `profile.noLinksAvailable`, `profile.labels.*`, `placeholders.*`, `toggleLanguage`, `toggleMenu` |
| `src/messages/ar.json` | Added: same keys translated to Arabic |
| `src/components/home/LiveStatsCounter.tsx` | Replaced hardcoded Arabic → `useTranslations("liveStatsCounter")` |
| `src/app/[locale]/(main)/not-found.tsx` | Replaced hardcoded English → `useTranslations("notFound")` |
| `src/components/forms/AutoTapForm.tsx:389,531,395` | Hardcoded Arabic pricing + uploading text + `(Optional)` → translation keys |
| `src/components/forms/SuccessModal.tsx:24-28,39` | Hardcoded product labels + Arabic total line → `t("totalLine")` |
| `src/components/forms/FormA_DigitalCards.tsx` | `(Optional)` + placeholders → `t("fields.optional")` + `t("placeholders.*")` |
| `src/components/forms/FormC_BusinessTap.tsx` | `(Optional)` + placeholder → translation keys |
| `src/components/forms/BaseForm.tsx:167` | `(Optional)` → `t("fields.optional")` |
| `src/components/forms/SocialLinksBlock.tsx:37` | `(Optional)` → `t("fields.optional")` |
| `src/components/forms/LogoUpload.tsx:74` | `(Optional)` → `t("fields.optional")` |
| `src/components/forms/AutoTapPreview.tsx` | "No links added yet", "Powered by Go Tap", aria-labels → translation keys |
| `src/components/layout/Navbar.tsx` | aria-labels → `t("toggleLanguage"/"toggleMenu")` |
| `src/components/profiles/ProfileWrapper.tsx` | Button labels (Call, Website, Location...) → `pl()` from `products.profile.labels` |
| 10 profile theme components | "No links available" + "Powered by GoTap/Go Tap" → `t("noLinksAvailable")` + `t("poweredBy")` |

### Always-Arabic Fields

| File | Field | Label Always Arabic |
|------|-------|-------------------|
| `BaseForm.tsx:204` | `customerName` | `الاسم الثلاثي بالعربي` |
| `BaseForm.tsx:209` | `street` | `الشارع / تفاصيل العنوان` |
| `AutoTapForm.tsx:288` | `customerName` | `الاسم الثلاثي بالعربي` |
| `AutoTapForm.tsx:317` | `addressDetail` | `العنوان بالتفصيل` |

---

## 📦 Session 1 — Instagram Fix + Initial i18n + Arabic Keyboard

### 1. `gas/Code.gs` — Google Apps Script Backend

| Line(s) | Change |
|---------|--------|
| `28-54` | `doPost()`: Handles both JSON (`e.postData.contents`) and form-encoded (`e.parameter`) submissions. |
| `36-46` | Dynamic Instagram key detection: iterates `orderData` keys with `lowerKey = key.toLowerCase().trim()`, matches `insta`, `انستا`, `انستجرام`. Cleans via `cleanInstagram()`. |
| `75-79` | `getOrders()`: Normalizes any sheet column containing `انستجرام`/`insta` to canonical key `يوزر انستجرام` (bypasses whitespace/hamza/spelling issues). |
| `196-205` | `addNewOrderWithImage()`: Fuzzy match for Instagram column in `headers.map()` — finds column by substring match, extracts value dynamically from `orderData`. |
| `225-233` | `cleanInstagram()`: Robust extraction — strips query params (`?igsh=...`), trailing slashes, protocol/domain, leading slashes. |

### 2. `gas/Index.html` — Dashboard Frontend

| Line(s) | Change |
|---------|--------|
| `84` | Removed `'يوزر انستجرام'` from `strictOrder` |
| `94` | Removed `'يوزر انستجرام'` from `COPY_FIELDS` |
| `96-104` | `cleanInstagram()` function (same robust logic as Code.gs) |
| `426-449` | Explicit Instagram row injection after Address field: direct key lookup, URL extraction via `split('/').pop().split('?')[0]`, fallback `"لم يتم إدخاله من الموقع"`, green SVG copy button with `copyText(document.getElementById(...).innerText, this)`. |

### 3. `src/lib/submitOrder.ts` — Next.js Form Submission

| Line | Change |
|------|--------|
| `102` | Added `"يوزر انستجرام": data.socialLinks?.instagram \|\| ""` to the GAS payload — this was the **root cause** of the missing Instagram data. |

### 4. `src/messages/en.json` & `src/messages/ar.json` — Initial Translation Files

| Section Added | Keys |
|---------------|------|
| `faq` | `title`, `q1`-`q3`, `a1`-`a3` |
| `cafeShowcase` | `title`, `desc`, `benefit1Title`-`benefit3Desc` |
| `reviewGallery` | `title`, `subtitle` |
| `messages` | `waitUpload`, `sending`, `sent`, `failed`, `networkError`, `loading` |
| `currency` | `egp` |

### 5. React Components — Initial Translation Hardcoded → Dynamic (Session 1)

| File | Change |
|------|--------|
| `FaqAccordion.tsx` | FAQ Q&A → `useTranslations("faq")` |
| `CafeShowcaseSection.tsx` | Benefits + headings → `useTranslations("cafeShowcase")` |
| `ReviewGallery.tsx` | Title/subtitle → `useTranslations("reviewGallery")` |
| `AutoTapForm.tsx` | 6 toast/loading strings → `tm("waitUpload"/"sending"/"networkError"/"sent"/"failed")` |
| `BaseForm.tsx` | 3 toast/loading strings → `tm("sending"/"sent"/"failed")` |
| `LogoUpload.tsx` | Network error → `tm("networkError")` |
| `LoadingProvider.tsx` | Default loading → `tm("loading")` |
| `SuccessModal.tsx` | "ج.م"/"جنيه" → `tc("egp")` |

### 6. React Components — Arabic Keyboard Forcing (`lang="ar"`)

| File | Fields |
|------|--------|
| `BaseForm.tsx:170` | `customerName`, `displayName`, `governorate`, `city`, `street` |
| `AutoTapForm.tsx` | `customerName` (~290), `addressDetail` (~318), `displayName` (~396), `orderNotes` textarea (~655) |
| `FormC_BusinessTap.tsx:24` | `establishmentName` |

---

## 🔁 Data Flow (Final)

```
Next.js Form (socialLinks.instagram)
  → submitOrder.ts: gasPayload["يوزر انستجرام"]
    → doPost: dynamic key search → cleanInstagram()
      → addNewOrderWithImage: fuzzy column match → sheet cell
        → getOrders: normalize key → order["يوزر انستجرام"]
          → Index.html: direct key lookup → clean/extract → display + copy
```

---

## ✅ Status

| Feature | Status |
|---------|--------|
| Instagram captured from any form key name | ✅ |
| Instagram cleaned before saving to sheet | ✅ |
| Instagram rendered in dashboard cards | ✅ |
| Copy button with "✓ تم النسخ" feedback | ✅ |
| Empty Instagram → "لم يتم إدخاله من الموقع" | ✅ |
| FAQ/CafeShowcase/ReviewGallery bilingual | ✅ |
| Toast/loading messages bilingual | ✅ |
| Currency symbol bilingual | ✅ |
| Arabic keyboard on Arabic fields | ✅ |
| English keyboard on social/URL fields | ✅ |
| **Full UI i18n** (LiveStats, 404, forms, placeholders, (Optional)) | ✅ |
| **Always-Arabic fields** (customerName, addressDetail, street) | ✅ |
| **Profile button labels** translated (Call, Website, Location...) | ✅ |
| **Profile empty states + branding** translated (No links, Powered by) | ✅ |
| **AutoTapPreview** translated (labels, alt, aria) | ✅ |
| **Spider-Man theme** (gradient + web SVGs + red/blue accents) | ✅ |
| **Batman theme** (black bg + bat logo SVGs + yellow accent) | ✅ |
| **Precise SVG paths** (spider web + batman logo) | ✅ |
| **Mobile responsive fix** (wider card, absolute arrows, grid gap) | ✅ |
| **Theme reorder** (batman → spiderman → energy → rest) | ✅ |
| **Navbar aria-labels** translated | ✅ |
