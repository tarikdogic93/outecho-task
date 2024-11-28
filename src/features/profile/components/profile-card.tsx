"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { profileSchema } from "@/features/profile/schemas";
import { useCurrent } from "@/features/auth/hooks/use-current";
import { useProfileUpdate } from "@/features/profile/hooks/use-profile-update";
import { DeleteAccountAlert } from "@/features/profile/components/delecte-account-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

type defaultValuesType = z.infer<typeof profileSchema>;

const defaultValues: defaultValuesType = {
  firstName: "",
  lastName: "",
  oldPassword: "",
  newPassword: "",
};

export function ProfileCard() {
  const { data: loggedInUser } = useCurrent();
  const { mutate, isPending } = useProfileUpdate();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  useEffect(() => {
    if (loggedInUser) {
      form.reset({
        firstName: loggedInUser.firstName || defaultValues.firstName,
        lastName: loggedInUser.lastName || defaultValues.lastName,
        oldPassword: "",
        newPassword: "",
      });
    }
  }, [loggedInUser, form]);

  function onSubmit(values: z.infer<typeof profileSchema>) {
    mutate({ json: values });
  }

  return (
    <Card className="h-full w-full md:w-[500px]">
      <CardHeader className="flex items-center justify-center p-6 text-center">
        <CardTitle className="text-2xl">Update your profile</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="off"
                      placeholder="Enter your first name"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="off"
                      placeholder="Enter your last name"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="off"
                      placeholder="Enter your old password"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="off"
                      placeholder="Enter your new password"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" size="lg" disabled={isPending}>
              {isPending ? "Updating..." : "Update"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="flex items-center justify-center p-6">
        <DeleteAccountAlert />
      </CardContent>
    </Card>
  );
}
