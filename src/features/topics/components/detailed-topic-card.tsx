"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { Dot, Heart, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTopic } from "@/features/topics/hooks/use-topic";
import { useTopicDelete } from "@/features/topics/hooks/use-topic-delete";
import { useTopicLike } from "@/features/topics/hooks/use-topic-like";
import { UpdateTopicDialog } from "@/features/topics/components/update-topic-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DetailedTopicCardProps {
  topicId: string;
}

export function DetailedTopicCard({ topicId }: DetailedTopicCardProps) {
  const router = useRouter();
  const { data: topic, isLoading } = useTopic(topicId);
  const { mutate: deleteTopic, isPending } = useTopicDelete(topicId);
  const { mutate: likeTopic } = useTopicLike(topicId);

  if (isLoading) {
    return <Loader2 className="size-10 animate-spin text-primary" />;
  }

  if (!topic) {
    return <p className="font-medium">Topic not found</p>;
  }

  const {
    id,
    title,
    description,
    createdAt,
    updatedAt,
    user,
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
    <Card
      className="h-full w-full max-w-3xl self-start"
      onClick={() => router.push(`/topics/${id}`)}
    >
      <CardContent className="p-6">
        <div className="flex flex-col gap-y-2">
          <h3 className="truncate text-xl font-semibold">{title}</h3>
          <p className="break-words text-sm">
            {description ? description : `No description available`}
          </p>
          <div className="flex items-center">
            <p className="text-sm text-primary">
              {firstName && lastName ? `${firstName} ${lastName}` : email}
            </p>
            <Dot />
            <p className="text-sm text-muted-foreground">
              {timeLabel} {formatDistanceToNowStrict(dateToUse)} ago
            </p>
            <Dot />
            <p className="text-sm text-muted-foreground">100000 comments</p>
            <Dot />
            <p className="text-sm text-muted-foreground">
              {likesCount} {likesCount === 1 ? "like" : "likes"}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
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
  );
}
