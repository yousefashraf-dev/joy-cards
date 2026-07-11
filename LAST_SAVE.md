# GoTap Project — Last Save Summary

> This file documents all changes made across sessions. Newest first.

---

## 📦 Session 15 — Cafe Page English-only + New Fields (YouTube, Email, Bio, Working Hours, Share)

**Date:** 11 Jul 2026  
**Goal:** Full English hardcode, smart social grid, YouTube/Email as social circles, Bio, Working Hours with 12h & Closed toggle, Share button.

### Changes

| Area | Files | Change |
|------|-------|--------|
| **Menu Button** | `cafe/[slug]/page.tsx` | "Menu" hardcoded (removed `t("browseMenu")`) |
| **English-only** | `cafe/[slug]/page.tsx` | Hardcoded all `t()` → English text; removed `useTranslations` |
| **Social Grid** | `cafe/[slug]/page.tsx` | Smart layout: even=2 cols, odd≥5=last row 3, odd=3=3 cols, 1=centered |
| **Payment Layout** | `cafe/[slug]/page.tsx` | Both → 2 cols, one → centered `max-w-xs mx-auto` |
| **Go Tap Footer** | `cafe/[slug]/page.tsx` | "Powered by Go Tap" → clickable link to `https://gotap.vercel.app/ar` |
| **YouTube Field** | `cafe-schema.ts`, `CafeForm.tsx`, `page.tsx` | New input in form; displayed as social circle (removed standalone section) |
| **Email Field** | `cafe-schema.ts`, `CafeForm.tsx`, `page.tsx` | New input in form; displayed as social circle with Mail icon |
| **Bio Field** | `cafe-schema.ts`, `CafeForm.tsx`, `page.tsx` | New textarea in form; displayed under cafe name above Menu |
| **Working Hours** | `cafe-schema.ts`, `CafeForm.tsx`, `page.tsx` | Dynamic rows with day+open+close+Closed checkbox; modal with 12h AM/PM display |
| **Share Button** | `cafe/[slug]/page.tsx` | Round share icon below footer (`navigator.share` / clipboard fallback) |
| **i18n** | `ar.json`, `en.json` | Added `email`, `bio`, `bioPlaceholder`, `workingHours`, `addHour` keys |

### Files Modified

| File | Change |
|------|--------|
| `src/lib/cafe-schema.ts` | Added `email`, `youtubeUrl`, `bio`, `workingHours` to `Cafe` + `WorkingHour` type + deserialization |
| `src/components/admin/CafeForm.tsx` | Added Email input, YouTube input, Bio textarea, Working Hours rows with Closed checkbox |
| `src/app/[locale]/cafe/[slug]/page.tsx` | English hardcode, smart social grid, YouTube/Email circles, Hours modal (12h+Closed), Share button |
| `src/messages/ar.json` | New translation keys |
| `src/messages/en.json` | New translation keys |

### Commits
```
a3b7422 fix: cafe page smart social grid (even=2, odd=3), Menu hardcoded, payment centered
d92a9bd fix: hardcode cafe page to English-only + Go Tap clickable footer
64fc7f5 feat: add youtubeUrl, bio, workingHours fields + share button
364fd22 feat: add email field, YouTube/Email as circles, Closed toggle, 12h display
ad08491 fix: add missing email deserialization in getCafeBySlug
```

### Build Status
- ✅ `npx tsc --noEmit` — 0 errors
- ✅ Dev server `localhost:3000` — 200

---

## 📦 Session 14 — Telegram Mapping Fix + Payment Section Redesign + InstaPay URL Fix

**Date:** 01 Jul 2026
**Goal:** إصلاح مشاكل ما بعد إضافة التيليجرام (mapping ناقص في getCafeBySlug)، تحسين شكل أزرار الدفع، وإصلاح رابط InstaPay/Vodafone.

### Changes

