# Last Save — مشروع GoTap

موقع NFC ذكي ثنائي اللغة (EN/AR) — Next.js 16.2.9, Tailwind v4, Firebase, Cloudinary, GAS

## Stack
`Next.js 16` `TypeScript` `Tailwind v4` `Framer Motion` `next-intl` `Firebase Admin/Client` `Cloudinary` `GAS`

## المنتجات
- **Auto-Tap** — ملصقات NFC للسيارات (7 ثيمات)
- **Digital Cards** — كرت تعريف شخصي NFC (3 ثيمات)
- **Business-Tap** — تاجات للمطاعم والكافيهات (3 ثيمات)
- **Legacy** — 3 ثيمات عامة = 16 ثيم إجمالاً

---

## سجل الجلسات

### الجلسة 1 — التأسيس
`next.config.ts` `i18n` `middleware` `.env.local` — البنية التحتية الكاملة.

### الجلسة 2 — ثيمات أولية + Business-Tap Refactor
- 5 ثيمات Auto-Tap أولية
- Business-Tap form عبر BaseForm
- Pricing calculator
- PendingProfile لأمان الدفع
- SuccessModal موحد + واتساب

### الجلسة 3 — Production Deployment
- Dynamic link (no hardcoded domain)
- Fix Firebase private key parsing
- Standalone profile layout (route group `(main)`)
- 5 مكونات بروفايل جديدة للثيمات
- Grid layout للأيقونات + touch effects
- API activate-profile + GAS auto-activation
- Terminal Dark Glow (ثيم سادس)

### الجلسة 4 — Fix Auto-Activation
- fix `e.value === "TRUE"` → `e.value === true`
- PropertiesService بدل hardcoded secret
- CORS + validation في API route
- `.env.example` + Vercel env vars

### الجلسة 5 — Instant Activation (إلغاء Auto-Activation)
- `active: true` فورياً عند الطلب
- حذف PendingProfile + API route
- حذف ADMIN_SECRET_KEY
- إضافة `عرض اللوجو (سم)` للـ GAS payload

### الجلسة 6 — Native App-Like + Branding
- Viewport lock + ScrollToTop
- Business-Tap Showcase (بدون forms)
- LoadingProvider + Toast system
- Favicon + Apple-icon + PWA manifest
- Onboarding Tour (3 tooltips)

### الجلسة 7 — Fix Scroll + Duplication + Pricing
- fix scroll lock (إزالة `overflow-y`)
- fix تكرار محتوى Business-Tap
- grid للـ platforms في Multi-User
- 3-column pricing في Digital Cards
- fix أخطاء Console (sizes, translations)

### الجلسة 8 — Display Name + UX/UI
- إضافة displayName مع fallback
- إزالة stickerName (توحيد)
- تحسين تباين الألوان في Auto-Tap form
- Conditional social link layout (wide button للرابط الواحد)

### الجلسة 9 — Design Selection Step + GAS Dashboard
- 4 خطوات Auto-Tap (shipping → social → design → sizing)
- fix raw translation keys
- GAS V15 + Dashboard مع Notes + Copy Link + Logo Size

### الجلسة 10 — Energy Lightning + OG + GAS Fixes
- Energy Lightning (ثيم سابع Navy/Red/Cyan)
- Open Graph metadata
- Favicon احترافي "G"
- fix Dashboard Notes column (fuzzy match)

### الجلسة 11 — UI Rearrangement + Priority
- نقل Notes من Step 0 → Step 3
- Energy Lightning أول ثيم (default)
- إزالة ContactFab → inline CTA
- suppressHydrationWarning

### الجلسة 12 — Mobile UI/UX Fixes
- CTA high-contrast (bg فاتح)
- تصغير WhatsApp FAB
- modal alignment + scroll fixes
- Shipping info + theme header helper text

### الجلسة 13 — Upload Spinner + Nav Fix
- Spinner overlay للـ image upload
- Mobile Nav z-index + layout overhaul

