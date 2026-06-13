import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  try {
    const { profileId, secret } = await request.json();

    if (secret !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!profileId) {
      return NextResponse.json({ error: "profileId is required" }, { status: 400 });
    }

    const db = getAdminDb();
    const doc = await db.collection("profiles").doc(profileId).get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    await db.collection("profiles").doc(profileId).update({ active: true });

    return NextResponse.json({ success: true, message: "Profile activated successfully" });
  } catch (error) {
    console.error("Activation error:", error);
    return NextResponse.json({ error: "Failed to activate profile" }, { status: 500 });
  }
}