| Issue | File(s) | Fix |
|-------|---------|-----|
| **Telegram icon لا يظهر** | `src/lib/cafe-schema.ts:131` | إضافة `telegram: data.telegram` الناقصة في `getCafeBySlug` (كانت موجودة فقط في `getAllCafes`) |
| **Telegram URL مكسور مع الرابط الكامل** | `src/app/[locale]/cafe/[slug]/page.tsx:238-240` | إضافة check: لو الرابط يبدأ بـ `http` → استخدمه مباشرة، لو username → `https://t.me/` + الاسم |
| **Payment section شكل مش لطيف** | `src/app/[locale]/cafe/[slug]/page.tsx:399-455` | إزالة الأكواد الخام (`*9*7*...` و رقم InstaPay)، زراير أكبر `p-5` + أيقونات `w-10`، إضافة عنوان "Payment Methods" + hover scale |
| **InstaPay deep link لا يعمل في Safari** | `src/app/[locale]/cafe/[slug]/page.tsx:258-260` | إضافة check للرابط الكامل: لو دخل رابط HTTP يستخدمه مباشرة، لو رقم/id يستخدم `instapay://` deep link |
| **Vodafone Cash deep link** | `src/app/[locale]/cafe/[slug]/page.tsx:255-257` | نفس المعالجة: رابط كامل → مباشر، رقم → USSD deep link `tel:*9*7*...` |
| **payMethods translation** | `src/messages/ar.json:373`, `en.json:373` | إضافة `"payMethods": "طرق الدفع" / "Payment Methods"` |

### Build Status
- ✅ `npx tsc --noEmit` — 0 errors
- ✅ `npx next build` — Compiled successfully

### Commits
```
a3433c9 fix: add telegram field mapping to getCafeBySlug + handle full URL in cafe page
23eff3e fix: handle full URL for InstaPay & Vodafone Cash in cafe page
84300f0 fix: improve payment section design (remove raw codes, cleaner buttons) + add payMethods translation
```

---

## 📦 Session 13 — Telegram Social Link (Auto Tap + Business Tap + Profiles)

**Date:** 01 Jul 2026
**Goal:** إضافة تيليجرام كمنصة تواصل اجتماعي جديدة في فورم السيارات، فورم الكافيه، صفحة الكافيه، والبروفايلات.

### Changes

| Area | File(s) | Change |
|------|---------|--------|
| **Types** | `src/lib/types.ts:35` | إضافة `telegram?: string` لـ `SocialLinks` |
| **Link Format** | `src/lib/formatSocialLink.ts:6,27` | إضافة `"telegram"` لـ `Platform` + بروتوكول `https://t.me/` |
| **Cafe Schema** | `src/lib/cafe-schema.ts:33,96` | إضافة `telegram?: string` لـ `Cafe` + deserialization (في `getAllCafes` فقط — تم إصلاحه في Session 14) |
| **Auto Tap Form** | `src/components/forms/AutoTapForm.tsx:288` | إضافة حقل تيليجرام في `SOCIAL_FIELDS` (أيقونة `Send`) |
| **Auto Tap Preview** | `src/components/forms/AutoTapPreview.tsx:19,81` | إضافة `Telegram: Send` في `iconMap` و `SOCIAL_LINK_MAP` |
| **Profile Wrapper** | `src/components/profiles/ProfileWrapper.tsx:28,38,85` | إضافة تيليجرام في `iconMap` + `buildButtons` |
| **Cafe Form (Admin)** | `src/components/admin/CafeForm.tsx:37,133,498-507` | إضافة state + input + submission لتليجرام |
| **Cafe Page** | `src/app/[locale]/cafe/[slug]/page.tsx:237-242,391` | إضافة تيليجرام لـ `socialItems` + label |
| **Messages AR** | `src/messages/ar.json:174,470` | `"telegram": "تيليجرام"` في `fields` و `admin.form` |
| **Messages EN** | `src/messages/en.json:174,470` | `"telegram": "Telegram"` في `fields` و `admin.form` |

### Build Status
- ✅ `npx tsc --noEmit` — 0 errors
- ✅ `npx next build` — Compiled successfully

---

