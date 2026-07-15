import { getClientDb } from "./client-firebase";
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

export interface WeddingCard {
  id?: string;
  coupleName1: string;
  coupleName2: string;
  slug: string;
  image?: string;
  happyMoment?: string;
  story?: string;
  storyImage?: string;
  date: string;
  time: string;
  venue: string;
  venueMapsLink?: string;
  dressCode?: string;
  dressCodeHer?: string;
  dressCodeHim?: string;
  theme?: string;
  active: boolean;
  source?: "admin" | "order";
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  createdAt?: number;
}

export async function addWedding(data: Omit<WeddingCard, "id" | "createdAt">) {
  const db = getClientDb();
  const docRef = await addDoc(collection(db, "weddings"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateWedding(id: string, data: Partial<WeddingCard>) {
  const db = getClientDb();
  const docRef = doc(db, "weddings", id);
  await updateDoc(docRef, data);
}

export async function deleteWedding(id: string) {
  const db = getClientDb();
  const docRef = doc(db, "weddings", id);
  await deleteDoc(docRef);
}

export async function getAllWeddings(): Promise<WeddingCard[]> {
  const db = getClientDb();
  const q = query(collection(db, "weddings"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      coupleName1: data.coupleName1,
      coupleName2: data.coupleName2,
      slug: data.slug,
      image: data.image,
      happyMoment: data.happyMoment,
      story: data.story,
      storyImage: data.storyImage,
      date: data.date,
      time: data.time,
      venue: data.venue,
      venueMapsLink: data.venueMapsLink,
      dressCode: data.dressCode,
      dressCodeHer: data.dressCodeHer,
      dressCodeHim: data.dressCodeHim,
      active: data.active ?? true,
      theme: data.theme || "champagne-rose",
      createdAt: data.createdAt?.toMillis() || Date.now(),
    } as WeddingCard;
  });
}

export async function getWeddingBySlug(slug: string): Promise<WeddingCard | null> {
  const db = getClientDb();
  const q = query(collection(db, "weddings"), where("slug", "==", slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  const data = d.data();
  return {
    id: d.id,
    coupleName1: data.coupleName1,
    coupleName2: data.coupleName2,
    slug: data.slug,
    image: data.image,
    happyMoment: data.happyMoment,
    story: data.story,
    storyImage: data.storyImage,
    date: data.date,
    time: data.time,
    venue: data.venue,
    venueMapsLink: data.venueMapsLink,
    dressCode: data.dressCode,
    dressCodeHer: data.dressCodeHer,
    dressCodeHim: data.dressCodeHim,
    active: data.active ?? true,
    theme: data.theme || "champagne-rose",
    createdAt: data.createdAt?.toMillis() || Date.now(),
  } as WeddingCard;
}
