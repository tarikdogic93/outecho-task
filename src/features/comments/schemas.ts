import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(500, { message: "Content cannot exceed 500 characters" }),
});
