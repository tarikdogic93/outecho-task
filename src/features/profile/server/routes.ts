import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { setCookie, deleteCookie, getCookie } from "hono/cookie";
import { eq } from "drizzle-orm";
import bcrypt, { compare } from "bcryptjs";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db";
import { users } from "@/db/schema";
import { authMiddleware } from "@/lib/auth-middleware";
import { AUTH_COOKIE } from "@/features/auth/constants";
import { profileSchema } from "@/features/profile/schemas";

const app = new Hono()
  .post(
    "/update",
    authMiddleware,
    zValidator("json", profileSchema),
    async (c) => {
      const user = c.get("user");

      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, user.email),
      });

      if (!existingUser) {
        return c.json(
          { success: false, message: "This account does not exist", data: {} },
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
          return c.json(
            { success: false, message: "Invalid credentials", data: {} },
            401,
          );
        }

        if (newPassword) {
          const hashedNewPassword = await bcrypt.hash(newPassword, 10);

          await db.update(users).set({
            password: hashedNewPassword,
          });
        }
      }

      const updatedFirstName = firstName ? firstName : null;
      const updatedLastName = lastName ? lastName : null;

      await db.update(users).set({
        firstName: updatedFirstName,
        lastName: updatedLastName,
      });

      const authCookie = getCookie(c, AUTH_COOKIE);

      if (!authCookie) {
        return c.json(
          { success: false, message: "Unauthorized", data: {} },
          401,
        );
      }

      const decodedPayload = await verify(authCookie, process.env.JWT_SECRET!);

      if (!decodedPayload.exp) {
        return c.json({ success: false, message: "Invalid JWT token" }, 400);
      }

      const originalExp = decodedPayload.exp;

      const updatedPayload = {
        ...decodedPayload,
        firstName: updatedFirstName,
        lastName: updatedLastName,
      };

      deleteCookie(c, AUTH_COOKIE);

      const jwtToken = await sign(updatedPayload, process.env.JWT_SECRET!);

      setCookie(c, AUTH_COOKIE, jwtToken, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: originalExp - Math.floor(Date.now() / 1000),
      });

      return c.json({
        success: true,
        message: "You have successfully updated your profile",
        data: {
          firstName: updatedFirstName,
          lastName: updatedLastName,
          email: existingUser.email,
        },
      });
    },
  )
  .post("/delete", authMiddleware, async (c) => {
    const user = c.get("user");

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, user.email),
    });

    if (!existingUser) {
      return c.json(
        { success: false, message: "This account does not exist", data: {} },
        404,
      );
    }

    await db.delete(users).where(eq(users.email, existingUser.email));

    deleteCookie(c, AUTH_COOKIE);

    return c.json({
      success: true,
      message: "You have successfully deleted your account",
      data: {},
    });
  });

export default app;
