import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { SignInCard } from "@/features/auth/components/sign-in-card";

export default async function SignInPage() {
  const jwtPayload = await getCurrent();

  if (jwtPayload) {
    redirect("/");
  }

  return <SignInCard />;
}
