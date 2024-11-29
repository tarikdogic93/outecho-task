"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { signInSchema } from "@/features/auth/schemas";
import { useSignIn } from "@/features/auth/hooks/use-sign-in";
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

type defaultValuesType = z.infer<typeof signInSchema>;

const defaultValues: defaultValuesType = {
  email: "",
  password: "",
};

export function SignInCard() {
  const { mutate, isPending } = useSignIn();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof signInSchema>) {
    mutate({ json: values });
  }

  return (
    <Card className="h-full w-full md:w-[500px]">
      <CardHeader className="flex items-center justify-center p-6 text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="off"
                      placeholder="Enter your email address"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="off"
                      placeholder="Enter your password"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" size="lg" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="flex items-center justify-center p-6">
        <p className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up">
            <span className="underline underline-offset-2">Sign Up</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
