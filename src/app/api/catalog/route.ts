import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase";

export async function GET() {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("catalog").orderBy("order_index", "asc").get();
    const items = snapshot.docs
      .map((d) => {
        const data = d.data() as { slug?: string } & Record<string, unknown>;
        return { id: d.id, ...data };
      })
      .filter((p) => p.slug || p.id);

    return NextResponse.json(items);
  } catch (error) {
    console.error("API GET /catalog error:", error);
    return NextResponse.json([]);
  }
}