### الجلسة 14 — Interactive Preview Carousel
- WebP conversion (Client-side canvas)
- أسهم + نقاط للتنقل بين الثيمات (بدل أزرار مكدوسة)
- Auto-scroll بين خطوات الفورم
- إزالة Preview الخارجي من page → جوه Step 2

---

## 🔄 هذه الجلسة (15) — 16 يونيو 2026 — Fixes + UI

**Commit:** `f7e402e`

### 1. 🛑 Fix تعليق "جاري إرسال الطلب..."
- `submitOrder.ts`: AbortController + 15s timeout على GAS fetch
- `submitOrder.ts`: Firestore addDoc يرمي الخطأ (re-throw) مش يبتلعه
- `AutoTapForm.tsx`: 20s safety timeout يخفي الـ loading ويظهر Toast

### 2. 🔧 Fix تداخل النصوص في Preview Card
- كل الـ text classes: `truncate min-w-0` لمنع overflow
- كل الـ grid link containers: `min-w-0` عشان grid items يتقلصوا

### 3. 🔒 تعطيل الأزرار أثناء رفع الصورة
- `disabled={uploading}` على "التالي" و"الرجوع" و"إرسال"
- رسالة "برجاء الانتظار، جاري رفع الصورة..." أوضح

### 4. 🌐 زرار لغة دائري في الـ Navbar
- `<button class="w-10 h-10 rounded-full ...">` جواه `<Globe />` + `EN`/`AR`
- إعادة ترتيب الـ Navbar: Auto-Tap قبل Digital Cards

### 5. 📦 إعادة ترتيب المنتجات
- Auto-Tap أول بطاقة في `ProductsGrid` + أول لينك في الـ Navbar

### ✅ Build
| الفحص | النتيجة |
|-------|---------|
| `npx tsc --noEmit` | ✅ 0 errors |
| `npm run build` | ✅ Compiled successfully |

### الملفات
`submitOrder.ts` `AutoTapForm.tsx` `AutoTapPreview.tsx` `Navbar.tsx` `ProductsGrid.tsx`

---

## 🔄 الجلسة 16 — 16 يونيو 2026 — UX/UI Refactor + Mobile Optimizations

**Commit:** `840745d`

### 1. 🔝 Auto-Scroll to Top on Step Change
- `AutoTapForm.tsx`: استبدال `scrollIntoView` بـ `window.scrollTo({ top: 0, behavior: 'smooth' })`
- إزالة `formRef` غير المستخدم

### 2. 📱 Mobile Keyboard & Auto-Capitalization Fixes
- **الهاتف:** إضافة `inputMode="numeric"` و `pattern="[0-9]*"`
- **السوشيال ميديا:** إضافة `autoCapitalize="none"` `autoCorrect="off"` `spellCheck="false"` وتحويل lowercase
- **SocialLinksBlock.tsx:** نفس التحسينات للمكون العام مع نصوص مساعدة جديدة
- **ترجمة:** إضافة `socialHelperText` (اسم مستخدم أو رابط) و `whatsappHelper` (رقم فقط)

### 3. 🎯 Account Selection Tabs — Clickable
- تغيير border المختار إلى `border-2 border-cyan-500` مع glow
- إضافة hover effects (shadow cyan, `hover:bg-dark-card/80`)
- نص مختار يتحول إلى `text-cyan-400`

### 4. 📐 زيادة حجم كارد المعاينة
- `p-5` → `p-6` في الحاوية
- `الاسم: text-lg` → `text-xl` في كل الثيمات
- `avatar: w-20` → `w-24`
- `scale: 1` → `1.03` للـ motion.div

### 5. ⚡ تحسين سرعة الإرسال
- `handleSubmit`: guard ضد الضغط أثناء رفع الصورة
- `submitOrder.ts`: GAS fetch أصبح fire-and-forget (لا await) لتسريع الـ response
- رسالة الـ loading: "جاري تأكيد الطلب وحفظ البيانات..."

### ✅ Build
| الفحص | النتيجة |
|-------|---------|
| `npx tsc --noEmit` | ✅ 0 errors |
| `npm run build` | ✅ Compiled successfully |

