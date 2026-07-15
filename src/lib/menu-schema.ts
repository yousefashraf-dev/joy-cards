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
import type { MenuItem, MenuCategory } from "./cafe-schema";
import { normalizeCategories } from "./cafe-schema";

export interface MenuDocument {
  id?: string;
  name: string;
  slug: string;
  logo?: string;
  categories: MenuCategory[];
  items: MenuItem[];
  theme: CafeTheme;
  createdAt?: number;
}

export async function uploadMenuLogo(
  file: File,
  path: string
): Promise<string> {
  const storage = getClientStorage();
  const storageRef = ref(storage, `menus/${path}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function addMenu(data: Omit<MenuDocument, "id" | "createdAt">) {
  const db = getClientDb();
  const docRef = await addDoc(collection(db, "menus"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateMenu(id: string, data: Partial<MenuDocument>) {
  const db = getClientDb();
  const docRef = doc(db, "menus", id);
  await updateDoc(docRef, data);
}

export async function deleteMenu(id: string) {
  const db = getClientDb();
  const docRef = doc(db, "menus", id);
  await deleteDoc(docRef);
}

export async function getAllMenus(): Promise<MenuDocument[]> {
  const db = getClientDb();
  const q = query(collection(db, "menus"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      slug: data.slug,
      logo: data.logo,
      categories: normalizeCategories(data.categories),
      items: (data.items || []).map((i: Record<string, unknown>) => ({
        name: i.name as string,
        price: i.price as string,
        category: i.category as string,
        size: i.size as string | undefined,
        description: i.description as string | undefined,
      })),
      theme: data.theme || "cafe",
      createdAt: data.createdAt?.toMillis() || Date.now(),
    } as MenuDocument;
  });
}

export async function getMenuBySlug(slug: string): Promise<MenuDocument | null> {
  const db = getClientDb();
  const q = query(collection(db, "menus"), where("slug", "==", slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  const data = d.data();
  return {
    id: d.id,
    name: data.name,
    slug: data.slug,
    logo: data.logo,
    categories: normalizeCategories(data.categories),
    items: (data.items || []).map((i: Record<string, unknown>) => ({
      name: i.name as string,
      price: i.price as string,
      category: i.category as string,
      size: i.size as string | undefined,
      description: i.description as string | undefined,
    })),
    theme: data.theme || "cafe",
    createdAt: data.createdAt?.toMillis() || Date.now(),
  } as MenuDocument;
}
