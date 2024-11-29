"use client";

import { useCurrent } from "@/features/auth/hooks/use-current";
import { TopicsList } from "@/features/topics/components/topics-list";
import { HomeContentSelector } from "@/components/selectors/home-content-selector";
import { useState } from "react";

export function HomeContent() {
  const [selectedContent, setSelectedContent] = useState("latestTopics");
  const { data: loggedInUser, isLoading } = useCurrent();

  if (isLoading) {
    return null;
  }

  return (
    <>
      {loggedInUser ? (
        <div className="flex w-full flex-1 flex-col items-center gap-y-10">
          <h1 className="text-3xl font-semibold">Explore topics</h1>
          <HomeContentSelector
            value={selectedContent}
            onValueChange={setSelectedContent}
          />
          <TopicsList sortBy={selectedContent} />
        </div>
      ) : (
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-y-4">
          <h1 className="text-3xl font-semibold">Hi there! &#128075;</h1>
          <p className="text-lg">
            Log in to explore topics or sign up to join the community.
          </p>
        </div>
      )}
    </>
  );
}
