"use client";

import { motion } from "framer-motion";
import { Info, Boxes, Layers, Cpu, Database, Globe, Terminal, Rocket, ListTree, KeyRound } from "lucide-react";

const PRODUCTS = [
  {
    title: "Digital Cards",
    desc: "بطاقة أعمال رقمية بلمسة NFC — لينكات التواصل والسوشيال كاملة",
    path: "/user/[id]",
  },
  {
    title: "Auto Tap",
    desc: "بروفايل NFC تلقائي (صفحة واحدة + لينك المنصة)",
    path: "/auto-tap",
  },
  {
    title: "Business Tap",
    desc: "بروفايل كامل للشركات والمحلات (مواعيد، لينك منيو، تقييمات)",
    path: "/business-tap",
  },
  {
    title: "Smart Menu",
    desc: "منيو رقمي للمطاعم والكافيهات بأقسام وأسعار ومواعيد عمل",
    path: "/menu/[slug]",
  },
  {
    title: "Cafe Profile",
    desc: "صفحة كافيه كاملة (مواعيد العمل، واتساب، مواقع، وسائل دفع)",
    path: "/cafe/[slug]",
  },
  {
    title: "Shop",
    desc: "متجر منتجات مع طلب مباشر عبر واتساب",
    path: "/shop",
  },
  {
    title: "Admin Dashboard",
    desc: "لوحة تحكم لإدارة الكافيهات والمنيوات والمنتجات واستيراد CSV",
    path: "/admin/dashboard",
  },
];

const TECH = [
  { name: "Next.js 16", desc: "App Router + API Routes" },
  { name: "React 19 + TypeScript", desc: "واجهة وأنواع قوية" },
  { name: "Tailwind CSS v4", desc: "التنسيقات" },
  { name: "Firebase", desc: "Firestore + Storage (Admin/Client SDK)" },
  { name: "next-intl", desc: "ترجمة عربي/إنجليزي + RTL" },
  { name: "Framer Motion", desc: "الحركات والانتقالات" },
  { name: "Cloudinary", desc: "رفع الصور وضغطها" },
  { name: "qrcode.react", desc: "أكواد QR للمنيوهات" },
  { name: "Google Apps Script", desc: "الطلبات إلى Google Sheets" },
  { name: "Vercel", desc: "النشر والاستضافة" },
];

const API_ROUTES = [
  { path: "/api/menus + /api/menus/[id]", desc: "قراءة وإنشاء وتعديل وحذف المنيوهات" },
  { path: "/api/menus/import", desc: "استيراد منيو من CSV" },
  { path: "/api/cafes + /api/cafes/[id]", desc: "إدارة الكافيهات" },
  { path: "/api/products + /api/products/[id]", desc: "إدارة منتجات المتجر" },
  { path: "/api/orders", desc: "استقبال الطلبات وإرسالها إلى Google Sheets" },
  { path: "/api/upload", desc: "رفع الصور (Cloudinary)" },
  { path: "/api/cafe-to-sheet", desc: "مزامنة بيانات الكافيه مع Google Sheets" },
];

const COLLECTIONS = [
  { name: "profiles", desc: "بروفايلات البطاقات الرقمية (Digital Cards / Auto Tap / Business Tap)" },
  { name: "cafes", desc: "بيانات الكافيهات (مواعيد العمل، مواقع، وسائل دفع)" },
  { name: "menus", desc: "المنيوهات الرقمية (أقسام + أصناف + أسعار + ثيم)" },
  { name: "products", desc: "منتجات المتجر" },
  { name: "orders", desc: "الطلبات (عبر GAS أو مباشرة)" },
];

const ENV_VARS = [
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET",
  "FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY",
  "NEXT_PUBLIC_FIREBASE_*",
  "NEXT_PUBLIC_GAS_URL",
  "NEXT_PUBLIC_WHATSAPP_NUMBER",
  "NEXT_PUBLIC_BASE_URL",
];

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-dark-card/50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-slate-light">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre
      dir="ltr"
      className="text-left text-sm leading-relaxed overflow-x-auto rounded-xl border border-white/10 bg-matte-black/80 p-4 text-slate-muted"
    >
      {children}
    </pre>
  );
}

