import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase";
import { normalizeCategories } from "@/lib/category-icons";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getAdminDb();
    const docRef = await db.collection("cafes").add({
      ...body,
      createdAt: new Date(),
    });
    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error("API POST /cafes error:", error);
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
        .collection("cafes")
        .where("slug", "==", slug)
        .get();
      if (snapshot.empty) {
        return NextResponse.json({ error: "Cafe not found" }, { status: 404 });
      }
      const doc = snapshot.docs[0];
      const data = doc.data();
      return NextResponse.json({
        id: doc.id,
        name: data.name,
        slug: data.slug,
        logo: data.logo,
        menuUrl: data.menuUrl,
        menuImages: data.menuImages || [],
        menuType: data.menuType,
        menuCategories: normalizeCategories(data.menuCategories),
        menuItems: data.menuItems || [],
        theme: data.theme || "cafe",
        phone: data.phone,
        whatsapp: data.whatsapp,
        websiteUrl: data.websiteUrl,
        facebook: data.facebook,
        instagram: data.instagram,
        tiktok: data.tiktok,
        snapchatUrl: data.snapchatUrl,
        telegram: data.telegram,
        googleMapsUrl: data.googleMapsUrl,
        googleReviewsUrl: data.googleReviewsUrl,
        locations: data.locations || [],
        wifiName: data.wifiName,
        wifiPassword: data.wifiPassword,
        vodafoneCash: data.vodafoneCash,
        vodafoneCashExtra: data.vodafoneCashExtra || [],
        instaPay: data.instaPay,
        youtubeUrl: data.youtubeUrl,
        email: data.email,
        bio: data.bio,
        workingHours: data.workingHours || [],
        createdAt: data.createdAt?.toMillis() || Date.now(),
      });
    }

    const snapshot = await db
      .collection("cafes")
      .orderBy("createdAt", "desc")
      .get();

    const cafes = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name,
        slug: data.slug,
        logo: data.logo,
        menuUrl: data.menuUrl,
        menuImages: data.menuImages || [],
        menuType: data.menuType,
        menuCategories: normalizeCategories(data.menuCategories),
        menuItems: data.menuItems || [],
        theme: data.theme || "cafe",
        phone: data.phone,
        whatsapp: data.whatsapp,
        websiteUrl: data.websiteUrl,
        facebook: data.facebook,
        instagram: data.instagram,
        tiktok: data.tiktok,
        snapchatUrl: data.snapchatUrl,
        telegram: data.telegram,
        googleMapsUrl: data.googleMapsUrl,
        googleReviewsUrl: data.googleReviewsUrl,
        locations: data.locations || [],
        wifiName: data.wifiName,
        wifiPassword: data.wifiPassword,
        vodafoneCash: data.vodafoneCash,
        vodafoneCashExtra: data.vodafoneCashExtra || [],
        instaPay: data.instaPay,
        youtubeUrl: data.youtubeUrl,
        email: data.email,
        bio: data.bio,
        workingHours: data.workingHours || [],
        createdAt: data.createdAt?.toMillis() || Date.now(),
      };
    });

    return NextResponse.json(cafes);
  } catch (error) {
    console.error("API /cafes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
