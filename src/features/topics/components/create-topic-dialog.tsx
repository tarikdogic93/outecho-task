"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { topicSchema } from "@/features/topics/schemas";
import { useTopicCreate } from "@/features/topics/hooks/use-topic-create";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type defaultValuesType = z.infer<typeof topicSchema>;

const defaultValues: defaultValuesType = {
  title: "",
  description: "",
};

export function CreateTopicDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate, isPending } = useTopicCreate();

  const form = useForm<z.infer<typeof topicSchema>>({
    resolver: zodResolver(topicSchema),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof topicSchema>) {
    mutate(
      { json: values },
      {
        onSuccess: () => {
          form.reset();

          setIsDialogOpen(false);
        },
      },
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          Create topic
        </Button>
      </DialogTrigger>
      <DialogContent className="md:w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a new topic</DialogTitle>
          <DialogDescription>
            Give your topic a title and a brief description
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="off"
                      placeholder="Enter title"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="max-h-56 min-h-56"
                      placeholder="Enter description"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" size="lg" disabled={isPending}>
              {isPending ? "Creating..." : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
