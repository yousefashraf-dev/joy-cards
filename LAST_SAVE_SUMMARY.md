# جلسة 27 يوليو 2026 — Black & Gold Luxury UI Overhaul + Wedding Removal

## ملخص الجلسة

العميل طلب تحويل واجهة الموقع بالكامل إلى ثيم **أسود وذهبي فاخر (Black & Luxury Gold)** مع بطاقات زجاجية (glassmorphism) وأزرار ذهبية. وإزالة ميزة كروت الفرح (Wedding Cards) بالكامل.

## التعديلات

### 1. تصحيح لون الذهب (أعمق وأفخم)
- **الملفات:** `globals.css`, `cafe-themes.ts`
- من `#D4AF37` (مصفر) → `#C9A84C` (دهبي عميق دافئ)
- Light: `#F0D060` → `#E8CC6A` | Dark: `#B8960F` → `#A88828`
- تم تحديث كل كلاسات الـ CSS والـ utilities والأكسنت

### 2. نظام Glassmorphism Card جديد
- **الملف:** `globals.css`
- كلاسات جديدة: `glass-card`, `glass-gold`, `btn-gold`, `btn-gold-outline`, `text-gradient-gold-strong`, `glow-gold-card`
- كل البطاقات في الموقع بقت بخلفية زجاجية سودا دافئة مع border ذهبي ناعم

### 3. توحيد 13 مكون/صفحة إلى الأسود والذهب

| المكون/الصفحة | التغيير |
|----------------|---------|
| `PrimaryButton.tsx` | من سيلفر → ذهبي |
| `Navbar.tsx` | شعار + روابط + زر اللغة → دهبي |
| `SectionHeading.tsx` | خط فاصل → ذهبي |
| `ProductCard.tsx` | بطاقة زجاجية + زر ذهبي |
| `ProductsGrid.tsx` | كل الـ 4 منتجات بقت ذهبية |
| `HeroMotion.tsx` | خلفيات ذهبية أقوى |
| `HowItWorksSection.tsx` | أيقونات وبطاقات → ذهبي |
| `FaqAccordion.tsx` | بطاقات زجاجية + ذهبي |
| `Footer.tsx` | أيقونات السوشيال → ذهبي عند hover |
| `business-tap/page.tsx` | كل النيون أخضر → ذهبي |
| `auto-tap/page.tsx` | خلفية نيفي → ذهبي |
| `digital-cards/page.tsx` | كل nardo/رمادي → ذهبي |
| `shop/page.tsx` | خلفية المودال → أسود غير لامع |

### 4. تطوير عرض الصور في المتجر
- **الملف:** `shop/page.tsx`
- صور البطاقة: `object-cover` → `object-contain` (الصورة كاملة ظاهرة)
- معرض الصور في المودال: انتقال أنيميتد (Framer Motion)، سحب باللمس (مقاومة 50px)، أزرار زجاجية، نقاط ذهبية (النقطة النشطة أعرض + glow)، مساحة عرض أكبر

### 5. إزالة كروت الفرح (Wedding Cards) بالكامل
- **13 ملف اتمسح:** `wedding-schema.ts`, `wedding-themes.ts`, `WeddingPreview.tsx`, `CountdownTimer.tsx`, `WeddingOrderForm.tsx`, `WeddingForm.tsx`, `WeddingTable.tsx`, `WeddingOrdersTable.tsx`, 2 API routes, 3 pages
- **12 ملف اتعملهم edit:** `types.ts`, `constants.ts`, `submitOrder.ts`, `orders/route.ts`, `Navbar.tsx`, `ProductsGrid.tsx`, `SuccessModal.tsx`, `admin/dashboard/page.tsx`, `en.json`, `ar.json`
- عدد أقواس locale: 73 → 63

## الفحوصات
| الفحص | النتيجة |
|-------|---------|
| `npx tsc --noEmit` | ✅ 0 errors |
| `next build` | ✅ No errors |
| `en.json` | ✅ 63/63 |
| `ar.json` | ✅ 63/63 |
| Dev server | ✅ All pages 200, wedding pages 404 |
