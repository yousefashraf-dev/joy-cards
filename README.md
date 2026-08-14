# GoTap — منصة حلول NFC الذكية

منصة ويب متكاملة لمنتجات GoTap الذكية: بطاقات أعمال رقمية، بروفايلات NFC (Auto Tap / Business Tap)، منيوات رقمية للمطاعم والكافيهات، ومتجر منتجات مع طلب عبر واتساب.

الموقع: [gotap.eg](https://gotap.eg) — نسخة العرض: [gotap.vercel.app](https://gotap.vercel.app)

---

## عن المشروع

المشروع مبني كتطبيق واحد (monorepo app) فيه أكثر من منتج:

| المنتج | الوصف | المسار |
|---|---|---|
| Digital Cards | بطاقة أعمال رقمية بلمسة NFC — لينكات التواصل والسوشيال | `/user/[id]` |
| Auto Tap | بروفايل NFC تلقائي (صفحة واحدة + لينك منصة) | `/auto-tap` |
| Business Tap | بروفايل كامل للشركات والمحلات (مواعيد، لينك منيو، تقييمات) | `/business-tap` |
| Smart Menu | منيو رقمي للمطاعم والكافيهات بأقسام وأسعار ومواعيد عمل | `/menu/[slug]` |
| Cafe Profile | صفحة كافيه كاملة (مواعيد العمل، واتساب، مواقع، وسائل دفع) | `/cafe/[slug]` |
| Shop | متجر منتجات مع طلب مباشر عبر واتساب | `/shop` |
| Admin Dashboard | لوحة تحكم لإدارة الكافيهات والمنيوات والمنتجات واستيراد CSV | `/admin/dashboard` |

كل بروفايل/منيو بيشتغل بـ "ثيم" (تيمة تصميم) جاهز — في 18 ثيم مختلف (Classic Luxury, Batman, Stitch, Spiderman, Nardo Stealth, Cyber Cyan Drift وغيرها).

---

## التقنيات المستخدمة

| التقنية | الاستخدام |
|---|---|
| **Next.js 16** (App Router) | إطار العمل — SSR + API Routes |
| **React 19 + TypeScript 5** | الواجهة والأنواع |
| **Tailwind CSS v4** | التنسيقات |
| **Firebase (Admin SDK + Client SDK)** | قاعدة البيانات Firestore + تخزين الصور Storage |
| **next-intl** | الترجمة (عربي / إنجليزي) مع RTL تلقائي |
| **Framer Motion** | الحركات والانتقالات (كاروسيل المنيو، المودالات) |
| **Cloudinary (next-cloudinary)** | رفع الصور وضغطها |
| **qrcode.react** | توليد أكواد QR للمنيوهات |
| **Google Apps Script (GAS)** | استقبال الطلبات وإدخالها في Google Sheets |
| **lucide-react** | الأيقونات |
| **Vercel** | النشر والاستضافة |

---

## هيكل المشروع

```
src/
├── app/
│   ├── [locale]/                 # الصفحات حسب اللغة (ar/en)
│   │   ├── (main)/               # الصفحة الرئيسية + المنتجات + المتجر
│   │   ├── admin/dashboard/      # لوحة التحكم
│   │   ├── cafe/[slug]/          # صفحة الكافيه
│   │   ├── menu/[slug]/          # المنيو الرقمي
│   │   ├── user/[id]/            # بطاقة الأعمال الرقمية
│   │   └── ...                    # Auto Tap / Business Tap / Digital Cards
│   └── api/                      # Routes: cafes, menus, products, orders, upload...
├── components/
│   ├── admin/                    # إدارة المنيوهات والمنتجات + استيراد CSV
│   ├── forms/                    # فورمات المنتجات (AutoTap, BusinessTap, DigitalCards)
│   ├── home/                     # مكونات الصفحة الرئيسية
│   ├── menu/                     # كاروسيل المنيو والأيقونات
│   ├── profiles/                 # الـ 18 ثيم (Batman, Stitch, ...)
│   └── shop/                     # المتجر ونافذة تفاصيل المنتج
├── i18n/                         # إعدادات الترجمة (ar/en)
├── lib/                          # المنطق: Firebase, الثيمات, المنيو, الأسعار, التخزين
├── messages/                     # ملفات الترجمة (en.json / ar.json)
└── middleware.ts                 # توجيه اللغة تلقائياً
```

---

## التشغيل محلياً

1) تثبيت الحزم:

