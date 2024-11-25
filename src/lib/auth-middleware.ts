"use server";

import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

import { AUTH_COOKIE } from "@/constants";

type AdditionalContext = {
  Variables: {
    jwtPayload: { email: string };
  };
};

export const authMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const authCookie = getCookie(c, AUTH_COOKIE);

    if (!authCookie) {
      return c.json({ success: false, message: "Unauthorized", data: {} }, 401);
    }

    try {
      const decodedPayload = await verify(authCookie, process.env.JWT_SECRET!);

      c.set("jwtPayload", decodedPayload);

      await next();
    } catch (error) {
      console.log(error);

      return c.json({ success: false, message: "Unauthorized", data: {} }, 401);
    }
  },
);
