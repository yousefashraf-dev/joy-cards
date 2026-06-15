import { GAS_URL } from "./constants";
import { getClientDb } from "./client-firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import type { OrderPayload } from "./types";

function stripUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(stripUndefined) as unknown as T;
  return Object.fromEntries(
    Object.entries(obj as Record<string, unknown>)
      .filter((entry) => entry[1] !== undefined)
      .map(([k, v]) => [k, stripUndefined(v)])
  ) as T;
}

function buildAddress(data: OrderPayload): string {
  const parts: string[] = [];
  if (data.street) parts.push(data.street);
  if (data.city) parts.push(data.city);
  if (data.governorate) parts.push(data.governorate);
  const autoTapAddress = data.autoTapFields?.addressDetail;
  if (autoTapAddress && !parts.some((p) => autoTapAddress.includes(p))) {
    parts.push(autoTapAddress);
  }
  return parts.join("، ") || autoTapAddress || "";
}

function buildProductDetails(data: OrderPayload): string {
  const details: string[] = [];
  details.push(`النوع: ${data.productType}`);
  details.push(`التصميم: ${data.theme}`);
  if (data.autoTapFields) {
    details.push(`نوع الحساب: ${data.autoTapFields.profileType === "single" ? "مستخدم واحد" : "متعدد المستخدمين"}`);
    details.push(`عرض اللوجو: ${data.autoTapFields.logoWidthCm} سم`);

  } else if (data.digitalCardsFields) {
    if (data.digitalCardsFields.website) details.push(`الموقع: ${data.digitalCardsFields.website}`);
    if (data.digitalCardsFields.email) details.push(`البريد: ${data.digitalCardsFields.email}`);
    if (data.digitalCardsFields.customPrintDesign) details.push("طلب طباعة لزق إضافي");
  } else if (data.businessTapFields) {
    details.push(`المنشأة: ${data.businessTapFields.establishmentName}`);
    details.push(`الكمية: ${data.businessTapFields.quantity}`);
  }
  return details.join(" | ");
}

export async function submitOrder(
  data: OrderPayload,
  totalPrice?: number,
  locale?: string,
): Promise<{ success: boolean; message: string; profileId?: string }> {
  let profileId: string | undefined;

  // 1. Save to Firestore first to get the profile ID
  try {
    const db = getClientDb();
    const docRef = await addDoc(collection(db, "profiles"), {
      name: data.customerName,
      displayName: data.displayName || "",
      logo: data.logo || "",
      theme: data.theme,
      active: true,
      productType: data.productType,
      links: data.socialLinks || {},
      digitalCardsFields: data.digitalCardsFields ? stripUndefined(data.digitalCardsFields) : null,
      autoTapFields: data.autoTapFields ? stripUndefined(data.autoTapFields) : null,
      businessTapFields: data.businessTapFields ? stripUndefined(data.businessTapFields) : null,
      createdAt: Timestamp.now(),
    });
    profileId = docRef.id;
  } catch (error) {
    console.error("Firestore profile creation error:", error);
    throw error;
  }

  // 2. Generate dynamic profile link for GAS payload
  const profileLink = profileId
    ? `${window.location.origin}/${locale || "ar"}/user/${profileId}`
    : "";

  // 3. Build composite address
  const fullAddress = buildAddress(data);

  // 4. Build product details string
  const productDetails = buildProductDetails(data);

  // 5. Build GAS payload with Arabic headers matching V12 script
  const gasPayload = {
    "اسم العميل": data.customerName,
    "رقم التليفون": data.phone,
    "العنوان بالتفصيل": fullAddress,
    "رقم الواتساب": data.phone,
    "نوع المنتج": data.productType,
    "التصميم": data.theme,
    "تفاصيل المنتج": productDetails,
    "عرض اللوجو (سم)": data.autoTapFields?.logoWidthCm || "",
    "ملاحظات": data.autoTapFields?.orderNotes || "",
    "تم الدفع": false,
    "جاهز للشحن": false,
    "الإجمالي": totalPrice,
    "رابط الملف الشخصي": profileLink,
    totalPrice: totalPrice,
    profileLink: profileLink,
  };

  console.log("==========================================");
  console.log("GAS Endpoint:", GAS_URL);
  console.log("Payload being sent:", JSON.stringify(gasPayload, null, 2));
  console.log("==========================================");

  // 6. Send to Google Apps Script (fire-and-forget — no await)
  // Using mode: "no-cors" to bypass CORS restrictions.
  // GAS receives the JSON body via e.postData.contents regardless of content-type.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  fetch(GAS_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(gasPayload),
    signal: controller.signal,
  })
    .then(() => {
      clearTimeout(timeoutId);
      console.log("GAS request sent successfully (opaque response, cannot read body)");
    })
    .catch((error) => {
      clearTimeout(timeoutId);
      console.error("==========================================");
      console.error("GAS FETCH FAILED - Order may not have been saved to sheet!");
      console.error("Error:", error);
      console.error("GAS URL:", GAS_URL);
      console.error("==========================================");
    });

  return {
    success: true,
    message: "Order submitted successfully",
    profileId,
  };
}
