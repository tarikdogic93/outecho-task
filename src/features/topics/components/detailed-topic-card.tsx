"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { Dot, Loader2 } from "lucide-react";

import { useTopic } from "@/features/topics/hooks/use-topic";
import { useTopicDelete } from "@/features/topics/hooks/use-topic-delete";
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

  if (isLoading) {
    return <Loader2 className="size-10 animate-spin text-primary" />;
  }

  if (!topic) {
    return <p className="font-medium">Topic not found</p>;
  }

  const { id, title, description, createdAt, updatedAt, user } = topic;
  const { firstName, lastName, email } = user;

  const createdAtDate = new Date(createdAt);
  const updatedAtDate = new Date(updatedAt);

  const dateToUse =
    updatedAtDate > createdAtDate ? updatedAtDate : createdAtDate;
  const timeLabel = updatedAtDate > createdAtDate ? "Updated" : "Created";

  return (
    <Card
      className="h-full w-full self-start md:w-[600px]"
      onClick={() => router.push(`/topics/${id}`)}
    >
      <CardContent className="p-6">
        <div className="flex flex-col gap-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
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
            <p className="overflow-ellipsis text-sm text-muted-foreground">
              100000 comments
            </p>
          </div>
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
        </div>
      </CardContent>
    </Card>
  );
}
