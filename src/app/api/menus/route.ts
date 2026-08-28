import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase";
import { normalizeCategories } from "@/lib/category-icons";

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
        adminPin: data.adminPin || null,
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
        adminPin: data.adminPin || null,
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
