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

export interface Cafe {
  id?: string;
  name: string;
  slug: string;
  logo?: string;
  menuUrl?: string;
  menuImages?: string[];
  menuType?: "pdf" | "images" | "link";
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
  wifiName?: string;
  wifiPassword?: string;
  vodafoneCash?: string;
  instaPay?: string;
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
      wifiName: data.wifiName,
      wifiPassword: data.wifiPassword,
      vodafoneCash: data.vodafoneCash,
      instaPay: data.instaPay,
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
    theme: data.theme || "cafe",
    phone: data.phone,
    whatsapp: data.whatsapp,
    websiteUrl: data.websiteUrl,
    facebook: data.facebook,
    instagram: data.instagram,
    tiktok: data.tiktok,
    snapchatUrl: data.snapchatUrl,
    googleMapsUrl: data.googleMapsUrl,
    googleReviewsUrl: data.googleReviewsUrl,
    wifiName: data.wifiName,
    wifiPassword: data.wifiPassword,
    vodafoneCash: data.vodafoneCash,
    instaPay: data.instaPay,
    createdAt: data.createdAt?.toMillis() || Date.now(),
  } as Cafe;
}


