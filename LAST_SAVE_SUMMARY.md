# جلسة 21 يوليو 2026 — إعادة تصميم المنيو بالكامل + استيراد CSV + تحسينات UI/UX

## ملخص الجلسة

إعادة تصميم شاملة لصفحة المنيو الرقمي (Text-Only Premium Menu)، إضافة نظام استيراد CSV، تحسين الخطوط والتايبوغرافي، وإضافة نظام المجموعات الرئيسية (Parent Grouping).

---

## التعديلات

### 1. هيكل قاعدة البيانات — إضافة `size` لـ MenuItem

| الملف | التعديل |
|-------|---------|
| `src/lib/cafe-schema.ts` | إضافة `size?: string` إلى `MenuItem` interface |
| `src/lib/menu-schema.ts` | دعم `size` في `getAllMenus` و `getMenuBySlug` |
| `src/app/api/menus/route.ts` | دعم `size` في GET responses |

### 2. إضافة `size` Input في MenuBuilder

| الملف | التعديل |
|-------|---------|
| `src/components/admin/MenuBuilder.tsx` | إضافة input حجم/قطع (بين الاسم والسعر) + تحديث `updateItem` لدعم `"size"` field |

### 3. نظام المجموعات الرئيسية (Parent Category Grouping)

| الملف | التعديل |
|-------|---------|
| `src/lib/menu-groups.ts` | 🆕 **جديد** — تعريف 7 مجموعات رئيسية مع أقسامها الفرعية |

**المجموعات:**
- **سوشي (SUSHI)**: NIGIRI, SASHIMI, SPECIAL URA, HOSOMAKI, HOT ROLL, ORAMAKI, TEMAKI, DYNAMITE ROLL, COMBO SITION
- **أطباق آسيوية (ASIAN KITCHEN)**: ASIAN APPETIZER, ASIAN SOUP
- **مشروبات باردة (COLD DRINKS)**: MILK SHAKE, FRAPPE, FRAPPUCCINO, TREE JUICES, TREE SMOOTHIES, TREE COCKTAILS, ICE COFFEE, ICE MATCHA, BOBA, SOFT DRINKS
- **مشروبات ساخنة (HOT DRINKS)**: TREE CLASSICS, HOT DRINKS
- **مطبخ غربي (WESTERN FOOD)**: SALAD, SOUP, TREE APPETIZER, PASTA, PIZZA, BEEF MEAL, CHICKEN MEAL, FAJITA, FRIED CHICKEN, QUESADILLA, BURGER
- **حلويات (DESSERTS)**: TREE DESSERT, PANCAKE
- **إضافات وبن (EXTRAS & BEANS)**: EXTRAS, TREE SPECIAL COFFEE

### 4. CSV Import System

| الملف | التعديل |
|-------|---------|
| `src/app/api/menus/import/route.ts` | 🆕 **جديد** — API endpoint لاستيراد CSV (POST → Firestore) |
| `src/components/admin/CsvImport.tsx` | 🆕 **جديد** — مكون رفع CSV مع معاينة جدولية قبل الحفظ |
| `src/app/[locale]/admin/dashboard/page.tsx` | إضافة تبويب **"استيراد CSV"** في لوحة التحكم |

**ميزات CsvImport:**
- رفع ملف CSV من الجهاز
- معاينة البيانات في جدول قبل الحفظ
- إدخال اسم المنيو + Slug
- حفظ تلقائي في Firestore عبر API
- رسائل نجاح/خطأ

### 5. إعادة تصميم صفحة المنيو — Text-Only Premium Menu

| الملف | التعديل |
|-------|---------|
| `src/app/[locale]/menu/[slug]/page.tsx` | **إعادة كتابة كاملة** |

