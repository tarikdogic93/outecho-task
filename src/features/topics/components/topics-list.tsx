"use client";

import { Loader2 } from "lucide-react";

import { useTopics } from "@/features/topics/hooks/use-topics";
import { TopicCard } from "@/features/topics/components/topic-card";
import { Button } from "@/components/ui/button";

export function TopicsList() {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isLoading } =
    useTopics(20);

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
    <div className="flex w-full flex-1 flex-col items-center gap-y-2">
      {data.pages[0].data.length > 0 ? (
        <>
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
        </>
      ) : (
        <p className="font-medium">No topics found</p>
      )}
    </div>
  );
}
