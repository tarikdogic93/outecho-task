"use client";

import { Loader2 } from "lucide-react";

import { useTopics } from "@/features/topics/hooks/use-topics";
import { TopicCard } from "@/features/topics/components/topic-card";
import { Button } from "@/components/ui/button";

export function TopicsList() {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isRefetching } =
    useTopics(20);

  if (!data || isRefetching) {
    return <Loader2 className="size-10 animate-spin text-primary" />;
  }

  const topics = data.pages
    .filter((page) => page?.data)
    .flatMap((page) => page?.data || []);

  if (topics.length === 0) {
    return <p className="font-medium">No topics found</p>;
  }

  return (
    <div className="flex w-full flex-col items-center justify-start gap-y-2 self-start">
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} />
      ))}
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
  );
}
