"use client";

import { ReactNode } from "react";
import { KnockFeedProvider, KnockProvider } from "@knocklabs/react";
import "@knocklabs/react/dist/index.css";

import { useCurrent } from "@/features/auth/hooks/use-current";

interface KnockLabsProviderProps {
  children: ReactNode;
}

export function KnockLabsProvider({ children }: KnockLabsProviderProps) {
  const { data: loggedInUser } = useCurrent();

  if (!loggedInUser) {
    return <>{children}</>;
  }

  return (
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_API_KEY!}
      userId={loggedInUser.id}
    >
      <KnockFeedProvider feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_ID!}>
        {children}
      </KnockFeedProvider>
    </KnockProvider>
  );
}