## 📦 Session 12 — Copy Refinements (Business Tap + Digital Card CTA) & Build Fix

**Date:** 01 Jul 2026
**Goal:** تعديل نصوص ProductsGrid — توسيع مسمى "المطاعم والكافيهات" ليشمل المتاجر، وتغيير CTA الكارت الذكي من "تواصل معنا" إلى "اطلب الآن".

### Changes

| Area | File(s) | Change |
|------|---------|--------|
| **Business Tap Rename** | `src/messages/ar.json:21,91` | `"المطاعم والكافيهات"` ← `"للمطاعم والكافيهات والمتاجر"` |
| | `src/messages/en.json:21,91` | `"Restaurants & Cafes"` ← `"Restaurants, Cafes & Stores"` |
| **Digital Card CTA** | `src/messages/ar.json:56` | `"تواصل معنا لطلب الكارت"` ← `"اطلب الآن"` |
| | `src/messages/en.json:56` | `"Contact Us to Order"` ← `"Order Now"` |
| **Upload API Error Handling** | `src/app/api/upload/route.ts` | إزالة `fetch_format` غير الصالح لـ `upload_stream` + إضافة `uploadStream.on("error", reject)` |
| | `src/components/admin/CafeForm.tsx` | تحسين `res.json()` — لو السيرفر رجع HTML، يقرأ `res.text()` لعرض الخطأ |
| | `src/components/admin/ProductForm.tsx` | نفس التحسين |
| **Social Links Reorder** | `src/components/profiles/ProfileWrapper.tsx` | إعادة ترتيب الأزرار: `Insta → TikTok → FB → Snap → Call → WA` |
| **Icon Routes (404 Fix)** | `src/app/[locale]/icon.tsx` | **جديد** — أيقونة لـ `/[locale]/icon` |
| | `src/app/[locale]/apple-icon.tsx` | **جديد** — أيقونة لـ `/[locale]/apple-icon` |
| **Cafe Page Redesign** | `src/app/[locale]/cafe/[slug]/page.tsx` | إعادة ترتيب الأقسام + SVG أيقونات دفع حقيقية (Vodafone Cash, InstaPay) + Social Links كـ 2-column grid |
| **Build Fix** | `node_modules/typescript` | إعادة تثبيت TypeScript — ملف `typescript.js` كان تالفاً (حرف `a` متحول إلى U+FFFD) مسبباً `Invalid or unexpected token` في `next build` |

### Build Status
- ✅ `npx tsc --noEmit` — 0 errors
- ✅ `npx next build` — Compiled successfully
- ✅ Vercel auto-deploy after push to `production-release`

### Commit
```
a3b140e feat: business tap rename, digital cards CTA fix, upload error handling, cafe redesign, and new icon routes
```

---

## 📦 Session 11 — Smart Card Redesign, Home Page Cleanup & Copy Refinements

**Date:** 01 Jul 2026
**Goal:** إعادة تصميم صفحة الكارت الذكي، تنظيف الصفحة الرئيسية، وتحسين النصوص.

### Files Created/Deleted

| File | Action |
|------|--------|
| `src/components/home/LiveStatsCounter.tsx` | **حذف** — عداد 240+ أوردر |
| `src/components/home/ReviewGallery.tsx` | **حذف** — صور آراء العملاء |

### Files Modified

| File | Change |
|------|--------|
| `src/app/[locale]/(main)/digital-cards/page.tsx` | **إعادة كتابة كاملة** — إزالة الأسعار و BaseForm بالكامل، إضافة لستة "إيه اللي تقدر تضيفه على الكارت؟" (سوشيال ميديا، إيميل، لينكد إن، InstaPay، CV، الموقع، الخ)، زر "تواصل معنا" واتساب، تحسين SVG animation |
| `src/app/[locale]/(main)/page.tsx` | إزالة `<LiveStatsCounter />` و `<ReviewGallery />` |
| `src/messages/ar.json` | تبسيط نصوص الكارت الذكي، إضافة `whatYouCanAdd` array، تعديل `nav.shop` و `hero.subheadline` |
| `src/messages/en.json` | نفس التغييرات بالإنجليزية |

