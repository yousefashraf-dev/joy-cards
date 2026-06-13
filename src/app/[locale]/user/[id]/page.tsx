import { notFound } from "next/navigation";
import { getProfileById } from "@/lib/firebase";
import ProfileWrapper from "@/components/profiles/ProfileWrapper";

export const dynamic = "force-dynamic";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfileById(id);

  if (!profile) {
    notFound();
  }

  return <ProfileWrapper profile={profile} />;
}
