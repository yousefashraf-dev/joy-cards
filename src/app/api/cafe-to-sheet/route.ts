import { NextResponse } from "next/server";

const GAS_CAFE_URL =
  process.env.NEXT_PUBLIC_GAS_CAFE_URL ||
  process.env.NEXT_PUBLIC_GAS_URL ||
  "https://script.google.com/macros/s/AKfycbw-PmI1T_L_Gogf_ikeY2W-bZslG7Z2_8mcvxsioGI8lCv6R6FWgHLmhw8l21Vtnelfpg/exec";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const payload = {
      ...body,
      type: "cafe",
      submittedAt: new Date().toISOString(),
    };

    console.log("Cafe-to-Sheet payload:", JSON.stringify(payload, null, 2));

    // Forward to Google Apps Script (server-side — no CORS issues)
    const response = await fetch(GAS_CAFE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    return NextResponse.json({
      success: true,
      message: "Data sent to sheet",
      gasStatus: response.status,
      gasResponse: text,
    });
  } catch (error) {
    console.error("Cafe-to-Sheet error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send data to sheet" },
      { status: 500 }
    );
  }
}
