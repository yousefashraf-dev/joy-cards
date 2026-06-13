# Last Save — مشروع GoTap

## ملخص المشروع
موقع ويب متميز ثنائي اللغة (إنجليزي/عربي) مبني بـ Next.js 16.2.9 App Router لعلامة GoTap التجارية لمنتجات NFC الذكية. يشمل:
- صفحة هبوط تجارة إلكترونية
- نماذج طلب منتج (3 منتجات)
- صفحات ملفات شخصية ديناميكية `/user/[id]`

## التقنيات المستخدمة
- **Next.js 16.2.9** (TypeScript, Tailwind v4, App Router, src/ directory)
- **Framer Motion** — أنيميشن
- **Lucide React** — أيقونات
- **next-intl** — ترجمة EN/AR مع دعم RTL
- **Firebase Admin SDK v14** — قراءة الملفات الشخصية (Server-Side)
- **Firebase Client SDK** — للاستخدام من المتصفح
- **Cloudinary** — رفع الصور (`next-cloudinary` + API route)
- **Google Apps Script** — استقبال الطلبات عبر POST (no-cors)
- **خـطـوط**: Inter (إنجليزي) + Noto Kufi Arabic (عربي)

---

## ✅ الإنجازات السابقة (ما قبل هذه الجلسة)

### الإعدادات والتوجيه
- `next.config.ts` — remote patterns لكلوديناري وأنسplash
- `i18n/request.ts`, `middleware.ts`, `routing.ts` — نظام الترجمة الكامل
- `messages/en.json`, `messages/ar.json` — ملفات الترجمة
- `.env.local` — جميع المفاتيح (Cloudinary: `dliaxor9r`, Firebase, GAS, واتساب)
- `gotap-95a12-firebase-adminsdk-fbsvc-fc78d18130.json` — حساب الخدمة

### التصميم العام
- الألوان: Nardo Grey `#7A7A7A` + Matte Black `#1A1A1A` + Matte Card `#222222` + Matte Dark `#0D0D0D` + Silver `#C0C0C0`
- Neon accents: `#2DD4BF` (Turquoise/Mint), `#FF3131` (Neon Red)
- Glassmorphism: `.glass` (blur 12px), `.glass-strong` (blur 20px)
- Utilities: `text-gradient-silver`, `bg-gradient-silver`, `glow-silver`, `glow-neon`, `glow-red`, `carbon-fiber`

### المكونات العامة
`Navbar`, `Footer`, `BaseForm`, `PrimaryButton`, `ThemeSelector`, `SocialLinksBlock`, `LogoUpload`, `SuccessModal`, `SectionHeading`, `ProductCard`, `HeroSection`, `HowItWorksSection`

### 14 ثيم (9 عام + 5 Auto-Tap)
- **Business-Tap**: Modern Bistro, Luxury Lounge, Cyber Cafe
- **Digital-Cards**: Classic Executive, Minimal Glass, Midnight Slate
- **Auto-Tap سابقاً**: Nardo Stealth, Carbon Track, Neon Drift

---

## 🔄 إنجازات هذه الجلسة (التحديثات الكاملة)

### 1. 🎨 Electric Cyan Premium Overhaul (استبدال الأصفر بالسيان)

**الملفات المعدلة:**
- `src/app/globals.css` — إزالة `--color-phosphoric: #CCFF00` ← إضافة `--color-cyan: #00f3ff`، `.glow-cyan`، `.float-card`
- `src/lib/types.ts` — تغيير 3 IDs: `phosphoric-cyber` ← `cyber-cyan-drift`، `classic-silver` ← `classic-royal-silver`، `carbon-yellow` ← `liquid-aurora`
- `src/lib/constants.ts` — تحديث ALL_THEMES, PRODUCT_THEMES, THEME_ARCHETYPE
- `src/components/forms/AutoTapPreview.tsx` — **إعادة كتابة كاملة** لـ 5 ثيمات فاخرة:
  - **Cyber Cyan Drift**: زجاج عائم + توهج سيان كهربائي + Impact
  - **Neon Red Track**: مات بلاك + حدود حمراء متوهجة + تيبوجرافي سباق
  - **Nardo Stealth Luxury**: زجاج مصنفر + ناردو غراي + serif أنيقة
  - **Classic Royal Silver**: حدود فضية ملكية + Georgia كلاسيكية
  - **Liquid Aurora**: تدرج بنفسجي-سيان + زجاج سلس
