import { notFound } from "next/navigation";
import { getProfileById } from "@/lib/firebase";
import ProfileWrapper from "@/components/profiles/ProfileWrapper";
import PendingProfile from "@/components/profiles/PendingProfile";

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

  if (!profile.active) {
    return <PendingProfile />;
  }

  return <ProfileWrapper profile={profile} />;
}
