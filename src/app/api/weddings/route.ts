import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getAdminDb();
    const docRef = await db.collection("weddings").add({
      ...body,
      createdAt: new Date(),
    });
    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error("API POST /weddings error:", error);
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
        .collection("weddings")
        .where("slug", "==", slug)
        .get();
      if (snapshot.empty) {
        return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
      }
      const doc = snapshot.docs[0];
      const data = doc.data();
      return NextResponse.json({
        id: doc.id,
        coupleName1: data.coupleName1,
        coupleName2: data.coupleName2,
        slug: data.slug,
        image: data.image,
        story: data.story,
        date: data.date,
        time: data.time,
        venue: data.venue,
        venueMapsLink: data.venueMapsLink,
        dressCode: data.dressCode,
        dressCodeHer: data.dressCodeHer,
        dressCodeHim: data.dressCodeHim,
        active: data.active ?? true,
        createdAt: data.createdAt?.toMillis() || Date.now(),
      });
    }

    const snapshot = await db
      .collection("weddings")
      .orderBy("createdAt", "desc")
      .get();

    const weddings = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        coupleName1: data.coupleName1,
        coupleName2: data.coupleName2,
        slug: data.slug,
        image: data.image,
        story: data.story,
        date: data.date,
        time: data.time,
        venue: data.venue,
        venueMapsLink: data.venueMapsLink,
        dressCode: data.dressCode,
        dressCodeHer: data.dressCodeHer,
        dressCodeHim: data.dressCodeHim,
        active: data.active ?? true,
        createdAt: data.createdAt?.toMillis() || Date.now(),
      };
    });

    return NextResponse.json(weddings);
  } catch (error) {
    console.error("API /weddings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
