import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getAdminDb();
    const docRef = await db.collection("surprises").add({
      ...body,
      active: body.active !== undefined ? body.active : true,
      createdAt: new Date(),
    });
    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error("API POST /surprises error:", error);
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
      .collection("surprises")
      .orderBy("createdAt", "desc")
      .get();

    const surprises = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title,
        message: data.message,
        password: data.password,
        senderName: data.senderName || "",
        recipientName: data.recipientName || "",
        musicUrl: data.musicUrl || "",
        coverPhoto: data.coverPhoto || "",
        caption: data.caption || "",
        startDate: data.startDate || "",
        confessionDate: data.confessionDate || "",
        confessionLabel: data.confessionLabel || "",
        photos: data.photos || [],
        finalLetter: data.finalLetter || "",
        active: data.active,
        createdAt: data.createdAt?.toMillis() || Date.now(),
        createdVia: data.createdVia || "admin",
      };
    });

    return NextResponse.json(surprises);
  } catch (error) {
    console.error("API /surprises error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
