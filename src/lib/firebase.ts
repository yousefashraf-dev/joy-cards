import { initializeApp as initAdminApp, getApps as getAdminApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore as getClientFirestore } from "firebase/firestore";
import type { Profile } from "./types";

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || "")
    .replace(/^"|"$/g, "")
    .replace(/\\n/g, "\n"),
};

function getAdminApp() {
  if (getAdminApps().length === 0) {
    return initAdminApp({
      credential: cert(firebaseAdminConfig),
    });
  }
  return getAdminApps()[0];
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}

const clientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function getClientApp() {
  if (getApps().length === 0) {
    return initializeApp(clientConfig);
  }
  return getApps()[0];
}

export function getClientDb() {
  return getClientFirestore(getClientApp());
}

export async function getProfileById(id: string): Promise<Profile | null> {
  try {
    const db = getAdminDb();
    const doc = await db.collection("profiles").doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data();
    if (!data) return null;
    return {
      id: doc.id,
      name: data.name,
      logo: data.logo,
      theme: data.theme,
      active: data.active,
      productType: data.productType,
      links: data.links || {},
      digitalCardsFields: data.digitalCardsFields,
      autoTapFields: data.autoTapFields,
      businessTapFields: data.businessTapFields,
      createdAt: data.createdAt?.toMillis() || Date.now(),
    };
  } catch (error) {
    console.error("Firebase fetch error:", error);
    return null;
  }
}
