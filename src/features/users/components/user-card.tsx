import { formatDistanceToNowStrict } from "date-fns";
import { Dot } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface UserCardProps {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    createdAt: string;
    updatedAt: string;
    commentsCount: number;
  };
}

export function UserCard({ user }: UserCardProps) {
  const { firstName, lastName, email, createdAt, commentsCount } = user;

  const createdAtDate = new Date(createdAt);

  return (
    <Card className="h-full w-full max-w-3xl">
      <CardContent className="p-6">
        <div className="flex flex-col">
          <h3 className="truncate text-xl font-semibold">
            {firstName && lastName ? `${firstName} ${lastName}` : email}
          </h3>
          <div className="flex items-center">
            <p className="text-sm">
              Joined {formatDistanceToNowStrict(createdAtDate)} ago
            </p>
            <Dot />
            <p className="text-sm">
              {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
