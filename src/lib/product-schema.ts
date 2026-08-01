import { getClientDb } from "./client-firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export interface Product {
  id?: string;
  name: string;
  price: number;
  salePrice?: number | null;
  category: string;
  description: string;
  images: string[];
  type: "nfc" | "regular";
  createdAt?: number;
}

export async function addProduct(data: Omit<Product, "id" | "createdAt">) {
  const db = getClientDb();
  const docRef = await addDoc(collection(db, "products"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const db = getClientDb();
  const docRef = doc(db, "products", id);
  await updateDoc(docRef, data);
}

export async function deleteProduct(id: string) {
  const db = getClientDb();
  const docRef = doc(db, "products", id);
  await deleteDoc(docRef);
}

export async function getAllProducts(): Promise<Product[]> {
  const db = getClientDb();
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      price: data.price,
      salePrice: data.salePrice ?? null,
      category: data.category,
      description: data.description,
      images: data.images || [],
      type: data.type === "regular" ? "regular" : "nfc",
      createdAt: data.createdAt?.toMillis() || Date.now(),
    } as Product;
  });
}

export async function getProducts(limitCount?: number): Promise<Product[]> {
  const db = getClientDb();
  let q;
  if (limitCount) {
    const { query: qry, limit } = await import("firebase/firestore");
    q = qry(collection(db, "products"), orderBy("createdAt", "desc"), limit(limitCount));
  } else {
    q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      price: data.price,
      salePrice: data.salePrice ?? null,
      category: data.category,
      description: data.description,
      images: data.images || [],
      type: data.type === "regular" ? "regular" : "nfc",
      createdAt: data.createdAt?.toMillis() || Date.now(),
    } as Product;
  });
}
