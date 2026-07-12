import { notFound } from "next/navigation";
import WeddingPreview from "@/components/wedding/WeddingPreview";
import { getAdminDb } from "@/lib/firebase";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

async function getWedding(slug: string) {
  const db = getAdminDb();
  const snapshot = await db
    .collection("weddings")
    .where("slug", "==", slug)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  const data = doc.data();
  return {
    id: doc.id,
    coupleName1: data.coupleName1,
    coupleName2: data.coupleName2,
    slug: data.slug,
    image: data.image,
    story: data.story,
    date: data.date,
    time: data.time,
    venue: data.venue,
    venueMapsLink: data.venueMapsLink,
    dressCode: data.dressCode,
    dressCodeHer: data.dressCodeHer,
    dressCodeHim: data.dressCodeHim,
    active: data.active ?? true,
    createdAt: data.createdAt?.toMillis() || Date.now(),
  };
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const wedding = await getWedding(slug);
  if (!wedding) return { title: "Wedding Card Not Found" };
  return {
    title: `${wedding.coupleName1} & ${wedding.coupleName2} — Wedding`,
    description: wedding.story || `Join ${wedding.coupleName1} & ${wedding.coupleName2} on their special day!`,
    openGraph: {
      title: `${wedding.coupleName1} & ${wedding.coupleName2}`,
      description: wedding.story || `Wedding invitation`,
      images: wedding.image ? [wedding.image] : [],
    },
  };
}

export default async function WeddingPage({ params }: Props) {
  const { slug } = await params;
  const wedding = await getWedding(slug);
  if (!wedding || !wedding.active) notFound();

  return <WeddingPreview wedding={wedding} />;
}
