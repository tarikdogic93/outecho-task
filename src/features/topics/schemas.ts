import { z } from "zod";

export const topicSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z
    .string()
    .trim()
    .max(500, { message: "Description cannot exceed 500 characters" })
    .optional(),
});
