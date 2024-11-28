"use client";

import { Loader2 } from "lucide-react";

import { useCurrent } from "@/features/auth/hooks/use-current";
import { useComments } from "@/features/comments/hooks/use-comments";
import { CommentCard } from "@/features/comments/components/comment-card";
import { Button } from "@/components/ui/button";

interface CommentsListProps {
  topicId: string;
}

export function CommentsList({ topicId }: CommentsListProps) {
  const { data: loggedInUser } = useCurrent();
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isRefetching } =
    useComments(topicId, 20);

  if (isRefetching || !data) {
    return <Loader2 className="size-8 animate-spin text-primary" />;
  }

  const comments = data.pages
    .filter((page) => page?.data)
    .flatMap((page) => page?.data || []);

  if (comments.length === 0) {
    return <p className="font-medium">No comments found</p>;
  }

  return (
    <div className="flex w-full flex-col items-center justify-start gap-y-2 self-start">
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          loggedInUserId={loggedInUser?.id}
          topicId={topicId}
          comment={comment}
        />
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
