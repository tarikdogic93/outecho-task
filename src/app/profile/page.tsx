import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { ProfileCard } from "@/features/profile/components/profile-card";

export default async function ProfilePage() {
  const user = await getCurrent();

  if (!user) {
    redirect("/");
  }

  return <ProfileCard />;
}