### Key Changes

#### 1. صفحة الكارت الذكي — إعادة تصميم كاملة
- **إزالة:** Pricing Bar (3 خطوات الأسعار) + BaseForm بالكامل (بيانات شخصية، شعار، سوشيال، product fields)
- **إضافة:**
  - قسم "إيه اللي تقدر تضيفه على الكارت؟" — لستة واضحة: حسابات السوشيال ميديا، البريد الإلكتروني، لينكد إن، طرق الدفع (InstaPay/فودافون كاش)، السيرة الذاتية PDF، الموقع الإلكتروني، الاسم والمسمى الوظيفي، الموقع على الخريطة
  - زر "تواصل معنا لطلب الكارت" → واتساب برسالة جاهزة
  - SVG Animation محدّثة: ألوان ذهبية + الكارت يتحرك ناحية الموبايل + شاشة الموبايل تظهر PROFILE / TAP RECEIVED
- **تبسيط النصوص:** إزالة التكرار، وصف مختصر ومباشر

#### 2. الصفحة الرئيسية — تنظيف
- **إزالة عداد "+240 أوردر ناجح"** — حذف `LiveStatsCounter.tsx`
- **إزالة صور آراء العملاء** — حذف `ReviewGallery.tsx`

#### 3. تحسينات النصوص
- **Navbar:** "متجر الميداليات والإكسسوارات" ← "متجر الإكسسوارات"
- **Hero section:** إزالة "ملفات السيارات / car profiles" من الوصف (غير دقيق)
  - AR: "بطاقات العمل، ملفات السيارات، قوائم المطاعم" ← "بطاقات العمل الرقمية، قوائم المطاعم، روابط التواصل"
  - EN: "business cards, car profiles, restaurant menus" ← "digital business cards, restaurant menus, social links"

### Build Status
- ✅ TypeScript compiles without errors (`tsc --noEmit`)

---

## 📦 Session 10 — Cafe Themes Engine & Page Design Overhaul

**Date:** 01 Jul 2026
**Goal:** إضافة نظام ثيمات متعدد لصفحة الكافيه (كافيه / مطعم / ورد / فيب) + تحسينات تصميم شاملة.

### Files Created

| File | Description |
|------|-------------|
| `src/lib/cafe-themes.ts` | تعريفات الـ 4 ثيمات (ألوان، خلفيات، أكسنت) + تصدير `CafeTheme` type |

### Files Modified

| File | Change |
|------|--------|
| `src/lib/cafe-schema.ts` | إضافة `theme?: CafeTheme` للـ interface + serialization (default `"cafe"`) |
| `src/app/[locale]/layout.tsx` | إضافة **Playfair Display** font (`--font-heading`) |
| `src/app/[locale]/cafe/[slug]/page.tsx` | **إعادة كتابة كاملة**: ثيمات ديناميكية، 4 خلفيات مختلفة، SVGs زخرفية خلف المحتوى، تغيير خط الاسم، إصلاح زرار المنيو، إعادة ترتيب الأقسام، كل النصوص إنجليزي |
| `src/components/admin/CafeForm.tsx` | إضافة 4 أزرار لاختيار الثيم (كافيه / مطعم / ورد / فيب) |
| `src/messages/ar.json` | إضافة `admin.form.theme` |
| `src/messages/en.json` | إضافة `admin.form.theme` |

### الـ 4 ثيمات

| الثيم | الخلفية | الأكسنت | الزخرفة (3 SVG لكل ثيم) |
|-------|---------|---------|------------------------|
| **☕ كافيه** | Matte black `#1A1A1A` → `#0D0D0D` | دهبي `#D4AF37` | 3 فناجين قهوة بأحجام مختلفة |
| **🍽️ مطعم** | بني دافئ `#1C1510` → `#0D0A08` | دهبي `#D4AF37` | 3 أطباق مع شوكة وسكينة |
| **🌹 ورد** | أسود مع لمسة حمراء `#0D0A0A` → `#0D0505` | دهبي `#D4AF37` | 3 وردات متفتحة |
| **💨 فيب** | أسود خالص `#0A0A0A` → `#050505` | أبيض `#FFFFFF` | 2 فيب + زازة ليكود |

