import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, theme, items } = body;

    if (!name || !slug || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug, items" },
        { status: 400 }
      );
    }

    const categories = [
      ...new Set(items.map((i: { category: string }) => i.category).filter(Boolean)),
    ].map((catName: string) => ({
      name: catName,
      icon: "",
    }));

    const db = getAdminDb();
    const docRef = await db.collection("menus").add({
      name,
      slug,
      theme: theme || "standard",
      categories,
      items: items.map((i: { name: string; price: string; category: string; size?: string; description?: string; prices?: { label: string; price: string }[] }) => ({
        name: i.name,
        price: i.price,
        category: i.category,
        size: i.size || "",
        description: i.description || "",
        prices: i.prices || [],
      })),
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({ id: docRef.id, name, slug }, { status: 201 });
  } catch (error) {
    console.error("API POST /menus/import error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
