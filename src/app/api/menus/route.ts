import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase";
import type { MenuCategory } from "@/lib/cafe-schema";

const CATEGORY_ICON_MAP: Record<string, string> = {
  سلطة: "🥗", salad: "🥗",
  "مشروبات ساخنة": "☕", "مشروبات ساخنه": "☕", "hot drinks": "☕", coffee: "☕", قهوة: "☕", شاي: "🍵",
  "مشروبات باردة": "🥤", "مشروبات بارده": "🥤", "cold drinks": "🥤", juice: "🧃", عصير: "🧃", عصائر: "🧃",
  بيتزا: "🍕", pizza: "🍕",
  برجر: "🍔", burger: "🍔",
  سوشي: "🍣", sushi: "🍣",
  حلويات: "🍰", sweets: "🍰", dessert: "🍰", "آيس كريم": "🍦",
  شوربة: "🍜", soup: "🍜",
  باستا: "🍝", pasta: "🍝",
  مقبلات: "🥓", appetizer: "🥓", starters: "🥓",
  لحوم: "🥩", meat: "🥩", steak: "🥩",
  مشاوي: "🍖", grill: "🍖",
  فطار: "🍳", breakfast: "🍳", "وجبة فطار": "🍳",
  سموذي: "🥑", smoothie: "🥑",
  ميلك: "🥛", "ميلك شيك": "🥛",
  دونات: "🍩", donut: "🍩",
  مخبوزات: "🥨", bakery: "🥨", "خبز": "🍞",
  سمك: "🐟", fish: "🐟", seafood: "🦐",
  دجاج: "🍗", chicken: "🍗",
  "وجبات أطفال": "👶", kids: "👶",
};

function normalizeCategories(cats: unknown): MenuCategory[] {
  if (!Array.isArray(cats)) return [];
  if (cats.length === 0) return [];
  if (typeof cats[0] === "string") {
    return (cats as string[]).map((name) => {
      const lower = name.trim().toLowerCase();
      let icon = "";
      for (const [key, emoji] of Object.entries(CATEGORY_ICON_MAP)) {
        if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
          icon = emoji;
          break;
        }
      }
      return { name: name.trim(), icon };
    });
  }
  return cats as MenuCategory[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getAdminDb();
    const docRef = await db.collection("menus").add({
      ...body,
      createdAt: new Date(),
    });
    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error("API POST /menus error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const db = getAdminDb();
    const slug = req.nextUrl.searchParams.get("slug");

    if (slug) {
      const snapshot = await db
        .collection("menus")
        .where("slug", "==", slug)
        .get();
      if (snapshot.empty) {
        return NextResponse.json({ error: "Menu not found" }, { status: 404 });
      }
      const doc = snapshot.docs[0];
      const data = doc.data();
      return NextResponse.json({
        id: doc.id,
        name: data.name,
        slug: data.slug,
        logo: data.logo,
        categories: normalizeCategories(data.categories),
        items: (data.items || []).map((i: Record<string, unknown>) => ({
          name: i.name as string,
          price: i.price as string,
          category: i.category as string,
          size: i.size as string | undefined,
          description: i.description as string | undefined,
          prices: (i.prices as { label: string; price: string }[] | undefined) || [],
          sizes: (i.sizes as { label: string; price: string }[] | undefined) || (i.prices as { label: string; price: string }[] | undefined) || [],
        })),
        theme: data.theme || "cafe",
        createdAt: data.createdAt?.toMillis() || Date.now(),
      });
    }

    const snapshot = await db
      .collection("menus")
      .orderBy("createdAt", "desc")
      .get();

    const menus = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name,
        slug: data.slug,
        logo: data.logo,
        categories: normalizeCategories(data.categories),
        items: (data.items || []).map((i: Record<string, unknown>) => ({
          name: i.name as string,
          price: i.price as string,
          category: i.category as string,
          size: i.size as string | undefined,
          description: i.description as string | undefined,
          prices: (i.prices as { label: string; price: string }[] | undefined) || [],
          sizes: (i.sizes as { label: string; price: string }[] | undefined) || (i.prices as { label: string; price: string }[] | undefined) || [],
        })),
        theme: data.theme || "cafe",
        createdAt: data.createdAt?.toMillis() || Date.now(),
      };
    });

    return NextResponse.json(menus);
  } catch (error) {
    console.error("API /menus error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