```bash
npm install
```

2) إعداد متغيرات البيئة — انسخ `.env.example` إلى `.env.local` واملأ القيم:

```bash
cp .env.example .env.local
```

3) تشغيل نسخة التطوير:

```bash
npm run dev
```

4) بناء نسخة الإنتاج وتشغيلها:

```bash
npm run build
npm start -- -p 3101
```

> ملاحظة: في نسخة الـ build استخدم `npm run start -- -p <port>` (npm لازم يأخذ الـ flag بعد `--`).

---

## متغيرات البيئة

| المتغير | الوصف |
|---|---|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | اسم حساب Cloudinary (الرفع) |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | مفاتيح Cloudinary من السيرفر |
| `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` | بيانات Firebase Admin SDK (الوصول من السيرفر) |
| `NEXT_PUBLIC_FIREBASE_*` | إعدادات Firebase Client SDK (المتصفح) |
| `NEXT_PUBLIC_GAS_URL` | رابط Google Apps Script لاستقبال الطلبات |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | رقم الواتساب لاستقبال الطلبات |
| `NEXT_PUBLIC_BASE_URL` | الرابط الأساسي (مستخدم في أكواد QR) |

---

## قاعدة البيانات (Firestore)

| الكوليكشن | المحتوى |
|---|---|
| `profiles` | بروفايلات البطاقات الرقمية (Digital Cards / Auto Tap / Business Tap) |
| `cafes` | بيانات الكافيهات (مواعيد العمل، مواقع، وسائل دفع، واتساب) |
| `menus` | المنيوهات الرقمية (أقسام + أصناف + أسعار + ثيم) |
| `products` | منتجات المتجر |
| `orders` | الطلبات (عبر GAS أو مباشرة) |

الأصناف داخل `menus.items` بتتحفظ بالشكل:

```
{
  name: "اسم الصنف",
  price: "السعر",
  category: "اسم القسم",
  description: "الوصف",
  sizes/prices: [{ label: "عادي", price: "45" }, ...]
}
```

---

## الواجهات البرمجية (API Routes)

| المسار | الوظيفة |
|---|---|
| `/api/menus` + `/api/menus/[id]` | قراءة وإنشاء وتعديل وحذف المنيوهات |
| `/api/menus/import` | استيراد منيو من CSV (أقسام + أسعار إضافية) |
| `/api/cafes` + `/api/cafes/[id]` | إدارة الكافيهات |
| `/api/products` + `/api/products/[id]` | إدارة منتجات المتجر |
| `/api/orders` | استقبال الطلبات وإرسالها إلى Google Sheets |
| `/api/upload` | رفع الصور (Cloudinary) |
| `/api/cafe-to-sheet` | مزامنة بيانات الكافيه مع Google Sheets |

---

## النشر

- المشروع منشور على **Vercel** — كل push على فرع `production-release` بينشر تلقائياً.
- متغيرات البيئة بتتحط في إعدادات المشروع على Vercel.

---

## ملاحظات

- استيراد المنيوهات يتم عبر ملف CSV من لوحة التحكم (أعمدة: القسم، اسم الصنف، الوصف، السعر، أسعار إضافية).
- المنيو الرقمي بيدعم: كاروسيل أقسام، سحب بين الشاشات، فلاتر أقسام فرعية، مواعيد عمل، وأسعار متعددة (عادي/اكسترا).
- ملفات حساسة (مفاتيح Firebase، ملفات GAS، بيانات العملاء) **غير مرفوعة** على GitHub — موجودة في `.gitignore`.