- `src/components/forms/ThemeSelector.tsx` — تحديث border/glow logic
- `src/messages/ar.json` + `en.json` — 3 مفاتيح ثيم جديدة + أوصاف

**النتيجة**: كل الصور الرمزية `rounded-full` (دائرية)، ومتمركزة. كل الثيمات أصبحت فاخرة عالية التباين مع floating glow effect.

---

### 2. 🔗 Google Apps Script Integration

**الملفات المعدلة:**
- `src/lib/constants.ts` — تحديث `GAS_URL` إلى الرابط الكامل
- `src/lib/submitOrder.ts` — إضافة `status: "تحت التنفيذ"` و `total_price` إلى GAS payload

**النتيجة**: جميع النماذج (Auto-Tap, Digital Cards, Business-Tap) ترسل POST إلى GAS مع الحالة والبيانات الكاملة.

---

### 3. 📱 Cross-Route Success Modal + WhatsApp

**الملفات المعدلة:**
- `src/components/forms/SuccessModal.tsx`:
  - يقبل `orderDetails` (الاسم، الجوال، المنتج) + `totalPrice` + `shippingFee`
  - يعرض تفصيل الأسعار في modal (الخدمة، الشحن، الإجمالي) بلون سيان
  - يبني رسالة واتساب كاملة: "إجمالي الحساب: X جنيه (شامل الشحن Y جنيه)"
- `src/components/forms/AutoTapForm.tsx` — يمرر الـ pricing إلى SuccessModal
- `src/components/forms/BaseForm.tsx` — يمرر orderDetails إلى SuccessModal

**النتيجة**: تجربة موحدة عبر المنتجات الثلاثة — بعد الإرسال → modal مع تعليمات الدفع → زر يفتح واتساب مع تفاصيل الأوردر.

---

### 4. 🏢 Business-Tap Refactor

**الملفات المعدلة:**
- `src/app/[locale]/business-tap/page.tsx` — **إعادة هيكلة كاملة**:
  - من form مستقل ← `BaseForm` مع `FormC_BusinessTap` (مثل Digital-Cards)
  - أضيفت حقول: المحافظة، المدينة، الشارع، اللوجو، روابط التواصل، المنتقي
  - يستخدم `submitOrder()` + `SuccessModal` مثل باقي المنتجات
  - القسم التسويقي (Menu, Wi-Fi, InstaPay) محفوظ كجزء من `productSection`

---

### 5. 🔒 Anti-Exploit Security Gate

**الملفات الجديدة:**
- `src/components/profiles/PendingProfile.tsx` — شاشة راقية:
  - "الرابط غير نشط حالياً، سيتم التفعيل فور تأكيد الدفع من الإدارة."
  - أيقونة قفل مع pulse cyan، زر العودة للرئيسية

**الملفات المعدلة:**
- `src/lib/firebase.ts` — `getProfileById`: أزيل فلتر `active` ليعيد البروفايل حتى لو غير نشط
- `src/app/[locale]/user/[id]/page.tsx` — منطق الـ 3 حالات:
  - `active === false` ← PendingProfile
  - `profile === null` ← 404
  - `active === true` ← ProfileWrapper الطبيعي

**النتيجة**: لا يمكن الوصول لأي بروفايل إلا بعد تأكيد الدفع من الإدارة (تغيير `active` إلى `true`).

---

### 6. 💰 Auto-Tap Dynamic Pricing Calculator

**الملفات الجديدة:**
- `src/lib/pricing.ts` — 3 دوال:
  - `calcBasePrice("single" | "multiple")`: 150 / 200 ج.م (الخدمة + التصميم المخصص 50 ج.م)
  - `calcShippingFee(address)`: 50 ج.م (قاهرة/جيزة/إسكندرية/دلتا) أو 70 ج.م (صعيد/ساحلي)
  - `calcTotal(...)`: يعيد `{ basePrice, shippingFee, total }`