### تحسينات التصميم

| التغيير | قبل | بعد |
|---------|-----|-----|
| **خط اسم الكافيه** | `Dancing Script text-4xl` | `Playfair Display text-3xl font-bold` |
| **ألوان الخلفية** | Navy بارد | حسب الثيم (أسود/بني/أسود محمر/أسود خالص) |
| **SVGs خلفية** | — | 3 رسومات لكل ثيم، شفافية 15% |
| **زرار المنيو** | معطل لما `menuUrl` فاضي | بيشتغل مع `menuImages` كمان |
| **ترتيب الأقسام** | منيو → دفع → سوشيال | منيو → سوشيال → دفع |
| **شكل السوشيال** | مربعات `rounded-2xl` | **دواير** `w-20 h-20 rounded-full` (2 لكل سطر) |
| **حجم كروت الدفع** | `p-5` / أيقونة `w-10` | `p-3` / أيقونة `w-8` — أنحف وأرقى |
| **لغة العرض** | عربي (حسب locale) | **إنجليزي ثابت** (hardcoded) |
| **SVG فودافون كاش** | علامة قديمة | علامة تنصيص حمرا زي الأصل |
| **SVG انستا باي** | سهم فوق + نقطة | سهم يمين نقي زي الأصل |
| **أرقام الدفع** | `text-[10px]` بارزة | `text-[9px] opacity-60` خفيفة |
| **أسماء السوشيال** | lowercase `facebook` | Capitalized `Facebook` |

### Build Status
- ✅ TypeScript compiles without errors (`tsc --noEmit`)

---

## 📦 Session 9 — Auto-Tap Form Restructuring (Two Funnels)

**Date:** 01 Jul 2026
**Goal:** إعادة بناء Form تاب السيارات بمسارين (أيقونة/يوزر) بخطوات واضحة وتصميم لاكشري.

### Key Changes

| Area | Changes |
|------|---------|
| **Two Funnels** | Icon (100 EGP, 6 steps) / Username (150 EGP, 6 steps) — step indicator adapts per type |
| **Platform Selection (New Step)** | 3 compact cards (Instagram/TikTok/Snapchat) with small images `w-10 h-10`, gold border on select |
| **Sticker Type Cards** | Redesigned — Icon shows 3 platform icons + "+" + "5×5 cm"; Username shows `@username` badge + "مقاس مخصص" |
| **Pricing** | `calcBasePrice(stickerType)` → 100 icon / 150 username (was flat 200). `calcTotal` takes stickerType param |
| **Customization Step** | 6 social link fields (Insta, TikTok, Snap, FB, WhatsApp, Phone) in 3×2 grid + Display Name + Logo upload (new circle design w/ gold border) |
| **Logo Upload** | New circular design: `w-28 h-28` gold dashed border, camera/upload icon, click-to-upload (hidden input) |
| **Order Notes** | Removed from shipping & customization → moved to sizing step (only for username) |
| **Manual Size Input** | New input field in sizing step for custom size (in addition to 6/25/35 presets) |
| **Theme Preview** | AutoTapPreview now reads all 6 social links from `data.socialLinks` using `formatSocialLink` |
| **Scatter Background** | Added collision detection: minimum 14% distance between items, 30 retries per item |
| **Navigation** | Completely simplified — `step` is index into `currentSteps` array, no more complex mapping/skipping logic |

### Files Modified

