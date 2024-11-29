"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { Dot, Heart, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useDeleteComment } from "@/features/comments/hooks/use-delete-comment";
import { useLikeComment } from "@/features/comments/hooks/use-like-comment";
import { UpdateCommentDialog } from "@/features/comments/components/update-comment-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CommentCardProps {
  loggedInUserId?: string;
  topicId: string;
  comment: {
    id: string;
    parentCommentId: string | null;
    content: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      email: string;
      image: string | null;
    };
    like: boolean;
    likesCount: number;
  };
}

export function CommentCard({
  loggedInUserId,
  topicId,
  comment,
}: CommentCardProps) {
  const {
    id: commentId,
    content,
    createdAt,
    updatedAt,
    user,
    likesCount,
    like,
  } = comment;
  const { id: userId, firstName, lastName, email } = user;

  const { mutate: deleteComment, isPending } = useDeleteComment(
    topicId,
    commentId,
  );
  const { mutate: likeComment } = useLikeComment(topicId, commentId);

  const createdAtDate = new Date(createdAt);
  const updatedAtDate = new Date(updatedAt);

  const dateToUse =
    updatedAtDate > createdAtDate ? updatedAtDate : createdAtDate;
  const timeLabel = updatedAtDate > createdAtDate ? "Updated" : "Created";

  const isLoggedInUserOwner = loggedInUserId === userId;

  return (
    <Card className="h-full w-full max-w-3xl border-none outline-dashed outline-2 outline-input">
      <CardContent className="p-6">
        <div className="flex flex-col gap-y-4">
          <p className="break-words text-sm text-muted-foreground">{content}</p>
          <div className="flex items-center justify-between">
            <div className="flex w-full flex-col sm:flex-row sm:items-center">
              <p className="text-glow truncate text-sm font-bold tracking-wide">
                {firstName && lastName ? `${firstName} ${lastName}` : email}
              </p>
              <Dot className="hidden shrink-0 sm:block" />
              <p className="whitespace-nowrap text-sm">
                {timeLabel} {formatDistanceToNowStrict(dateToUse)} ago
              </p>
              <Dot className="hidden shrink-0 sm:block" />
              <p className="whitespace-nowrap text-sm">
                {likesCount} {likesCount === 1 ? "like" : "likes"}
              </p>
            </div>
            {!isLoggedInUserOwner && (
              <Heart
                className={cn("shrink-0 cursor-pointer text-primary", {
                  "fill-primary": like,
                })}
                onClick={() => likeComment()}
              />
            )}
          </div>
          {isLoggedInUserOwner && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <UpdateCommentDialog
                  topicId={topicId}
                  comment={{
                    id: commentId,
                    content,
                  }}
                  disabled={isPending}
                />
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isPending}
                  onClick={() => deleteComment({ param: { commentId } })}
                >
                  <Trash2 className="size-4 shrink-0" />
                  <span className="hidden sm:block">
                    {isPending ? "Deleting..." : "Delete"}
                  </span>
                </Button>
              </div>
              <Heart
                className={cn("shrink-0 cursor-pointer text-primary", {
                  "fill-primary": like,
                })}
                onClick={() => likeComment()}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