**الملفات المعدلة:**
- `src/lib/submitOrder.ts` — يقبل `totalPrice` اختيارياً، يرسل `total_price` في GAS body
- `src/components/forms/AutoTapForm.tsx` — يحسب السعر عند الإرسال، يخزن في `orderPricing` state
- `src/messages/ar.json` + `en.json` — مفاتيح `total` الجديدة (base, shipping, total)

---

## 📁 هيكل الملفات بعد التحديث

| الملف | الوظيفة |
|-------|---------|
| `src/lib/pricing.ts` | **(جديد)** حساب السعر الديناميكي + الشحن |
| `src/components/profiles/PendingProfile.tsx` | **(جديد)** شاشة قفل للبروفايلات غير النشطة |
| `src/app/globals.css` | Electric Cyan #00f3ff + glow-cyan + float-card |
| `src/lib/types.ts` | 14 Theme (cyber-cyan-drift, classic-royal-silver, liquid-aurora) |
| `src/lib/constants.ts` | ALL_THEMES محدثة + GAS_URL + PRICES |
| `src/lib/submitOrder.ts` | يقبل totalPrice + يرسل status + total_price لـ GAS |
| `src/lib/firebase.ts` | getProfileById بدون فلتر active |
| `src/components/forms/AutoTapForm.tsx` | Multi-step (3 خطوات) + pricing calculator |
| `src/components/forms/AutoTapPreview.tsx` | 5 ثيمات فاخرة مباشرة مع circular avatar |
| `src/components/forms/BaseForm.tsx` | نموذج موحد للـ Digital-Cards و Business-Tap |
| `src/components/forms/SuccessModal.tsx` | يعرض تفصيل الأسعار + WhatsApp message كاملة |
| `src/components/forms/ThemeSelector.tsx` | highlight logic (border-cyan + glow-cyan) |
| `src/app/[locale]/business-tap/page.tsx` | BaseForm كامل + submitOrder + SuccessModal |
| `src/app/[locale]/user/[id]/page.tsx` | PendingProfile / 404 / ProfileWrapper حسب active |

---

---

## 🔄 إنجازات الجلسة الثانية (التحديثات الكاملة)

### 7. 🏷️ تحديث شريط الأسعار ووصف Digital Cards

**الملفات المعدلة:**
- `src/app/[locale]/digital-cards/page.tsx` — شريط السعر صار: `"كارت التعريف الشخصي: 150 ج.م (شامل طباعة أي تصميم) + مصاريف الشحن"`، حُذف الـ `+ 50 ج.م` segment
- `src/messages/ar.json` — تحديث `digitalCardBase`، `digitalCardPrint` كـ checkbox label، تحديث وصف `desc` للنص المطلوب
- `src/messages/en.json` — تحديث النصوص المقابلة
- `src/components/forms/FormA_DigitalCards.tsx` — الـ toggle (`ديزاين طباعة مخصص`) استُبدل بـ checkbox: `"طلب تصميم مطبوع لزق إضافي (حسب التكلفة)"`
- `src/components/forms/BaseForm.tsx` — إضافة `customPrintDesign` إلى `digitalCardsFields` payload

---

### 8. 🖼️ Hero SVG (Digital Cards)

**الملفات المعدلة:**
- `src/app/[locale]/digital-cards/page.tsx` — استبدال صورة Unsplash بـ SVG مخصص متحرك (CSS animations):
  - هاتف ذكي مع شاشة متوهجة
  - كارت NFC يقترب مع موجات لاسلكية متحركة
  - أيقونات سوشيال عائمة (Globe, Instagram, LinkedIn, WhatsApp) مع glow
  - جزيئات بيانات متحركة من الكارت للهاتف

---

### 9. 💬 زر واتساب عائم (Global)

**الملفات الجديدة:**
- `src/components/layout/FloatingWhatsApp.tsx` — زر ثابت `fixed bottom-6 end-6 z-50`:
  - لون واتساب أخضر `#25D366` مع ping glow
  - ضغطة → popup زجاجي بخيارين:
    - **خيار 1**: لطلب كميات وأوردرات المطاعم والكافيهات → `wa.me/201095976766`
    - **خيار 2**: تواصل لتنفيذ أوردرك → `wa.me/201558599678`

