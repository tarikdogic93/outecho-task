"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { UserButton } from "@/features/auth/components/user-button";
import { useCurrent } from "@/features/auth/hooks/use-current";

export const Navigation = () => {
  const pathname = usePathname();
  const { data: user, isLoading } = useCurrent();

  const isHomePage = pathname === "/";
  const isSignInPage = pathname === "/sign-in";

  if (isLoading) {
    return null;
  }

  const buttons = user ? (
    <UserButton user={user} />
  ) : isHomePage ? (
    <>
      <Button variant="outline" asChild>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </>
  ) : isSignInPage ? (
    <Button variant="outline" asChild>
      <Link href="/sign-up">Sign up</Link>
    </Button>
  ) : (
    <Button variant="outline" asChild>
      <Link href="/sign-in">Sign in</Link>
    </Button>
  );

  return <nav className="flex items-center gap-x-2">{buttons}</nav>;
};
