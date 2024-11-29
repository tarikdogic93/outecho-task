"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { Dot, Eye, EyeOff, Heart, Loader2, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCurrent } from "@/features/auth/hooks/use-current";
import { useTopic } from "@/features/topics/hooks/use-topic";
import { useDeleteTopic } from "@/features/topics/hooks/use-delete-topic";
import { useLikeTopic } from "@/features/topics/hooks/use-like-topic";
import { UpdateTopicDialog } from "@/features/topics/components/update-topic-dialog";
import { AddCommentDialog } from "@/features/comments/components/add-comment-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DetailedTopicCardProps {
  topicId: string;
  showComments: boolean;
  onShowComments: () => void;
}

export function DetailedTopicCard({
  topicId,
  showComments,
  onShowComments,
}: DetailedTopicCardProps) {
  const { data: loggedInUser, isLoading: isLoggedInUserLoading } = useCurrent();
  const { data: topic, isLoading: isTopicLoading } = useTopic(topicId);
  const { mutate: deleteTopic, isPending } = useDeleteTopic(topicId);
  const { mutate: likeTopic } = useLikeTopic(topicId);

  if (isLoggedInUserLoading || isTopicLoading) {
    return <Loader2 className="size-10 shrink-0 animate-spin text-primary" />;
  }

  if (!topic) {
    return null;
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
  const { id: userId, firstName, lastName, email } = user;

  const createdAtDate = new Date(createdAt);
  const updatedAtDate = new Date(updatedAt);

  const dateToUse =
    updatedAtDate > createdAtDate ? updatedAtDate : createdAtDate;
  const timeLabel = updatedAtDate > createdAtDate ? "Updated" : "Created";

  return (
    <Card className="h-full w-full max-w-3xl self-start">
      <CardContent className="p-6">
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <h3 className="truncate text-xl font-semibold">{title}</h3>
            <p className="break-words text-sm text-muted-foreground">
              {description ? description : `No description available`}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <p className="text-glow truncate text-sm font-bold tracking-wide">
              {firstName && lastName ? `${firstName} ${lastName}` : email}
            </p>
            <Dot className="hidden shrink-0 sm:block" />
            <p className="whitespace-nowrap text-sm">
              {timeLabel} {formatDistanceToNowStrict(dateToUse)} ago
            </p>
            <Dot className="hidden shrink-0 sm:block" />
            <p className="whitespace-nowrap text-sm">
              {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
            </p>
            <Dot className="hidden shrink-0 sm:block" />
            <p className="whitespace-nowrap text-sm">
              {likesCount} {likesCount === 1 ? "like" : "likes"}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={onShowComments}
              >
                {showComments ? (
                  <>
                    <EyeOff className="size-4 shrink-0" />
                    <span className="hidden sm:block">Hide comments</span>
                  </>
                ) : (
                  <>
                    <Eye className="size-4 shrink-0" />
                    <span className="hidden sm:block">Show comments</span>
                  </>
                )}
              </Button>
              <AddCommentDialog
                topicId={topicId}
                disabled={isPending}
                onCreateComment={!showComments ? onShowComments : undefined}
              />
              {loggedInUser && loggedInUser.id === userId && (
                <>
                  <UpdateTopicDialog
                    topic={{ id: topicId, title, description }}
                    disabled={isPending}
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isPending}
                    onClick={() => deleteTopic()}
                  >
                    <Trash2 className="size-4 shrink-0" />
                    <span className="hidden sm:block">
                      {isPending ? "Deleting..." : "Delete"}
                    </span>
                  </Button>
                </>
              )}
            </div>
            <Heart
              className={cn("shrink-0 cursor-pointer text-primary", {
                "fill-primary": like,
              })}
              onClick={() => likeTopic()}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
