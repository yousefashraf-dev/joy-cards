# جلسة 22 يوليو 2026 — Feature Section للمطاعم + تصحيح أزرار كروت الفرح

## التعديلات

### 1. Feature Section في صفحة business-tap
- **الملف:** `src/app/[locale]/(main)/business-tap/page.tsx`
- إضافة 3 أعمدة: QR+NFC اتصال ذكي | صفحة روابط ودفع (Mockup) | قائمة طعام رقمية بدون أسعار (Mockup)
- تصميم داكن فاخر متماشي مع الهوية، أيقونات متحركة، متجاوب بالكامل
- إضافة keys ترجمة جديدة `featureSection` في `ar.json` / `en.json`

### 2. تصحيح زر "اطلب الآن" في wedding-cards
- **الملف:** `src/app/[locale]/(main)/wedding-cards/page.tsx`
- إزالة زر الواتساب الثاني (كان بيظهر جنب زر الفورم وكلاهما "اطلب الآن")
- إبقاء الزر الذهبي فقط → `/wedding/order`

### 3. إعادة تصميم المنيو الرقمي (جلسة 21)
- **صفحة المنيو:** Parent Tabs + Sub Tabs + Items بدون أسعار
- **MenuBuilder:** إضافة `size` لكل صنف
- **CSV Import:** رفع CSV + معاينة جدولية قبل الحفظ
- **Menu Groups:** 7 مجموعات رئيسية (سوشي، آسيوي، مشروبات باردة/ساخنة، غربي، حلويات، إضافات)
- **خطوط:** Cairo + Outfit في `layout.tsx` و `globals.css`

### 4. نظام طلبات كروت الفرح (جلسات 19-20)
- **WeddingOrderForm:** 8 خطوات (Couple → Date → HappyMoment → Story → DressCode → Venue → Theme → Review)
- **WeddingPreview:** إعادة تصميم كاملة + 4 ثيمات (Champagne Rose, Sage Emerald, Navy Silver, Blush Lilac)
- **CountdownTimer:** أرقام كبيرة + fallback لتاريخ فارغ
- **Navbar:** ثابت أعلى صفحة الكارت

### 5. تحسينات الكافيه (جلسة 19)
- **VodafoneCashExtra:** أرقام دفع متعددة + Modal اختيار
- **Bio + YouTube + Email + Working Hours:** حقول جديدة
- **QR Code:** معاينة + تحميل 2000px

---

## الفحوصات

| الفحص | النتيجة |
|-------|---------|
| `npx tsc --noEmit` | ✅ 0 errors |
| `en.json` braces | ✅ 73/73 |
| `ar.json` braces | ✅ 73/73 |
| `git push` | ✅ `production-release` |

```bash
git log --oneline -1
58cfcd2 feat: business-tap feature section + wedding-cards single CTA + menu redesign
```