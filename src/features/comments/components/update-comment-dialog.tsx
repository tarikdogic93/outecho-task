"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { commentSchema } from "@/features/comments/schemas";
import { useUpdateComment } from "@/features/comments/hooks/use-update-comment";
import { Button } from "@/components/ui/button";
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

type defaultValuesType = z.infer<typeof commentSchema>;

const defaultValues: defaultValuesType = {
  content: "",
};

interface UpdateCommentDialogProps {
  topicId: string;
  comment: {
    id: string;
    content: string;
  };
  disabled?: boolean;
}

export function UpdateCommentDialog({
  topicId,
  comment,
  disabled,
}: UpdateCommentDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate, isPending } = useUpdateComment(topicId, comment.id);

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset({
      content: comment.content,
    });
  }, [comment, form]);

  function onSubmit(values: z.infer<typeof commentSchema>) {
    mutate(
      { json: { ...values }, param: { commentId: comment.id } },
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
          <DialogTitle>Modify your Comment</DialogTitle>
          <DialogDescription>
            Revise your comment to reflect your thoughts
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="max-h-56 min-h-56"
                      placeholder="Enter content"
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
