import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, displayName, logo, theme, productType, socialLinks, digitalCardsFields, autoTapFields, businessTapFields } = body;

    const db = getAdminDb();
    const docRef = await db.collection("profiles").add({
      name: customerName,
      displayName: displayName || "",
      logo: logo || "",
      theme,
      active: true,
      productType,
      links: socialLinks || {},
      digitalCardsFields: digitalCardsFields || null,
      autoTapFields: autoTapFields || null,
      businessTapFields: businessTapFields || null,
      createdAt: new Date(),
    });

    return NextResponse.json({ profileId: docRef.id }, { status: 201 });
  } catch (error) {
    console.error("API POST /orders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
