import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { ProfileCard } from "@/features/profile/components/profile-card";

export default async function ProfilePage() {
  const jwtPayload = await getCurrent();

  console.log("PROFILE PAYLOAD: ", jwtPayload);

  if (jwtPayload === null) {
    redirect("/");
  }

  return <ProfileCard />;
}
