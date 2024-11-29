"use client";

import { Loader2 } from "lucide-react";

import { useMyTopics } from "@/features/topics/hooks/use-my-topics";
import { TopicCard } from "@/features/topics/components/topic-card";
import { Button } from "@/components/ui/button";

export function MyTopicsList() {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isLoading } =
    useMyTopics(20);

  if (isLoading) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!data || !data.pages[0]) {
    return null;
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-y-10">
      <h1 className="text-3xl font-semibold">
        Explore <span className="text-primary">your</span> topics
      </h1>
      {data.pages[0].data.length > 0 ? (
        <div className="flex w-full flex-1 flex-col items-center gap-y-2">
          {data.pages.map((page) =>
            page?.data.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            )),
          )}
          <Button
            variant="accent"
            disabled={!hasNextPage || isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
                ? "Load more"
                : "Nothing more"}
          </Button>
        </div>
      ) : (
        <p className="font-medium">No topics found</p>
      )}
    </div>
  );
}
