import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";
import { eq } from "drizzle-orm";
import bcrypt, { compare } from "bcryptjs";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db";
import { users } from "@/db/schemas";
import { AUTH_COOKIE } from "@/constants";
import { apiAuthMiddleware } from "@/lib/api-auth-middleware";
import { profileSchema } from "@/features/profile/schemas";

const app = new Hono()
  .patch(
    "/",
    apiAuthMiddleware,
    zValidator("json", profileSchema),
    async (c) => {
      const jwtPayload = c.get("jwtPayload");

      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, jwtPayload.email),
      });

      if (!existingUser) {
        return c.json(
          { message: "This account does not exist", data: {} },
          404,
        );
      }

      const { firstName, lastName, oldPassword, newPassword } =
        c.req.valid("json");

      if (oldPassword) {
        const isOldPasswordConfirmed = await compare(
          oldPassword,
          existingUser.password,
        );

        if (!isOldPasswordConfirmed) {
          return c.json({ message: "Invalid password", data: {} }, 401);
        }

        if (newPassword) {
          const hashedNewPassword = await bcrypt.hash(newPassword, 10);

          await db
            .update(users)
            .set({
              password: hashedNewPassword,
            })
            .where(eq(users.email, existingUser.email));
        }
      }

      const updatedFirstName = firstName ? firstName : null;
      const updatedLastName = lastName ? lastName : null;

      await db
        .update(users)
        .set({
          firstName: updatedFirstName,
          lastName: updatedLastName,
        })
        .where(eq(users.email, existingUser.email));

      return c.json({
        message: "You have successfully updated your profile",
        data: {},
      });
    },
  )
  .delete("/", apiAuthMiddleware, async (c) => {
    const jwtPayload = c.get("jwtPayload");

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, jwtPayload.email),
    });

    if (!existingUser) {
      return c.json({ message: "This account does not exist", data: {} }, 404);
    }

    await db.delete(users).where(eq(users.email, existingUser.email));

    deleteCookie(c, AUTH_COOKIE);

    return c.json({
      message: "",
      data: {},
    });
  });

export default app;
