"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserButton } from "@/features/auth/components/user-button";
import { useCurrent } from "@/features/auth/hooks/use-current";
import { CreateTopicDialog } from "@/features/topics/components/create-topic-dialog";
import { NotificationButton } from "@/features/notifications/components/notification-button";

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
      <Button variant="outline" asChild>
        <Link href="/">
          <House className="size-4 shrink-0" />
          <span className="hidden md:block">Home</span>
        </Link>
      </Button>
      {isTopicsPage ? (
        <CreateTopicDialog />
      ) : (
        <Button variant="outline" asChild>
          <Link href="/topics">
            <List className="size-4 shrink-0" />
            <span className="hidden md:block">My topics</span>
          </Link>
        </Button>
      )}
      <NotificationButton />
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
