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
        <div className="flex flex-col items-center gap-y-4 sm:flex-row sm:items-start sm:gap-x-4">
          <Avatar className="size-16 border-2 border-primary sm:size-12">
            <AvatarImage src={image ? image : undefined} />
            <AvatarFallback className="flex items-center justify-center bg-primary/20 font-medium">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex w-full flex-col items-center sm:items-start">
            <h3 className="max-w-[90%] truncate text-center text-xl font-semibold">
              {firstName && lastName ? `${firstName} ${lastName}` : email}
            </h3>
            <div className="flex flex-col items-center sm:flex-row">
              <p className="text-sm">
                Joined {formatDistanceToNowStrict(createdAtDate)} ago
              </p>
              <Dot className="hidden shrink-0 sm:block" />
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
