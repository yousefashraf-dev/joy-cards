export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeMB?: number;
}

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const { maxWidth = 1024, maxHeight = 1024, quality = 0.7, maxSizeMB = 1 } = options;

  const img = await createImage(file);
  const { width, height } = calculateDimensions(img.width, img.height, maxWidth, maxHeight);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, quality);
  const finalBlob = blob.size > maxSizeMB * 1024 * 1024
    ? await canvasToBlob(canvas, quality * 0.6)
    : blob;

  const name = file.name.replace(/\.[^/.]+$/, "") + ".webp";
  return new File([finalBlob], name, { type: "image/webp" });
}

function createImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function calculateDimensions(
  origWidth: number,
  origHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let width = origWidth;
  let height = origHeight;

  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }
  if (height > maxHeight) {
    width = Math.round((width * maxHeight) / height);
    height = maxHeight;
  }

  return { width, height };
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob returned null"));
      },
      "image/webp",
      quality
    );
  });
}
