import { getClientDb, getClientStorage } from "./client-firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { CafeTheme } from "./cafe-themes";

export interface WorkingHour {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface MenuCategory {
  name: string;
  icon: string;
}

const CATEGORY_ICON_MAP: Record<string, string> = {
  سلطة: "🥗", salad: "🥗",
  "مشروبات ساخنة": "☕", "مشروبات ساخنه": "☕", "hot drinks": "☕", coffee: "☕", قهوة: "☕", شاي: "🍵",
  "مشروبات باردة": "🥤", "مشروبات بارده": "🥤", "cold drinks": "🥤", juice: "🧃", عصير: "🧃", عصائر: "🧃",
  بيتزا: "🍕", pizza: "🍕",
  برجر: "🍔", burger: "🍔",
  سوشي: "🍣", sushi: "🍣",
  حلويات: "🍰", sweets: "🍰", dessert: "🍰", "آيس كريم": "🍦",
  شوربة: "🍜", soup: "🍜",
  باستا: "🍝", pasta: "🍝",
  مقبلات: "🥓", appetizer: "🥓", starters: "🥓",
  لحوم: "🥩", meat: "🥩", steak: "🥩",
  مشاوي: "🍖", grill: "🍖",
  فطار: "🍳", breakfast: "🍳", "وجبة فطار": "🍳",
  سموذي: "🥑", smoothie: "🥑",
  ميلك: "🥛", "ميلك شيك": "🥛",
  دونات: "🍩", donut: "🍩",
  مخبوزات: "🥨", bakery: "🥨", خبز: "🍞",
  سمك: "🐟", fish: "🐟", seafood: "🦐",
  دجاج: "🍗", chicken: "🍗",
  "وجبات أطفال": "👶", kids: "👶",
};

export function normalizeCategories(cats: unknown): MenuCategory[] {
  if (!Array.isArray(cats)) return [];
  if (cats.length === 0) return [];
  if (typeof cats[0] === "string") {
    return (cats as string[]).map((name) => {
      const lower = name.trim().toLowerCase();
      let icon = "";
      for (const [key, emoji] of Object.entries(CATEGORY_ICON_MAP)) {
        if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
          icon = emoji;
          break;
        }
      }
      return { name: name.trim(), icon };
    });
  }
  return cats as MenuCategory[];
}

export interface MenuItem {
  name: string;
  price: string;
  category: string;
  size?: string;
  description?: string;
  prices?: { label: string; price: string }[];
  sizes?: { label: string; price: string }[];
}

export interface CafeLocation {
  label: string;
  url: string;
}

export interface Cafe {
  id?: string;
  name: string;
  slug: string;
  logo?: string;
  menuUrl?: string;
  menuImages?: string[];
  menuType?: "pdf" | "images" | "link" | "web";
  menuCategories?: MenuCategory[];
  menuItems?: MenuItem[];
  theme?: CafeTheme;
  phone?: string;
  whatsapp?: string;
  websiteUrl?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  snapchatUrl?: string;
  telegram?: string;
  googleMapsUrl?: string;
  googleReviewsUrl?: string;
  locations?: CafeLocation[];
  wifiName?: string;
  wifiPassword?: string;
  vodafoneCash?: string;
  vodafoneCashExtra?: string[];
  instaPay?: string;
  youtubeUrl?: string;
  email?: string;
  bio?: string;
  workingHours?: WorkingHour[];
  createdAt?: number;
}

export async function uploadCafeFile(
  file: File,
  path: string
): Promise<string> {
  const storage = getClientStorage();
  const storageRef = ref(storage, `cafes/${path}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function addCafe(data: Omit<Cafe, "id" | "createdAt">) {
  const db = getClientDb();
  const docRef = await addDoc(collection(db, "cafes"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateCafe(id: string, data: Partial<Cafe>) {
  const db = getClientDb();
  const docRef = doc(db, "cafes", id);
  await updateDoc(docRef, data);
}

export async function deleteCafe(id: string) {
  const db = getClientDb();
  const docRef = doc(db, "cafes", id);
  await deleteDoc(docRef);
}

export async function getAllCafes(): Promise<Cafe[]> {
  const db = getClientDb();
  const q = query(collection(db, "cafes"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
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
      } as Cafe;
    });
  }

export async function getCafeBySlug(slug: string): Promise<Cafe | null> {
  const db = getClientDb();
  const q = query(collection(db, "cafes"), where("slug", "==", slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
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
  } as Cafe;
}


