import { notFound } from "next/navigation";
import WeddingPreview from "@/components/wedding/WeddingPreview";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export const dynamic = "force-dynamic";

async function getWedding(slug: string) {
  try {
    const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${origin}/api/weddings?slug=${slug}`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
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
