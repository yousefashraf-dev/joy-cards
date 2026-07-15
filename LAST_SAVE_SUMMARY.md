# جلسة 23 يوليو 2026 — Tree Theme: 3D Coverflow Carousel + إعادة هيكلة المجموعات + ديناميك الثيمات لكل المنيوهات

## التعديلات

### 1. ثيم Tree الجديد للمنيو الرقمي
- **الملف:** `src/lib/cafe-themes.ts`
- إضافة `"tree"` إلى `CafeTheme` + كونفيج (accent: `#3D8B7A` مينت جرين، bg داكن)

### 2. كاروسيل تفاعلي 3D Coverflow
- **ملف جديد:** `src/components/menu/TreeCarousel.tsx`
- تأثير 3D Coverflow: الكارت النشط scale 1.15 + توهج نيون، والجوانبية scale 0.55–0.8 + rotateY + opacity
- سحب باللمس (Pointer Events) + أزرار تنقل + نقاط indicators
- Spring animations من Framer Motion

### 3. أيقونات 2D Line Art
- **ملف جديد:** `src/components/menu/LineArtIcons.tsx`
- 18 أيقونة SVG برسومات بيضاء خط رفيع (سوشي، سلطة، شوربة، بيتزا، باستا، برجر، لحوم، دجاج، فاهيتا، مشروبات، حلويات، إضافات...)

### 4. إعادة تصميم صفحة المنيو
- **الملف:** `src/app/[locale]/menu/[slug]/page.tsx`
- ألوان ديناميكية حسب `menu.theme` (accent, bg)
- `LeafDecorations` — 17 رسالة ورق شجر (blur كبير + small crisp leaves) في الخلفية
- تبويبات `ParentTabs` مخفية أول ما الصفحة تفتح — بتظهر بعد اختيار قسم من الكاروسيل
- الكاروسيل يظهر فقط مع ثيم Tree، باقي الثيمات شغالة عادي

### 5. تفكيك "المطبخ الغربي" إلى مجموعات فردية
- **الملف:** `src/lib/menu-groups.ts`
- إزالة WESTERN FOOD — كل sub-category بقى مجموعة لوحدها: سلطة، شوربة، مقبلات، بيتزا، باستا، برجر، لحوم، دجاج، فاهيتا، دجاج مقلي، كويساديلا
- دمج "أطباق آسيوية" (ASIAN APPETIZER + ASIAN SOUP) داخل مجموعة SUSHI
- تحديث `CAROUSEL_ORDER` في TreeCarousel

### 6. ديناميك الثيمات لكل المنيوهات (fix session)
- **الملف:** `src/app/[locale]/menu/[slug]/page.tsx`
- `bgColor` بقى يقرأ من `themeConfig?.bgLoading` لكل الثيمات (مش بس Tree)
- `bgGradient` جديد بياخد `themeConfig?.bg` لدعم gradient backgrounds
- الحاوية الرئيسية بقت `background: bgGradient` بدل `backgroundColor`
- صفحة "مش موجود" بتستخدم bgColor الديناميكي

### 7. تحديثات إضافية
- **الملف:** `src/app/[locale]/cafe/[slug]/page.tsx` — إضافة `tree: []` إلى `THEME_DECORATIONS`
- **MenuForm:** ثيم Tree بيظهر تلقائياً في خيارات الثيم (لأنه بيقرأ `CAFE_THEMES`)

---

## الفحوصات

| الفحص | النتيجة |
|-------|---------|
| `npx tsc --noEmit` | ✅ 0 errors |
| `en.json` braces | ✅ 73/73 |
| `ar.json` braces | ✅ 73/73 |

```bash
git log --oneline -1
f854ee5 feat: Tree theme menu + dynamic theming for all themes + menu groups restructure
```