| File | Change |
|------|--------|
| `src/lib/types.ts` | Added `selectedPlatform` to `AutoTapFormData` and `AutoTapFields` |
| `src/lib/pricing.ts` | `calcBasePrice(stickerType)` → 100/150; `calcTotal(stickerType, address)` |
| `src/components/forms/AutoTapForm.tsx` | **Major rewrite** — 7-step ALL_STEPS array, two-funnel navigation, new sticker type cards, platform step, 6 social links, new logo upload UI, manual size input, orderNotes in sizing step |
| `src/components/forms/AutoTapPreview.tsx` | Reads all 6 social links from `data.socialLinks` using `formatSocialLink`; imports Platform type |
| `src/lib/scatterBackground.ts` | Added `distance()` function + collision avoidance loop (minDist=14, maxAttempts=30) |
| `src/lib/submitOrder.ts` | Added `selectedPlatform` to autoTapFields + buildProductDetails includes platform name |
| `src/app/[locale]/(main)/auto-tap/page.tsx` | Updated INITIAL_DATA with `selectedPlatform: ""`; dynamic pricing bar (100 icon / 150 username / both if none) |
| `src/messages/ar.json` | Added `steps.platform`, `section.platform` |
| `src/messages/en.json` | Added `steps.platform`, `section.platform` |

### New Images (public/)
- `instgram.png`, `tik tok.png`, `snap chat.png`

### Flow Summary

**Icon Flow (100 EGP + shipping):**
```
stickerType → platform → shipping → customization (6 links + logo) → theme → review
```

**Username Flow (150 EGP + shipping):**
```
stickerType → shipping → customization (6 links + logo) → theme → sizing (3 presets + manual input + notes) → review
```

### Test Status
- ✅ Dev server — works on `localhost:3000`
- ✅ `/ar/auto-tap` — 200, `/en/auto-tap` — 200
- ✅ No MISSING_MESSAGE errors
- ✅ TypeScript compiles without errors (`tsc --noEmit`)

---

## 📦 Session 8 — Cafe Premium Redesign + Auto-Tap Vector UI

**Date:** 30 Jun 2026
**Goal:** إعادة هيكلة صفحة الكافيه (Premium Layout + Payment Deep Links) + إكمال خطة تاب السيارات.

### Cafe Section — Premium Redesign

| File | Change |
|------|--------|
| `src/lib/cafe-schema.ts` | إضافة `vodafoneCash` و `instaPay` للـ interface |
| `src/components/admin/CafeForm.tsx` | إضافة 2 input: Vodafone Cash + InstaPay |
| `src/app/[locale]/cafe/[slug]/page.tsx` | **إعادة كتابة كاملة** — تصميم بريميوم |
| `src/messages/ar.json` | إضافة `cafe.payVodafone` / `cafe.payInstaPay` |
| `src/messages/en.json` | إضافة `cafe.payVodafone` / `cafe.payInstaPay` |

### Auto-Tap — Flat Rate + Vector UI

| File | Change |
|------|--------|
| `src/lib/pricing.ts` | `calcBasePrice()` ترجع 200 ثابت |
| `src/components/forms/AutoTapForm.tsx` | Step 0: Vector Cards بدل الصور / Step 2: Live Preview Widget |
| `src/app/[locale]/(main)/auto-tap/page.tsx` | تصميم Navy/Gold — Pricing Bar |

### Build Status
- ✅ `npm run build` — Compiled successfully
- ✅ Deep Links: Vodafone Cash USSD + InstaPay app scheme

---

## 📦 Session 7 — Production Readiness & Bug Fixes

**Date:** 27 Jun 2026
**Goal:** Fix upload on mobile/in-app browsers, fix MISSING_MESSAGE errors, add multi-image carousel.

### Changes

| Issue | File(s) | Fix |
|-------|---------|-----|
| Upload dead on mobile | `AutoTapForm.tsx` | Removed `preventDefault/stopPropagation`; added `relative z-50 pointer-events-auto` |
| Avatar upload | `AutoTapPreview.tsx` | Added `z-50 pointer-events-auto` |
| `MISSING_MESSAGE: cta` | `messages/ar.json`, `messages/en.json` | Added `"cta"` to second `products.autoTap` key |
| Missing fallback | `ProductsGrid.tsx` | Added `\|\| "Order Now"` |
| GOTAP.EG TERMINAL | `TerminalDarkGlowProfile.tsx` | Removed header; fixed footer link |
| Extra Batman logo | `BatmanProfile.tsx`, `AutoTapPreview.tsx` | Removed from content area |
| Digital Card nav link | `Navbar.tsx` | Re-added `/digital-cards` |
| Multi-image carousel | `ShopProducts.tsx`, `shop/page.tsx` | Replaced single img with scroll-snap carousel |
| Footer link | `AutoTapPreview.tsx` | Changed to `https://gotap.eg` |

