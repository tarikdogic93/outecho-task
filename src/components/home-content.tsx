"use client";

import { useCurrent } from "@/features/auth/hooks/use-current";
import { TopicsList } from "@/features/topics/components/topics-list";

export function HomeContent() {
  const { data: loggedInUser } = useCurrent();

  return (
    <>
      {loggedInUser ? (
        <TopicsList />
      ) : (
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-y-4">
          <h1 className="text-3xl">Hi there! &#128075;</h1>
          <p className="text-lg">
            Log in to explore topics or sign up to join the community.
          </p>
        </div>
      )}
    </>
  );
}
