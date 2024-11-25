import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { SignUpCard } from "@/features/auth/components/sign-up-card";

export default async function SignUpPage() {
  const jwtPayload = await getCurrent();

  console.log("SIGNUP PAYLOAD: ", jwtPayload);

  if (jwtPayload) {
    redirect("/");
  }

  return <SignUpCard />;
}