### Build Status
- ✅ Compiled successfully
- ✅ No MISSING_MESSAGE errors
- ✅ Upload confirmed working on mobile & in-app browsers

---

## 📦 Session 6 — Layout Architecture Rollback

**Date:** 26 Jun 2026
**Goal:** Fix broken card layout (background scatter + avatar), clean console errors.

### Key Fixes
- Applied `ringClass` to avatar wrapper (theme-specific ring + shadow)
- Replaced dynamic Tailwind classes with inline `style` in `generateScatter()`
- Removed `mobileScale`/`mobileOpacity` from scatter configs
- Lowered opacities to 0.08–0.15
- Replaced framer-motion auto-scroll with native horizontal scroll in ReviewGallery
- Added `.scrollbar-none` utility in `globals.css`
- Fixed MISSING_MESSAGE for `helper.previewGuide` and `section.size`

### Files Modified: `scatterBackground.ts`, `AutoTapPreview.tsx`, all 7 theme profiles, `types.ts`, `AutoTapForm.tsx`, `ReviewGallery.tsx`, `globals.css`, `messages/ar.json`

---

## 📦 Session 5 — Major Refactoring & New Features

**Date:** 25 Jun 2026
**Goal:** Full site restructuring — themes, Hero Motion, Navbar, Shop, Reviews, Dashboard CRUD.

### Key Changes

| Area | Changes |
|------|---------|
| **Themes** | 5 new themes → 9 in Selector, custom gradients per theme |
| **Pricing** | Flat 200 EGP |
| **Dashboard CRUD** | `product-schema.ts`, `ProductForm.tsx`, `ProductTable.tsx` |
| **Hero Motion** | NFC gold circle + Smartphone SVG + Framer Motion animation |
| **Shop** | `ShopProducts.tsx`, `shop/page.tsx` + Product Detail Modal |
| **Review Gallery** | Infinite Moving Carousel |
| **Navbar** | 4 links: Home, Car Tap, Restaurants & Cafes, Shop |
| **i18n** | Added shop, autoTap, admin CRUD keys |

### New Files: `product-schema.ts`, `ProductForm.tsx`, `ProductTable.tsx`, `HeroMotion.tsx`, `ShopProducts.tsx`, `ProductDetailModal.tsx`, `shop/page.tsx`

---

## 📦 Session 4 — Issues Found (Code Review)

| Issue | File | Fix |
|-------|------|-----|
| Intl missing variable | `CafeForm.tsx:175` | `{t("slugHelper", { slug })}` |
| Upload to Cloudinary | `cafe-schema.ts`, `CafeForm.tsx` | Logo + menu images → Cloudinary, PDFs → Firebase |
| Missing `sizes`/`priority` | 8 files | Added `<Image>` required props |

---

## 📦 Session 3 — Spider-Man & Batman Themes

| File | Change |
|------|--------|
| `src/lib/types.ts` | Added `"spiderman"` and `"batman"` to `Theme` |
| `src/lib/constants.ts` | Added both themes to `ALL_THEMES`, `PRODUCT_THEMES`, `THEME_ARCHETYPE` |
| `src/components/forms/AutoTapPreview.tsx` | Added 2 theme blocks, precise SVG paths |
| `src/components/profiles/ProfileWrapper.tsx` | Added routing for spiderman/batman |
| `src/messages/*.json` | Added translation keys |

---

## 📦 Session 2 — Complete i18n Localization

