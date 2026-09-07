import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getAdminDb();
    const docRef = await db.collection("orders").add({
      ...body,
      status: "pending",
      createdAt: new Date(),
    });
    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error("API POST /catalog-orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("orders").orderBy("createdAt", "desc").limit(200).get();
    const orders = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
      };
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("API GET /catalog-orders error:", error);
    return NextResponse.json([]);
  }
}