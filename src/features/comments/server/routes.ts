import { Hono } from "hono";
import { desc, count, eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db";
import { users, topics, comments } from "@/db/schemas";
import { apiAuthMiddleware } from "@/lib/api-auth-middleware";
import { commentSchema } from "@/features/comments/schemas";

const app = new Hono()
  .get(
    "/:topicId",
    apiAuthMiddleware,
    zValidator(
      "query",
      z.object({
        page: z.string(),
        limit: z.string(),
      }),
    ),
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

      const topicId = c.req.param("topicId");

      const existingTopic = await db.query.topics.findFirst({
        where: eq(topics.id, topicId),
      });

      if (!existingTopic) {
        return c.json({ message: "This topic does not exist", data: {} }, 404);
      }

      const page = Number(c.req.query("page") || 1);
      const limit = Number(c.req.query("limit") || 5);
      const offset = (page - 1) * limit;

      const totalCountResult = await db
        .select({
          totalCount: count(topics.id),
        })
        .from(comments)
        .where(eq(comments.topicId, existingTopic.id))
        .limit(1);

      const totalCount = totalCountResult[0].totalCount;

      const topicComments = await db
        .select({
          id: comments.id,
          parentCommentId: comments.parentCommentId,
          content: comments.content,
          createdAt: comments.createdAt,
          updatedAt: comments.updatedAt,
          user: {
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          },
        })
        .from(comments)
        .innerJoin(users, eq(comments.userId, users.id))
        .leftJoin(topics, eq(comments.topicId, topics.id))
        .where(eq(comments.topicId, existingTopic.id))
        .groupBy(comments.id, users.id, topics.id)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(comments.createdAt));

      return c.json({
        message: "",
        data: topicComments,
        pagination: {
          page: page,
          totalPages: Math.ceil(totalCount / limit) as number,
        },
      });
    },
  )
  .post(
    "/add",
    apiAuthMiddleware,
    zValidator(
      "json",
      commentSchema.extend({
        topicId: z.string().min(1, "Topic ID is required"),
      }),
    ),
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

      const { topicId, content } = c.req.valid("json");

      const existingTopic = await db.query.topics.findFirst({
        where: eq(topics.id, topicId),
      });

      if (!existingTopic) {
        return c.json({ message: "This topic does not exist", data: {} }, 404);
      }

      await db.insert(comments).values({
        userId: existingUser.id,
        topicId: existingTopic.id,
        content,
      });

      return c.json({
        message: "You have successfully created your comment",
        data: {},
      });
    },
  );

export default app;
