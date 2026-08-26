export interface GalleryPhoto {
  url: string;
  caption: string;
}

export interface Surprise {
  id?: string;
  title: string;
  message: string;
  password: string;
  senderName?: string;
  recipientName?: string;
  musicUrl?: string;
  coverPhoto?: string;
  caption?: string;
  startDate?: string;
  startDateLabel?: string;
  confessionDate?: string;
  confessionLabel?: string;
  photos?: GalleryPhoto[];
  finalLetter?: string;
  active: boolean;
  createdAt?: number;
  createdVia?: "admin" | "link";
}

export function validateSurprise(data: Partial<Surprise>): string | null {
  if (!data.title?.trim()) return "العنوان مطلوب";
  if (!data.message?.trim()) return "الرسالة مطلوبة";
  if (!data.password?.trim()) return "كلمة السر مطلوبة";
  return null;
}
