"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { commentSchema } from "@/features/comments/schemas";
import { useAddComment } from "@/features/comments/hooks/use-add-comment";
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

interface AddCommentDialogProps {
  topicId: string;
  disabled?: boolean;
  onCreateComment?: () => void;
}

export function AddCommentDialog({
  topicId,
  disabled,
  onCreateComment,
}: AddCommentDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate, isPending } = useAddComment(topicId);

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof commentSchema>) {
    mutate(
      { param: { topicId }, json: values },
      {
        onSuccess: () => {
          form.reset();

          setIsDialogOpen(false);

          if (onCreateComment) {
            onCreateComment();
          }
        },
      },
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          disabled={disabled}
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="size-4 shrink-0" />
          <span className="hidden sm:block">Add comment</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="md:w-[500px]">
        <DialogHeader>
          <DialogTitle>Share your thoughts</DialogTitle>
          <DialogDescription>
            Write a comment and let us know your opinion
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
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
