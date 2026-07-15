# Menu Redesign & CSV Import Plan

## Steps
1. Update `MenuItem` type — add `size?: string`
2. Update `MenuBuilder.tsx` — add size input
3. Update API routes — support `size` field
4. Create `/api/menus/import` — CSV import endpoint
5. Create `CsvImport.tsx` — CSV upload + preview component
6. Add CSV Import tab in Admin Dashboard
7. Redesign `menu/[slug]/page.tsx` — Text-Only Premium Menu
8. Test: `npm run dev` + `tsc --noEmit`

## Files to modify
- `src/lib/cafe-schema.ts`
- `src/lib/menu-schema.ts`
- `src/components/admin/MenuBuilder.tsx`
- `src/app/api/menus/route.ts`
- `src/app/api/menus/[id]/route.ts`
- `src/app/[locale]/menu/[slug]/page.tsx`
- `src/app/[locale]/admin/dashboard/page.tsx`

## New files
- `src/app/api/menus/import/route.ts`
- `src/components/admin/CsvImport.tsx`

## CSV Structure
Category,Item Name,Size/Pieces,Price,Notes
