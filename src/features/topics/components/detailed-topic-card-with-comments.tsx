"use client";

import { useState } from "react";

import { DetailedTopicCard } from "@/features/topics/components/detailed-topic-card";
import { CommentsList } from "@/features/comments/components/comments-list";

interface DetailedTopicCardWithCommentsProps {
  topicId: string;
}

export function DetailedTopicCardWithComments({
  topicId,
}: DetailedTopicCardWithCommentsProps) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="flex h-full w-full flex-col items-center gap-y-4 self-start">
      <DetailedTopicCard
        topicId={topicId}
        showComments={showComments}
        onShowComments={() => setShowComments(!showComments)}
      />
      {showComments && <CommentsList topicId={topicId} />}
    </div>
  );
}
