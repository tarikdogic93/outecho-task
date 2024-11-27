"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { Dot } from "lucide-react";

import { useDeleteComment } from "@/features/comments/hooks/use-delete-comment";
import { UpdateCommentDialog } from "@/features/comments/components/update-comment-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CommentCardProps {
  topicId: string;
  comment: {
    id: string;
    parentCommentId: string | null;
    content: string;
    createdAt: string;
    updatedAt: string;
    user: {
      firstName: string | null;
      lastName: string | null;
      email: string;
    };
  };
}

export function CommentCard({ topicId, comment }: CommentCardProps) {
  const { id, content, createdAt, updatedAt, user } = comment;
  const { firstName, lastName, email } = user;

  const { mutate: deleteComment, isPending } = useDeleteComment(topicId, id);

  const createdAtDate = new Date(createdAt);
  const updatedAtDate = new Date(updatedAt);

  const dateToUse =
    updatedAtDate > createdAtDate ? updatedAtDate : createdAtDate;
  const timeLabel = updatedAtDate > createdAtDate ? "Updated" : "Created";

  return (
    <Card className="h-full w-full max-w-3xl border-none outline-dashed outline-2 outline-input">
      <CardContent className="p-6">
        <div className="flex flex-col gap-y-2">
          <p className="break-words text-sm text-muted-foreground">{content}</p>
          <div className="flex items-center">
            <p className="text-glow text-sm font-bold tracking-wide">
              {firstName && lastName ? `${firstName} ${lastName}` : email}
            </p>
            <Dot />
            <p className="text-sm">
              {timeLabel} {formatDistanceToNowStrict(dateToUse)} ago
            </p>
            <Dot />
            <p className="text-sm">100000 replies</p>
            <Dot />
            <p className="text-sm">100000 likes</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <UpdateCommentDialog
                topicId={topicId}
                comment={{
                  id,
                  content,
                }}
                disabled={isPending}
              />
              <Button
                size="sm"
                variant="destructive"
                disabled={isPending}
                onClick={() =>
                  deleteComment({ json: { topicId }, param: { commentId: id } })
                }
              >
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
