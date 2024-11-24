"use client";

import { useRouter } from "next/navigation";
import { LogOut, UserPen } from "lucide-react";

import { useSignOut } from "@/features/auth/hooks/use-sign-out";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserButtonProps {
  user: { firstName?: string; lastName?: string; email: string };
}

export const UserButton = ({ user }: UserButtonProps) => {
  const router = useRouter();
  const { mutate: signOut } = useSignOut();

  const { firstName, lastName, email } = user;

  const avatarFallback =
    firstName && lastName
      ? (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
      : email.charAt(0).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="relative outline-none">
        <Avatar className="size-10">
          <AvatarFallback className="flex items-center justify-center bg-primary/20 font-medium">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        side="bottom"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-[52px]">
            <AvatarFallback className="flex items-center justify-center bg-primary/20 text-xl font-medium">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            {firstName && lastName && (
              <p className="text-sm font-medium">
                {`${firstName} ${lastName}`}
              </p>
            )}
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
        <Separator className="mb-1" />
        <DropdownMenuItem
          className="flex h-10 cursor-pointer items-center justify-center font-medium"
          onClick={() => router.push("/profile")}
        >
          <UserPen className="mr-2 size-4" />
          Profile settings
        </DropdownMenuItem>
        <Separator className="mb-1" />
        <DropdownMenuItem
          className="flex h-10 cursor-pointer items-center justify-center font-medium"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
