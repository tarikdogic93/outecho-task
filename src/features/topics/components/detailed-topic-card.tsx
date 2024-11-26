"use client";

import { useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { Dot, Heart, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTopic } from "@/features/topics/hooks/use-topic";
import { useDeleteTopic } from "@/features/topics/hooks/use-delete-topic";
import { useLikeTopic } from "@/features/topics/hooks/use-like-topic";
import { UpdateTopicDialog } from "@/features/topics/components/update-topic-dialog";
import { AddCommentDialog } from "@/features/comments/components/add-comment-dialog";
import { CommentsList } from "@/features/comments/components/comments-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DetailedTopicCardProps {
  topicId: string;
}

export function DetailedTopicCard({ topicId }: DetailedTopicCardProps) {
  const [showComments, setShowComments] = useState(false);
  const { data: topic, isLoading } = useTopic(topicId);
  const { mutate: deleteTopic, isPending } = useDeleteTopic(topicId);
  const { mutate: likeTopic } = useLikeTopic(topicId);

  if (isLoading) {
    return <Loader2 className="size-10 animate-spin text-primary" />;
  }

  if (!topic) {
    return <p className="font-medium">Topic not found</p>;
  }

  const {
    title,
    description,
    createdAt,
    updatedAt,
    user,
    commentsCount,
    likesCount,
    like,
  } = topic;
  const { firstName, lastName, email } = user;

  const createdAtDate = new Date(createdAt);
  const updatedAtDate = new Date(updatedAt);

  const dateToUse =
    updatedAtDate > createdAtDate ? updatedAtDate : createdAtDate;
  const timeLabel = updatedAtDate > createdAtDate ? "Updated" : "Created";

  return (
    <div className="flex h-full w-full max-w-3xl flex-col items-center gap-y-4 self-start">
      <Card className="h-full w-full">
        <CardContent className="p-6">
          <div className="flex flex-col gap-y-2">
            <h3 className="truncate text-xl font-semibold">{title}</h3>
            <p className="break-words text-sm text-muted-foreground">
              {description ? description : `No description available`}
            </p>
            <div className="flex items-center">
              <p className="text-glow text-sm font-bold tracking-wide">
                {firstName && lastName ? `${firstName} ${lastName}` : email}
              </p>
              <Dot />
              <p className="text-sm">
                {timeLabel} {formatDistanceToNowStrict(dateToUse)} ago
              </p>
              <Dot />
              <p className="text-sm">
                {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
              </p>
              <Dot />
              <p className="text-sm">
                {likesCount} {likesCount === 1 ? "like" : "likes"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => setShowComments(!showComments)}
                >
                  {showComments ? "Hide comments" : "Show comments"}
                </Button>
                <AddCommentDialog topicId={topicId} disabled={isPending} />
                <UpdateTopicDialog topicId={topicId} disabled={isPending} />
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isPending}
                  onClick={() => deleteTopic()}
                >
                  {isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
              <Heart
                className={cn("cursor-pointer text-primary", {
                  "fill-primary": like,
                })}
                onClick={() => likeTopic()}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      {showComments && <CommentsList topicId={topicId} />}
    </div>
  );
}
