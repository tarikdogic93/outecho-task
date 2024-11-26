"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { Dot } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface TopicCardProps {
  topic: {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    user: {
      firstName: string | null;
      lastName: string | null;
      email: string;
    };
  };
}

export function TopicCard({ topic }: TopicCardProps) {
  const router = useRouter();

  const { id, title, createdAt, updatedAt, user } = topic;
  const { firstName, lastName, email } = user;

  const createdAtDate = new Date(createdAt);
  const updatedAtDate = new Date(updatedAt);

  const dateToUse =
    updatedAtDate > createdAtDate ? updatedAtDate : createdAtDate;
  const timeLabel = updatedAtDate > createdAtDate ? "Updated" : "Created";

  return (
    <Card
      className="h-full w-full cursor-pointer hover:border-primary/40 hover:bg-primary/20 md:w-[600px]"
      onClick={() => router.push(`/topics/${id}`)}
    >
      <CardContent className="p-6">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold">{title}</h3>
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
        </div>
      </CardContent>
    </Card>
  );
}
