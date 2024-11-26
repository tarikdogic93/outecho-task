"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { topicSchema } from "@/features/topics/schemas";
import { useTopic } from "@/features/topics/hooks/use-topic";
import { useTopicUpdate } from "@/features/topics/hooks/use-topic-update";
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

interface UpdateTopicDialogProps {
  topicId: string;
  disabled?: boolean;
}

export function UpdateTopicDialog({
  topicId,
  disabled,
}: UpdateTopicDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: topic } = useTopic(topicId);
  const { mutate, isPending } = useTopicUpdate(topicId);

  const form = useForm<z.infer<typeof topicSchema>>({
    resolver: zodResolver(topicSchema),
    defaultValues,
  });

  useEffect(() => {
    if (topic) {
      form.reset({
        title: topic.title || defaultValues.title,
        description: topic.description || defaultValues.description,
      });
    }
  }, [topic, form]);

  function onSubmit(values: z.infer<typeof topicSchema>) {
    mutate(
      { json: values, param: { topicId } },
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
        <Button
          size="sm"
          disabled={disabled}
          onClick={() => setIsDialogOpen(true)}
        >
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="md:w-[500px]">
        <DialogHeader>
          <DialogTitle>Update this topic</DialogTitle>
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
              {isPending ? "Updating..." : "Update"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
