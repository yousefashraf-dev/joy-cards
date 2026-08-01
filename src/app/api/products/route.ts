import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getAdminDb();
    const docRef = await db.collection("products").add({
      ...body,
      createdAt: new Date(),
    });
    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error("API POST /products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection("products")
      .orderBy("createdAt", "desc")
      .get();

    const products = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name,
        price: data.price,
        salePrice: data.salePrice ?? null,
        category: data.category,
        description: data.description,
        images: data.images || [],
        type: data.type === "regular" ? "regular" : "nfc",
        createdAt: data.createdAt?.toMillis() || Date.now(),
      };
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("API /products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