**الملفات المعدلة:**
- `src/app/[locale]/layout.tsx` — إضافة `<FloatingWhatsApp />` داخل `<NextIntlClientProvider>`
- `src/lib/constants.ts` — إضافة `WHATSAPP_ORDERS_NUMBER` و `WHATSAPP_ORDERS_LINK`
- `src/messages/ar.json` + `en.json` — مفاتيح ترجمة الـ WhatsApp popup

---

### 10. 📊 ملخص الأسعار المباشر (Auto-Tap) → إزالة + استبدال بنص ثابت

**الملفات المعدلة:**
- `src/components/forms/AutoTapForm.tsx`:
  - **أضيف**: ملخص أسعار مباشر (cyan receipt box) مع `calcTotal()` (قاعدة + شحن = الإجمالي) يتحدّث لحظياً عند تغيير نوع الحساب أو العنوان
  - **ثم أزيل**: بناءً على طلب المستخدم (مربك للعميل)
  - **أضيف بدلاً منه**: نص إرشادي ثابت: 💡 (150 ج.م شامل التصميم والطباعة للمستخدم الواحد / 200 ج.م للمجموعة + مصاريف الشحن: 50 ج.م للقاهرة والمحافظات، و70 ج.م للصعيد والمدن الساحلية)

---

### 11. 🔄 تحسين تدفق الخطوات (Auto-Tap Form)

**الملفات المعدلة:**
- `src/components/forms/AutoTapForm.tsx`:
  - **حُذف** `onSubmitComplete()` من `handleSubmit` — البيانات لا تُمحى فور الإرسال
  - **أُضيف** `handleFormReset` — يعيد `step` إلى 0، يمسح `errors`, `orderPricing`, ويستدعي `onSubmitComplete()` لمسح بيانات الأب
  - **التوقيت**: يتم إعادة التعيين عند إغلاق الـ Success Modal أو الضغط على زر واتساب (عبر `onWhatsappClick`)

---

### 12. 🔗 V12 Google Apps Script Payload Fix

**الملفات المعدلة:**
- `src/lib/submitOrder.ts` — **إعادة كتابة**:
  - ترتيب التنفيذ: Firestore أولاً (للحصول على `profileId`) → ثم GAS
  - **مفاتيح عربية** تطابق V12:
    ```
    "اسم العميل", "رقم التليفون", "العنوان بالتفصيل", "رقم الواتساب",
    "نوع المنتج", "التصميم", "تفاصيل المنتج",
    "تم الدفع": false, "جاهز للشحن": false,
    "الإجمالي", "رابط الملف الشخصي"
    ```
  - `mode: "no-cors"` — بدون Content-Type header (GAS يقرأ الـ body من `e.postData.contents`)
  - دوال مساعدة: `buildAddress()` (تجميع المحافظة + المدينة + الشارع + addressDetail), `buildProductDetails()` (نوع الحساب، عرض اللوجو، الاسم على الاستيكر...)
  - **Debug logging**: `console.log("Payload being sent:", ...)` + رسالة نجاح/فشل
  - حُذف `status: "تحت التنفيذ"` تماماً (يُرسل `"تم الدفع": false` و `"جاهز للشحن": false` فقط)

**تعديلات إضافية:**
- `src/components/forms/AutoTapForm.tsx` — تمرير `locale` إلى `submitOrder()` للمعامل الثالث
- `src/components/forms/BaseForm.tsx` — تمرير `locale` إلى `submitOrder()`

---

### 13. 🚫 أمان: إخفاء رابط الملف الشخصي

**الملفات المعدلة:**
- `src/components/forms/SuccessModal.tsx`:
  - **حُذف**: `profileLine` (`\nرابط الملف الشخصي: ...`) من رسالة الواتساب بالكامل
  - **حُذف**: `profileUrl` بالكامل من المودال
  - **حُذف**: `profileId` و `locale` من الـ props (لم يعدا مستخدمين)
  - **حُذف**: `Copied` state و `handleCopy` و زر النسخ
  - الرابط يظل يُرسل فقط عبر الـ JSON payload المخفي إلى GAS في `submitOrder.ts`
