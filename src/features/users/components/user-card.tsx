import { formatDistanceToNowStrict } from "date-fns";
import { Dot } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface UserCardProps {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    commentsCount: number;
  };
}

export function UserCard({ user }: UserCardProps) {
  const { firstName, lastName, email, image, createdAt, commentsCount } = user;

  const createdAtDate = new Date(createdAt);

  const avatarFallback =
    firstName && lastName
      ? (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
      : email.charAt(0).toUpperCase();

  return (
    <Card className="h-full w-full max-w-3xl">
      <CardContent className="p-6">
        <div className="flex gap-x-4">
          <Avatar className="size-10 border-2 border-primary">
            <AvatarImage src={image ? image : undefined} />
            <AvatarFallback className="flex items-center justify-center bg-primary/20 font-medium">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
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
        </div>
      </CardContent>
    </Card>
  );
}
