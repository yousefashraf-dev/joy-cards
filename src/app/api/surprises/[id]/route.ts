import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getAdminDb();
    const doc = await db.collection("surprises").doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data = doc.data()!;
    return NextResponse.json({
      id: doc.id,
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
    });
  } catch (error) {
    console.error("API GET /surprises/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getAdminDb();
    await db.collection("surprises").doc(id).update(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API PUT /surprises/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getAdminDb();
    await db.collection("surprises").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API DELETE /surprises/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