- `src/components/forms/AutoTapForm.tsx` — إزالة `profileId` من state
- `src/components/forms/BaseForm.tsx` — إزالة `profileId` من state

---

### 14. 📞 توجيه الواتساب للرقم الأساسي

**التحقق:**
- `src/lib/constants.ts` — `WHATSAPP_LINK = https://wa.me/201558599678`
- `src/components/forms/SuccessModal.tsx` — يستخدم `WHATSAPP_LINK` لجميع الأوردرات
- الرقم الأساسي (01558599678) هو المستلم لجميع طلبات العملاء

---

### 15. 🧪 إصلاح CORS (no-cors)

**الملفات المعدلة:**
- `src/lib/submitOrder.ts`:
  - بعد اختبار: `mode: "cors"` + `Content-Type: text/plain` → خطأ CORS: `Failed to fetch` (لأن GAS لا يُرجع `Access-Control-Allow-Origin`)
  - **الحل**: الرجوع إلى `mode: "no-cors"` بدون `Content-Type` header — المتصفح يُرسل الطلب وجوجل سكريبت يستقبل البيانات ويعالجها، لكن الاستجابة تكون opaque (لا نستطيع قراءتها، والـ sheet يُحدّث بنجاح)

---

### ✅ التحقق النهائي

| الفحص | النتيجة |
|-------|---------|
| `npx tsc --noEmit` | ✅ **0 errors** |
| `npx eslint` | ✅ **0 errors, 0 warnings** |
| `npx next build` | ✅ **Compiled successfully** |

---

## 📁 الملفات المتأثرة في هذه الجلسة

| الملف | نوع التغيير |
|-------|-----------|
| `src/app/[locale]/digital-cards/page.tsx` | تعديل — SVG + شريط أسعار |
| `src/app/[locale]/layout.tsx` | تعديل — إضافة FloatingWhatsApp |
| `src/components/layout/FloatingWhatsApp.tsx` | **جديد** |
| `src/components/forms/FormA_DigitalCards.tsx` | تعديل — toggle → checkbox |
| `src/components/forms/AutoTapForm.tsx` | تعديل — إزالة live pricing، إضافة نص ثابت، إصلاح form reset، تمرير locale |
| `src/components/forms/BaseForm.tsx` | تعديل — تمرير locale + customPrintDesign |
| `src/components/forms/SuccessModal.tsx` | تعديل — إزالة profile link UI + إضافة onWhatsappClick |
| `src/lib/submitOrder.ts` | **إعادة كتابة** — Arabic payload V12, no-cors, debug logging |
| `src/lib/constants.ts` | تعديل — WHATSAPP_ORDERS_NUMBER |
| `src/messages/ar.json` | تعديل — نصوص WhatsApp + تحديثات الأسعار |
| `src/messages/en.json` | تعديل — نصوص WhatsApp + تحديثات الأسعار |

---

## ⚠️ ملاحظات مهمة

1. **GAS**: الـ endpoint هو `https://script.google.com/macros/s/AKfycbw-PmI1T_L_Gogf_ikeY2W-bZslG7Z2_8mcvxsioGI8lCv6R6FWgHLmhw8l21Vtnelfpg/exec` — وُجد في `constants.ts` ويُستخدم في `submitOrder.ts`
2. **no-cors**: المتصفح يُرسل الـ POST بدون CORS preflight. GAS يستقبل JSON body ويحلله. الـ response يكون opaque (لا نقرؤه). البيانات تصل إلى الـ sheet.
3. **تم الدفع / جاهز للشحن**: يجب أن تكون `false` (boolean) وليست string — GAS V12 يتعامل معها كـ checkboxes
4. **رابط الملف الشخصي**: لا يظهر للعميل أبداً — فقط في GAS payload + واتساب الإدارة داخلياً
5. **الرقم الأساسي للواتساب**: `201558599678` (01558599678) — جميع الأوردرات تُوجّه إليه

## ملاحظات التشغيل
- `npx next dev -p 3000` — يشغل السيرفر محلياً
- `setsid npx next dev -p 3000 </dev/null > /tmp/nextdev.out 2>&1 &` — تشغيل في الخلفية
- **Node.js**: استخدم Node.js 20.x–22.x (ليس v24.x)
