import { z } from "zod";

export const profileSchema = z
  .object({
    firstName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
  })
  .superRefine(({ oldPassword, newPassword }, ctx) => {
    if (oldPassword && !newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Please provide the new password",
        path: ["newPassword"],
      });
    }

    if (!oldPassword && newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Please provide the old password",
        path: ["oldPassword"],
      });
    }

    if (oldPassword && newPassword && newPassword.length < 8) {
      ctx.addIssue({
        code: "custom",
        message: "Minimum 8 characters required",
        path: ["newPassword"],
      });
    }
  });
