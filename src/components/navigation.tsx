"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ActiveButton } from "@/components/active-button";
import { UserButton } from "@/features/auth/components/user-button";
import { useCurrent } from "@/features/auth/hooks/use-current";
import { CreateTopicDialog } from "@/features/topics/components/create-topic-dialog";

export function Navigation() {
  const pathname = usePathname();
  const { data: loggedInUser, isLoading } = useCurrent();

  const isHomePage = pathname === "/";
  const isSignInPage = pathname === "/sign-in";
  const isTopicsPage = pathname === "/topics";

  if (isLoading) {
    return null;
  }

  const buttons = loggedInUser ? (
    <>
      {isHomePage ? (
        <ActiveButton variant="outline" asChild>
          <Link href="/">Home</Link>
        </ActiveButton>
      ) : (
        <Button variant="outline" asChild>
          <Link href="/">Home</Link>
        </Button>
      )}
      {isTopicsPage ? (
        <CreateTopicDialog />
      ) : (
        <Button variant="outline" asChild>
          <Link href="/topics">My topics</Link>
        </Button>
      )}
      <UserButton user={loggedInUser} />
    </>
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
}
