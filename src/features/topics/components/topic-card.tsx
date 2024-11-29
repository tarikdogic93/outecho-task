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
      id: string;
      firstName: string | null;
      lastName: string | null;
      email: string;
      image: string | null;
    };
    commentsCount: number;
    likesCount: number;
  };
}

export function TopicCard({ topic }: TopicCardProps) {
  const router = useRouter();

  const { id, title, createdAt, updatedAt, user, commentsCount, likesCount } =
    topic;
  const { firstName, lastName, email } = user;

  const createdAtDate = new Date(createdAt);
  const updatedAtDate = new Date(updatedAt);

  const dateToUse =
    updatedAtDate > createdAtDate ? updatedAtDate : createdAtDate;
  const timeLabel = updatedAtDate > createdAtDate ? "Updated" : "Created";

  return (
    <Card
      className="h-full w-full max-w-3xl cursor-pointer hover:border-primary/30 hover:bg-primary/10"
      onClick={() => router.push(`/topics/${id}`)}
    >
      <CardContent className="p-6">
        <div className="flex flex-col">
          <h3 className="truncate text-xl font-semibold">{title}</h3>
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
        </div>
      </CardContent>
    </Card>
  );
}
