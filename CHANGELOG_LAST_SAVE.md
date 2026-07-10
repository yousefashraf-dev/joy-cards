# Last Save Summary

## 1. QR Code Generator & Download
- `src/components/admin/CafeForm.tsx` — QR preview in form + hidden high-res (2000px) canvas for download
- `src/components/admin/CafeTable.tsx` — QR download icon in "رابط الكافيه" column (table)
- `package.json` — Added `qrcode.react@^4.2.0`
- `src/messages/ar.json`, `en.json` — `qrCode` + `downloadQR` translations

## 2. New Standard Theme (Neutral Dark)
- `src/lib/cafe-themes.ts` — Added `"standard"` theme (Deep Charcoal Black bg `#111827→#0f172a→#030712`, Slate Gray accent `#cbd5e1`)
- `src/app/[locale]/cafe/[slug]/page.tsx` — Added empty `standard: []` to `THEME_DECORATIONS`

## 3. Auto-Tap Order Fixes & Modifications
### Removed "Icon" sticker option (only Username remains)
- `src/components/forms/AutoTapForm.tsx` — Removed StickerType selection step + Platform step; reduced from 7 to 5 steps (shipping → customization → theme → sizing → review)

### Price changed to 200 EGP + shipping, hidden until review
- `src/lib/pricing.ts` — `BASE_PRICE = 200`, removed `stickerType` param from `calcTotal()`
- `src/lib/constants.ts` — `MULTIPLE_USERS = 200`
- `src/app/[locale]/(main)/auto-tap/page.tsx` — Removed price numbers from pricing bar; default `stickerType: "username"`

### Fixed order submission failure
- `src/lib/submitOrder.ts` — GAS fetch is now **fire-and-forget** (no `await`, no `throw` on failure); order is always saved to Firestore regardless of GAS result
- `src/components/forms/AutoTapForm.tsx` — Added `completedRef` to prevent double-toast; safety timer 30s

### Fixed image 500 error
- `src/app/[locale]/(main)/auto-tap/page.tsx` — Replaced Unsplash hero image with local `/nfc-cafe.png`

## 4. Auto-Tap order flow (5 steps)
1. الشحن (Shipping)
2. التخصيص (Customization)
3. الثيم (Theme)
4. المقاس (Sizing)
5. المراجعة (Review)

## Commits
```
043b3ff1 feat: add QR code generator/download + new Standard theme
3ad3fe8 fix: boost QR code download to 2000px high-res for print
0411983 fix: auto-tap order submission + remove icon + price 200+shipping
e161f48 fix: replace Unsplash image, GAS fire-and-forget, 15s timeout
19180bf fix: prevent double-toast, increase timeout to 30s with completedRef
```

Branch: `production-release` → pushed to `origin/production-release`
