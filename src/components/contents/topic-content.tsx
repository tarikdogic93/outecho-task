"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { DetailedTopicCard } from "@/features/topics/components/detailed-topic-card";
import { CommentsList } from "@/features/comments/components/comments-list";

interface TopicContent {
  topicId: string;
}

export function TopicContent({ topicId }: TopicContent) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-y-4">
      <div
        className={cn("flex w-full items-center justify-center", {
          "flex-1": !showComments,
        })}
      >
        <DetailedTopicCard
          topicId={topicId}
          showComments={showComments}
          onShowComments={() => setShowComments(!showComments)}
        />
      </div>
      {showComments && <CommentsList topicId={topicId} />}
    </div>
  );
}