export default function ProjectPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-14 lg:pt-40 lg:pb-20 bg-gradient-to-b from-gold/5 via-matte-black to-matte-black overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs mb-6">
              <Info className="w-4 h-4" />
              <span>عن المشروع</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-light mb-4 leading-tight">
              كيف اتعمل مشروع <span className="text-gradient-gold">GoTap</span>
            </h1>
            <p className="text-slate-muted text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              منصة ويب متكاملة لمنتجات GoTap الذكية: بطاقات أعمال رقمية، بروفايلات NFC،
              منيوات رقمية للمطاعم والكافيهات، ومتجر منتجات مع طلب عبر واتساب —
              كل ده في تطبيق واحد مبني بـ Next.js و Firebase.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 space-y-8">
          {/* Products */}
          <Card title="منتجات المشروع" icon={<Boxes className="w-5 h-5" />}>
            <div className="grid sm:grid-cols-2 gap-3">
              {PRODUCTS.map((p) => (
                <div key={p.title} className="rounded-xl border border-white/10 bg-matte-black/40 p-4">
                  <div className="font-bold text-slate-light mb-1">{p.title}</div>
                  <p className="text-sm text-slate-muted leading-relaxed">{p.desc}</p>
                  <code dir="ltr" className="block text-left text-xs text-gold/80 mt-2">{p.path}</code>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-muted mt-4">
              كل بروفايل أو منيو بيشتغل بـ "ثيم" جاهز — في 18 ثيم مختلف (Classic Luxury, Batman, Stitch,
              Spiderman, Nardo Stealth وغيرها).
            </p>
          </Card>

          {/* Tech */}
          <Card title="التقنيات المستخدمة" icon={<Cpu className="w-5 h-5" />}>
            <div className="grid sm:grid-cols-2 gap-3">
              {TECH.map((t) => (
                <div key={t.name} className="flex items-start gap-3 rounded-xl border border-white/10 bg-matte-black/40 p-4">
                  <div className="w-2 h-2 rounded-full bg-gradient-gold mt-2 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-light text-sm" dir="ltr">{t.name}</div>
                    <div className="text-xs text-slate-muted mt-0.5">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Structure */}
          <Card title="هيكل المشروع" icon={<Layers className="w-5 h-5" />}>
            <CodeBlock>{`src/
├── app/
│   ├── [locale]/                 # الصفحات حسب اللغة (ar/en)
│   │   ├── (main)/               # الصفحة الرئيسية + المنتجات + المتجر
│   │   ├── admin/dashboard/      # لوحة التحكم
│   │   ├── cafe/[slug]/          # صفحة الكافيه
│   │   ├── menu/[slug]/          # المنيو الرقمي
│   │   ├── user/[id]/            # بطاقة الأعمال الرقمية
│   │   └── ...                    # Auto Tap / Business Tap / Digital Cards
│   └── api/                      # Routes: cafes, menus, products, orders, upload
├── components/
│   ├── admin/                    # إدارة المنيوهات + استيراد CSV
│   ├── forms/                    # فورمات المنتجات
│   ├── home/                     # مكونات الصفحة الرئيسية
│   ├── menu/                     # كاروسيل المنيو والأيقونات
│   ├── profiles/                 # الثيمات (18 ثيم)
│   └── shop/                     # المتجر ونافذة المنتج
├── i18n/                         # إعدادات الترجمة (ar/en)
├── lib/                          # المنطق: Firebase، الثيمات، المنيو، الأسعار
├── messages/                     # ملفات الترجمة (en.json / ar.json)
└── middleware.ts                 # توجيه اللغة تلقائياً`}</CodeBlock>
          </Card>

          {/* Database */}
          <Card title="قاعدة البيانات (Firestore)" icon={<Database className="w-5 h-5" />}>
            <div className="space-y-2">
              {COLLECTIONS.map((c) => (
                <div key={c.name} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 rounded-xl border border-white/10 bg-matte-black/40 px-4 py-3">
                  <code dir="ltr" className="text-left text-sm font-semibold text-gold shrink-0 w-28">{c.name}</code>
                  <span className="text-sm text-slate-muted">{c.desc}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-muted mt-4">الأصناف داخل menus.items بتتحفظ بالشكل:</p>
            <CodeBlock>{`{
  name: "اسم الصنف",
  price: "السعر",
  category: "اسم القسم",
  description: "الوصف",
  sizes/prices: [{ label: "عادي", price: "45" }, ...]
}`}</CodeBlock>
          </Card>

          {/* API */}
          <Card title="الواجهات البرمجية (API Routes)" icon={<ListTree className="w-5 h-5" />}>
            <div className="space-y-2">
              {API_ROUTES.map((r) => (
                <div key={r.path} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 rounded-xl border border-white/10 bg-matte-black/40 px-4 py-3">
                  <code dir="ltr" className="text-left text-sm font-semibold text-gold shrink-0 w-64">{r.path}</code>
                  <span className="text-sm text-slate-muted">{r.desc}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Run locally */}
          <Card title="التشغيل محلياً" icon={<Terminal className="w-5 h-5" />}>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-muted mb-2">1) تثبيت الحزم:</p>
                <CodeBlock>{`npm install`}</CodeBlock>
              </div>
              <div>
                <p className="text-sm text-slate-muted mb-2">2) إعداد متغيرات البيئة — انسخ .env.example إلى .env.local واملأ القيم:</p>
                <CodeBlock>{`cp .env.example .env.local`}</CodeBlock>
              </div>
              <div>
                <p className="text-sm text-slate-muted mb-2">3) تشغيل نسخة التطوير:</p>
                <CodeBlock>{`npm run dev`}</CodeBlock>
              </div>
              <div>
                <p className="text-sm text-slate-muted mb-2">4) بناء نسخة الإنتاج وتشغيلها:</p>
                <CodeBlock>{`npm run build
npm run start -- -p 3101`}</CodeBlock>
              </div>
            </div>
          </Card>

          {/* Env */}
          <Card title="متغيرات البيئة" icon={<KeyRound className="w-5 h-5" />}>
            <div className="flex flex-wrap gap-2">
              {ENV_VARS.map((v) => (
                <code key={v} dir="ltr" className="text-xs rounded-lg border border-white/10 bg-matte-black/60 px-3 py-1.5 text-slate-muted">{v}</code>
              ))}
            </div>
          </Card>

          {/* Deploy */}
          <Card title="النشر" icon={<Rocket className="w-5 h-5" />}>
            <ul className="space-y-2 text-slate-muted text-sm">
              <li className="flex gap-2">
                <span className="text-gold shrink-0">•</span>
                <span>المشروع منشور على <code dir="ltr" className="text-gold">Vercel</code> — كل push على فرع <code dir="ltr" className="text-gold">production-release</code> بينشر تلقائياً.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gold shrink-0">•</span>
                <span>استيراد المنيوهات يتم عبر ملف CSV من لوحة التحكم.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gold shrink-0">•</span>
                <span>الملفات الحساسة (مفاتيح Firebase، ملفات GAS، بيانات العملاء) غير مرفوعة على GitHub.</span>
              </li>
            </ul>
          </Card>

          {/* Footer note */}
          <div className="text-center pt-4">
            <div className="inline-flex items-center gap-2 text-sm text-slate-muted">
              <Globe className="w-4 h-4 text-gold" />
              <span>
                Gotap —
                <a href="https://gotap.vercel.app" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline mx-1" dir="ltr">gotap.vercel.app</a>
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