### الملفات
`LAST_SAVE.md` `AutoTapForm.tsx` `AutoTapPreview.tsx` `SocialLinksBlock.tsx` `submitOrder.ts` `ar.json` `en.json`

---

## 🔄 الجلسة 17 — 16 يونيو 2026 — Hotfix: إصلاح GAS Submission

**Commits:** `d6b290e` `e6d9571`

### 1. 🛑 CRITICAL: Orders were lost (fire-and-forget يقطع الطلب)
**السبب:** fire-and-forget على GAS fetch كان بيخلّي الدالة ترجع قبل ما الـ request يكمل — فـ البيانات مبتوصلش للشيت
**الإصلاح:** رجّعنا `await` على fetch GAS في `submitOrder.ts`

### 2. 🛑 CRITICAL: AbortController 15s كان بيقطع الطلب
**السبب:** AbortController مع timeout 15 ثانية كان بيقطع الـ request لو GAS أخذ وقت على cold start — والـ catch كان بيلتهم الخطأ ومايترماش، فـ المستخدم يشوف نجاح وهمي
**الإصلاح:**
- إزالة AbortController خالص من `submitOrder.ts` — الـ fetch يستنى قد ما يحتاج
- إضافة `throw error` في catch بتاع GAS عشان الـ UI يعرف بالفشل
- زيادة safetyTimer من 20s → 30s في `handleSubmit`

### 3. 🔝 Fix Scroll Position
**السبب:** `window.scrollTo({ top: 0 })` كان بيديني scroll لأعلى الصفحة ويخفي الـ step indicator
**الإصلاح:** استخدام `scrollIntoView` على `stepperRef` المستهدف للـ stepper container

### 4. 🐛 Success Modal كَان بيظهر حتى لو فشل الإرسال
**السبب:** `setShowSuccess(true)` كانت بتنفذ برة try/catch
**الإصلاح:** نقلها جوة try — تظهر بس لما النجاح يتأكد

### ✅ Build
| الفحص | النتيجة |
|-------|---------|
| `npx tsc --noEmit` | ✅ 0 errors |
| `npm run build` | ✅ Compiled successfully |

### الملفات
`submitOrder.ts` `AutoTapForm.tsx`

---

## 🔄 الجلسة 18 — 17 يونيو 2026 — Links Fix + Mobile Upload Overhaul

**Commits:** `8369d78` `04ff26d` `203d362` `610d140` `b41758a` `5acbfa1` `63a941e`

### 1. 🛑 CRITICAL: 404 على روابط Email/Website/LinkedIn في صفحة البروفايل
**السبب:** `digitalCardsFields` (email, website, linkedin, googleMaps, pdfProfile) و `businessTapFields` (menuLink, googleReviews, onlineOrdering) كانت بتتخزن في Firebase من غير تنسيق — من غير `mailto:` أو `https://` → المتصفح بيعاملها كـ relative URL → 404.
**الإصلاح:**
- `formatSocialLink.ts`: إضافة المفاتيح الناقصة `googleMaps`, `pdfProfile`, `menuLink`, `googleReviews`, `onlineOrdering` مع الـ prefixes المناسبة
- `BaseForm.tsx`: تنسيق كل `digitalCardsFields` و `businessTapFields` بـ `formatSocialLink()` قبل الحفظ
- `ProfileWrapper.tsx`: إضافة `ensureUrl()` في `buildButtons()` كـ safety net للداتا القديمة — بتضيف `https://` أو `mailto:` لو الرابط malformed

### 2. 📱 Mobile Image Upload Fixes
**المشكلة:** 413 Payload Too Large + HEIC/HEIF غير مدعوم + timeout

**الإصلاحات:**

