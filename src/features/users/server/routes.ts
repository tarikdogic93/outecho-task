import { Hono } from "hono";
import { count, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db";
import { users, comments } from "@/db/schemas";
import { apiAuthMiddleware } from "@/lib/api-auth-middleware";

const app = new Hono().get(
  "/",
  apiAuthMiddleware,
  zValidator(
    "query",
    z.object({
      page: z.string(),
      limit: z.string(),
    }),
  ),
  async (c) => {
    const page = Number(c.req.query("page") || 1);
    const limit = Number(c.req.query("limit") || 5);
    const offset = (page - 1) * limit;

    const totalCountResult = await db
      .select({
        totalCount: count(users.id),
      })
      .from(users)
      .limit(1);

    const totalCount = totalCountResult[0].totalCount;

    const allUsers = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        image: users.image,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        commentsCount: sql`COUNT(DISTINCT ${comments.id})`,
      })
      .from(users)
      .leftJoin(comments, eq(users.id, comments.userId))
      .groupBy(users.id)
      .limit(limit)
      .offset(offset)
      .orderBy(sql`COUNT(DISTINCT ${comments.id}) DESC`);

    return c.json({
      message: "",
      data: allUsers,
      pagination: {
        page: page,
        totalPages: Math.ceil(totalCount / limit) as number,
      },
    });
  },
);

export default app;