**الميزات الجديدة:**
- **Header**: اسم المكان بـ Playfair Display أبيض عريض + "MENU" بأخضر زيتوني (#7A8B3E)
- **Parent Tabs**: تابات المجموعات الرئيسية (سوشي، أطباق آسيوية، مشروبات باردة، ...) + "الكل"
- **Sub Tabs**: تابات فرعية للأقسام داخل المجموعة المختارة
- **Items**: اسم + سعر على سطر واحد، وصف تحتها، دعم حجم/قطع
- **عناوين فواصل (Section Headers)**: في تبويب "الكل" تظهر عناوين `(المجموعة • القسم)` لكل مجموعة منتجات
- **Scroll to Top**: زر عائم للرجوع للأعلى

**التصميم:**
- خلفية #1A1A1A
- لون أكسنت زيتوني #7A8B3E
- تابات بحواف مستديرة مع تأثير نشط متوهج

### 6. تحسين الخطوط والتايبوغرافي

| الملف | التعديل |
|-------|---------|
| `src/app/[locale]/layout.tsx` | إضافة **Cairo** (للعربية) + **Outfit** (للإنجليزية) fonts |
| `src/app/globals.css` | إضافة `--font-cairo` + `--font-outfit` CSS variables |
| `src/app/[locale]/menu/[slug]/page.tsx` | استخدام Outfit/Cairo بدل Playfair Display للأسماء والأسعار |

**تفاصيل الخطوط:**
- **أسماء الوجبات والأسعار**: `Outfit` / `Inter` (Sans-serif مودرن)
- **النصوص العربية**: `Cairo` (واضح، مستقيم،无 مائل)
- **العناوين الرئيسية**: `Playfair Display` (لاسم المكان فقط)
- **الأوصاف**: `Cairo` بحجم `text-sm md:text-base`, `line-height: relaxed`
- تم إزالة الـ Italic تماماً من النصوص العربية

---

## الملفات المعدلة (12 ملف)

| الملف | الحالة |
|-------|--------|
| `src/lib/cafe-schema.ts` | ✅ تعديل |
| `src/lib/menu-schema.ts` | ✅ تعديل |
| `src/lib/menu-groups.ts` | 🆕 جديد |
| `src/components/admin/MenuBuilder.tsx` | ✅ تعديل |
| `src/components/admin/CsvImport.tsx` | 🆕 جديد |
| `src/app/api/menus/route.ts` | ✅ تعديل |
| `src/app/api/menus/import/route.ts` | 🆕 جديد |
| `src/app/[locale]/admin/dashboard/page.tsx` | ✅ تعديل |
| `src/app/[locale]/menu/[slug]/page.tsx` | ✅ إعادة كتابة |
| `src/app/[locale]/layout.tsx` | ✅ تعديل |
| `src/app/globals.css` | ✅ تعديل |

---

## Run Locally

```bash
npm run dev
# Admin: http://localhost:3000/ar/admin/dashboard
# Password: oreo2552000
```

## تصميم المنيو الجديد

```
[ اسم المكان ]
      MENU

[ الكل | سوشي | أطباق آسيوية | مشروبات باردة | ... ]

(في وضع "الكل"):
  مطبخ غربي • SALAD
  ────────────────────
  Chicken Caesar    188
  الخس مع صوص السيزر...
  
  مطبخ غربي • SOUP
  ────────────────────
  Chicken Mushroom  149
  قطع الدجاج المشوية...
  
  سوشي • NIGIRI
  ────────────────────
  نجيري ايل  1 Piece  32
  رز - ايل

(عند اختيار مجموعة مثل "سوشي"):
  [ الكل | NIGIRI | SASHIMI | SPECIAL URA | ... ]
  
  NIGIRI
  ──────
  نجيري ايل  1 Piece  32
  نجيري كراب  1 Piece  32
```

## الثيمات
- ثابت: Dark Charcoal #1A1A1A مع أكسنت زيتوني #7A8B3E

## Verified Status

| Check | Status |
|-------|--------|
| `npx tsc --noEmit` | ✅ 0 errors |
| Dev server (`localhost:3000`) | ✅ All pages return 200 |
| API `/api/menus` | ✅ 200 |
| API `/api/menus/import` | ✅ 201 |
| Admin Dashboard | ✅ 200 |
