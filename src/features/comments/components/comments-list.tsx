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
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isLoading } =
    useComments(topicId, 20);

  if (isLoading) {
    return <Loader2 className="size-8 shrink-0 animate-spin text-primary" />;
  }

  if (!data || !data.pages[0]) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-center justify-start gap-y-2 self-start">
      {data.pages[0].data.length > 0 ? (
        <>
          {data.pages.map((page) =>
            page?.data.map((comment) => (
              <CommentCard
                key={comment.id}
                loggedInUserId={loggedInUser?.id}
                topicId={topicId}
                comment={comment}
              />
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
        <p className="font-medium">No comments found</p>
      )}
    </div>
  );
}