Full bilingual support (EN/AR). All 10 profile components, ProfileWrapper, AutoTapPreview → translation keys. Always-Arabic fields: `customerName`, `addressDetail`, `street`.

---

## 📦 Session 1 — Instagram Fix + Initial i18n

**Google Apps Script:** Robust Instagram key detection (fuzzy match any variant: `insta`, `انستا`, `انستجرام`). `cleanInstagram()` strips query params, trailing slashes, protocol/domain.

**Dashboard:** Explicit Instagram row injection with copy button.

**Next.js Form:** Added `"يوزر انستجرام"` to GAS payload (`submitOrder.ts:102`).

---

## 🔁 Data Flow (Instagram)

```
Next.js Form (socialLinks.instagram)
  → submitOrder.ts: gasPayload["يوزر انستجرام"]
    → doPost: dynamic key search → cleanInstagram()
      → addNewOrderWithImage: fuzzy column match → sheet cell
        → getOrders: normalize key → order["يوزر انستجرام"]
          → Index.html: direct key lookup → clean/extract → display + copy
```

---

## ✅ Current Status

| Feature | Status |
|---------|--------|
| 4 Cafe themes (cafe/restaurant/flowers/vape) with dynamic backgrounds & SVGs | ✅ |
| Cafe social links as circles (2 per row) | ✅ |
| Cafe payment section (Vodafone/InstaPay) with brand logos | ✅ |
| Cafe page English-only display | ✅ |
| Cafe page Premium layout with menu modal, wifi modal | ✅ |
| Cafe page renamed to "Restaurants, Cafes & Stores" | ✅ |
| Auto-Tap Two Funnels (Icon/Username) | ✅ |
| 14 profile themes with responsive scattered backgrounds | ✅ |
| Shop section + full store page with multi-image carousel | ✅ |
| Dashboard CRUD (Cafes + Products) | ✅ |
| Full UI i18n (EN/AR) — except cafe page is hardcoded EN | ✅ |
| Avatar upload — works on mobile, desktop & in-app browsers | ✅ |
| Zero `preventDefault` blocking mobile file dialogs | ✅ |
| Hero Motion interactive NFC animation | ✅ |
| Flat pricing (Auto-Tap multi, Cafe) | ✅ |
| Smart Card page — redesigned (CTA: "اطلب الآن") | ✅ |
| Home page — cleaned (removed stats counter + review gallery) | ✅ |
| Navbar & copy — "متجر الإكسسوارات", cleaner hero text | ✅ |
| Icon routes — `/ar/icon` + `/ar/apple-icon` fixed | ✅ |
| Upload API — proper error handling (non-JSON responses) | ✅ |
| Social links — reordered Insta → TikTok → FB → Snap → Call → WA | ✅ |
| Telegram — added to Auto-Tap form, Cafe form, profiles, and cafe page | ✅ |
| Payment section — cleaner design (no raw codes, bigger buttons, "Pay via" labels) | ✅ |
| InstaPay/Vodafone deep links — handle both full URLs and IDs | ✅ |
| TypeScript: `tsc --noEmit` passes | ✅ |
| Production build: `next build` passes | ✅ |
| Vercel auto-deploy from `production-release` | ✅ |

## ✅ Current Status

### Notes
- **Admin password:** `oreo2552000` (sessionStorage-based auth)
- **WhatsApp:** 01558599678 (personal), 01095976766 (commercial)
- **Shipping:** 50 EGP Cairo/Governorates, 70 EGP Upper Egypt/Coastal
- **Cafe theme colors:**
  - Cafe: matte black `#1A1A1A` + gold `#D4AF37`
  - Restaurant: warm brown `#1C1510` + gold `#D4AF37`
  - Flowers: dark red-black `#0D0A0A` + gold `#D4AF37`
  - Vape: pure black `#0A0A0A` + white `#FFFFFF`
- **Upload:** uses `useRef` + `className="hidden"` + `onClick` trigger — compatible with in-app browsers
- **Git branch:** `production-release` — pushed to `origin` (github.com/yousefashraf-dev/joy-cards.git)
