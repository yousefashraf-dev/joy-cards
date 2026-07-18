# جلسة 24 يوليو 2026 — Luxury Tree Theme Redesign + Menu Groups Restructure

## التعديلات

### 1. إعادة تصميم ثيم Tree بالكامل (Luxury Warm Theme)
- **الملف:** `src/lib/cafe-themes.ts`
- ألوان فاخرة جديدة: خلفية Deep Espresso `#1A0F0A→#1E110B→#140B07`، أكسنت ذهبي دافئ `#E5C158`، أسعار `#4CAF50` (Forest Green)
- إضافة `priceAccent?: string` إلى واجهة `CafeThemeConfig`

### 2. إعادة تصميم صفحة المنيو (menu/[slug]/page.tsx)
- **الكروت:** كل صنف بقى card بشكل glassmorphism (bg بني غامق `#2A1812`، border ذهبي `#E5C158/10`، backdrop-blur) مع hover effect (`scale-[1.01]`, border يتحول `#E5C158/30`)
- **العناوين:** ذهبي `#E5C158` بدل أبيض
- **الأسعار:** أخضر `#4CAF50` (لثيم Tree)
- **Badges:** شارات ذكية (الأكثر مبيعاً، سبايسي، شيف، جديد) تظهر تلقائياً حسب اسم/وصف الصنف
- **التبويبات:** ParentTabs و SubCategoryTabs ذهبية مع خلفية بني شفاف
- **Header:** الاسم ذهبي، border ذهبي متدرج بدل أبيض

### 3. استبدال LeafDecorations بـ LuxuryDecorations
- **الملف:** `src/app/[locale]/menu/[slug]/page.tsx`
- رسومات جديدة بالذهب `#E5C158` بشفافية 2-3%: كوب قهوة، كوب عصير، طبق وأدوات طعام، فروع شجر ناعمة
- تأثير watermark فاخر بدون تشويش على النصوص

### 4. تحديث TreeCarousel (3D Coverflow)
- **الملف:** `src/components/menu/TreeCarousel.tsx`
- ألوان ذهبية `#E5C158` وأخضر `#4CAF50` بدل mint
- الكروت بقت glassmorphism (خلفية بني، border ذهبي ناعم، glow ذهبي للكارت النشط)
- Navigation arrows وأزرار المؤشر ذهبية

### 5. إضافة أيقونات SVG جديدة
- **الملف:** `src/components/menu/LineArtIcons.tsx`
- `TreeClassicsIcon` (فنجان قهوة للقهوة الكلاسيك)
- `SpecialCoffeeIcon` (وعاء بن للقهوة الخاصة)

### 6. إعادة هيكلة المجموعات (menu-groups.ts)
- **الترتيب:** الأكل أولاً → المشروبات → الحلويات
- إضافة **TREE CLASSICS** (قهوة تركية، اسبريسو، ماكياتو)
- إضافة **TREE SPECIAL COFFEE** (بن 1 كجم)
- دمج **TREE CLASSICS + TREE SPECIAL COFFEE** ضمن HOT DRINKS
- دمج **EXTRAS** ضمن COLD DRINKS
- إزالة التكرارات (ASIAN APPETIZER/SOUP من COLD DRINKS)
- إضافة أيقونات `🫖` و `🫘` للمجموعات الجديدة
- تحديث CAROUSEL_ORDER (15 مجموعة بدل 16)

### 7. تفعيل ديكورات Tree في صفحة الكافيه
- **الملف:** `src/app/[locale]/cafe/[slug]/page.tsx`
- إضافة `TreeBranchSvg` (رسوم فروع شجر ذهبية) لـ `THEME_DECORATIONS`

### 8. إضافة كلاسات CSS
- **الملف:** `src/app/globals.css`
- `.glass-warm` — خلفية زجاجية ذهبية
- `.glow-gold-soft` — توهج ذهبي ناعم

---

## الفحوصات

| الفحص | النتيجة |
|-------|---------|
| `npx tsc --noEmit` | ✅ 0 errors |
| `en.json` braces | ✅ 73/73 |
| `ar.json` braces | ✅ 73/73 |
| جميع الصفحات (Home, Menu, Cafe, Shop, ...) | ✅ 200 OK |
| API routes | ✅ 200 OK |

```bash
git log --oneline -1
```