| المشكلة | الحل | الملف |
|---------|------|-------|
| **413 Payload Too Large** (صور 6-15MB من الموبايل) | Client-side image compression: Canvas → max 1024px → WebP quality 0.7 → <1MB File | `compressImage.ts` (جديد) + `LogoUpload.tsx` + `AutoTapForm.tsx` |
| **Canvas toBlob يعمل Blob مش File** كان بيكراش "string did not match pattern" | `new File([blob], name, { type })` بدل return Blob | `compressImage.ts` |
| **iOS HEIC/HEIF مرفوض من السيرفر** | إضافة `image/heic`, `image/heif` لـ allowedTypes | `api/upload/route.ts` |
| **iOS بيبعت MIME type فاضي** | كشف نوع الملف من الامتداد (`.heic`, `.jpg`, إلخ) | `api/upload/route.ts` |
| **Timeout على الموبايل** | AbortController 60s + `maxDuration = 60` لـ Vercel | `LogoUpload.tsx`, `api/upload/route.ts` |
| **رسالة خطأ عامة** | عرض رسالة الخطأ الحقيقية من السيرفر | `LogoUpload.tsx`, `AutoTapForm.tsx` |
| **PDF upload silent fail** | إضافة timeout + error handling + toasts | `FormA_DigitalCards.tsx` |
| **accept ضيق على الموبايل** | `accept="image/*"` بدل `image/png,image/jpeg,...` | `LogoUpload.tsx`, `AutoTapForm.tsx` |
| **capture بيجبر الكاميرا** | إزالة `capture="environment"` عشان يفتح الألبوم | `LogoUpload.tsx`, `AutoTapForm.tsx` |

### 3. 🔄 تدفق رفع الصورة الجديد
```
صورة 12MB من iPhone (HEIC)
       ↓
   compressImage.ts
       ↓ Image() → Canvas drawImage
       ↓ resize: max 1024px (aspect ratio)
       ↓ toBlob('image/webp', quality 0.7)
       ↓ لو > 1MB → نخفض quality لـ 0.42
       ↓ new File([blob], 'logo.webp', { type: 'image/webp' })
       ↓ حجم < 1MB
       ↓
   FormData.append("file", compressedFile)
       ↓
   fetch("/api/upload")  ← 60s AbortController
       ↓
   server: detectedType من الامتداد لو MIME فاضي
       ↓
   Cloudinary (format: webp, quality: auto:good)
       ↓
   secure_url → form state
```

### 4. 🌐 زرار لغة في الموبايل
- إضافة زرار دائري 🌐 AR/EN جنب hamburger menu في الـ header (نفس تصميم desktop)

### 5. ✅ Build
| الفحص | النتيجة |
|-------|---------|
| `npx tsc --noEmit` | ✅ 0 errors |
| `npm run lint` | ✅ 0 errors (1 warning قديم) |

### الملفات المتأثرة
`compressImage.ts` (جديد) `formatSocialLink.ts` `BaseForm.tsx` `ProfileWrapper.tsx`
`LogoUpload.tsx` `AutoTapForm.tsx` `FormA_DigitalCards.tsx` `Navbar.tsx`
`api/upload/route.ts` `submitOrder.ts` `ar.json` `en.json`

### Commits
```
63a941e fix: return File object from compressImage (was Blob without name)
5acbfa1 fix: add client-side image compression (max 1024px, WebP, <1MB)
b41758a fix: change accept to image/* for broader mobile support
610d140 fix: detect file type by extension when MIME empty (iOS HEIC) + maxDuration 60s
203d362 fix: show real server error in upload toast
04ff26d fix: accept HEIC/HEIF from iPhone camera + increase upload timeout to 60s
8369d78 fix: format social/extra links before save + safety net at render + mobile lang button
```

---

## ملاحظات مهمة
1. **GAS Endpoint:** `NEXT_PUBLIC_GAS_URL` في `.env.local`
2. **WhatsApp الأساسي:** `201558599678` — كل الأوردرات تروح له
3. **Vercel Env Vars:** `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `NEXT_PUBLIC_*`
4. **Node.js:** استخدم 20.x–22.x (ليس v24)
5. **GitHub:** `https://github.com/yousefashraf-dev/joy-cards` — branch: `production-release`
6. **عدد الثيمات:** 16 (7 Auto-Tap + 3 Digital-Cards + 3 Business-Tap + 3 Legacy)
