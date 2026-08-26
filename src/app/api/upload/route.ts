import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    let detectedType = file.type;
    if (!detectedType || detectedType === "application/octet-stream") {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'heic' || ext === 'heif') detectedType = 'image/heic';
      else if (ext === 'png') detectedType = 'image/png';
      else if (ext === 'jpg' || ext === 'jpeg') detectedType = 'image/jpeg';
      else if (ext === 'webp') detectedType = 'image/webp';
      else if (ext === 'pdf') detectedType = 'application/pdf';
      else if (ext === 'mp3') detectedType = 'audio/mpeg';
      else if (ext === 'wav') detectedType = 'audio/wav';
      else if (ext === 'ogg') detectedType = 'audio/ogg';
      else if (ext === 'm4a') detectedType = 'audio/mp4';
      else if (ext === 'aac') detectedType = 'audio/aac';
    }

    const isAudio = detectedType.startsWith("audio/");
    const isPdf = detectedType === "application/pdf";
    const maxSize = isAudio ? 20 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: isAudio ? "الملف كبير جداً (حد أقصى 20MB)" : "File too large (max 10MB)" }, { status: 400 });
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/heic", "image/heif", "application/pdf", "audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/aac"];
    if (!allowedTypes.includes(detectedType)) {
      return NextResponse.json({ error: "نوع الملف غير مدعوم" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const resourceType = isAudio ? "video" : isPdf ? "raw" : "image";

    const uploadOptions: Record<string, unknown> = {
      resource_type: resourceType,
      folder: "gotap",
      quality: "auto:good",
    };

    if (!isPdf && !isAudio) {
      uploadOptions.format = "webp";
    }

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result as { secure_url: string });
        }
      );
      uploadStream.end(buffer);
      uploadStream.on("error", reject);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
