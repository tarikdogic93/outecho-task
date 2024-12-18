import { Hono } from "hono";
import { sign } from "hono/jwt";
import { setCookie, deleteCookie } from "hono/cookie";
import { eq } from "drizzle-orm";
import bcrypt, { compare } from "bcryptjs";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db";
import { users } from "@/db/schemas";
import { AUTH_COOKIE } from "@/constants";
import { generateRoboHashAvatar } from "@/lib/utils";
import { apiAuthMiddleware } from "@/lib/api-auth-middleware";
import { signInSchema, signUpSchema } from "@/features/auth/schemas";

const app = new Hono()
  .get("/current", apiAuthMiddleware, async (c) => {
    const jwtPayload = c.get("jwtPayload");

    const user = await db.query.users.findFirst({
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
      },
      where: eq(users.email, jwtPayload.email),
    });

    return c.json({
      message: "",
      data: user,
    });
  })
  .post("/signin", zValidator("json", signInSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      return c.json(
        {
          message: "Account does not exist",
          data: {},
        },
        401,
      );
    }

    const isPasswordConfirmed = await compare(password, existingUser.password);

    if (!isPasswordConfirmed) {
      return c.json({ message: "Invalid password", data: {} }, 401);
    }

    const jwtToken = await sign(
      {
        email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 1,
      },
      process.env.JWT_SECRET!,
    );

    setCookie(c, AUTH_COOKIE, jwtToken, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 60 * 60 * 24 * 1,
    });

    return c.json({
      message: "",
      data: {},
    });
  })
  .post("/signup", zValidator("json", signUpSchema), async (c) => {
    const { firstName, lastName, email, password } = c.req.valid("json");

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return c.json({ message: "This account already exists", data: {} }, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedFirstName = firstName ? firstName : null;
    const updatedLastName = lastName ? lastName : null;

    const imageUrl = await generateRoboHashAvatar(email);

    await db.insert(users).values({
      firstName: updatedFirstName,
      lastName: updatedLastName,
      email,
      image: imageUrl,
      password: hashedPassword,
    });

    return c.json({
      message: "You have successfully signed up",
      data: {},
    });
  })
  .post("/signout", apiAuthMiddleware, async (c) => {
    deleteCookie(c, AUTH_COOKIE);

    return c.json({
      message: "",
      data: {},
    });
  });

export default app;
