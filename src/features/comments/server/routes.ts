import { Hono } from "hono";
import { desc, count, eq, and, sql } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db";
import { users, topics, comments, likes } from "@/db/schemas";
import { apiAuthMiddleware } from "@/lib/api-auth-middleware";
import { commentSchema } from "@/features/comments/schemas";

const app = new Hono()
  .get(
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

      if (!topicId) {
        return c.json({ message: "Topic id is required", data: {} }, 400);
      }

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
          likesCount: sql`COUNT(DISTINCT ${likes.userId}) FILTER (WHERE ${likes.commentId} = ${comments.id})`,
          like: sql<boolean>`MAX(CASE WHEN ${likes.userId} = ${existingUser.id} AND ${likes.commentId} = ${comments.id} THEN 1 ELSE 0 END) = 1`,
        })
        .from(comments)
        .innerJoin(users, eq(comments.userId, users.id))
        .leftJoin(topics, eq(comments.topicId, topics.id))
        .leftJoin(likes, eq(topics.id, likes.topicId))
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
    "/",
    apiAuthMiddleware,
    zValidator("json", commentSchema),
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

      if (!topicId) {
        return c.json({ message: "Topic id is required", data: {} }, 400);
      }

      const existingTopic = await db.query.topics.findFirst({
        where: eq(topics.id, topicId),
      });

      if (!existingTopic) {
        return c.json({ message: "This topic does not exist", data: {} }, 404);
      }

      const { content } = c.req.valid("json");

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
  )
  .patch(
    "/:commentId",
    apiAuthMiddleware,
    zValidator("json", commentSchema),
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

      if (!topicId) {
        return c.json({ message: "Topic id is required", data: {} }, 400);
      }

      const existingTopic = await db.query.topics.findFirst({
        where: eq(topics.id, topicId),
      });

      if (!existingTopic) {
        return c.json({ message: "This topic does not exist", data: {} }, 404);
      }

      const commentId = c.req.param("commentId");

      const existingComment = await db.query.comments.findFirst({
        where: eq(comments.id, commentId),
      });

      if (!existingComment) {
        return c.json(
          { message: "This comment does not exist", data: {} },
          404,
        );
      }

      if (existingComment.topicId !== existingTopic.id) {
        return c.json(
          { message: "This comment does not belong to this topic", data: {} },
          404,
        );
      }

      if (existingComment.userId !== existingUser.id) {
        return c.json(
          {
            message: "You are not allowed to update this comment",
            data: {},
          },
          403,
        );
      }

      const { content } = c.req.valid("json");

      await db
        .update(comments)
        .set({
          content,
        })
        .where(eq(comments.id, existingComment.id));

      return c.json({
        message: "You have successfully updated your comment",
        data: {},
      });
    },
  )
  .post("/:commentId/like", apiAuthMiddleware, async (c) => {
    const jwtPayload = c.get("jwtPayload");

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, jwtPayload.email),
    });

    if (!existingUser) {
      return c.json({ message: "This account does not exist", data: {} }, 404);
    }

    const topicId = c.req.param("topicId");

    if (!topicId) {
      return c.json({ message: "Topic id is required", data: {} }, 400);
    }

    const existingTopic = await db.query.topics.findFirst({
      where: eq(topics.id, topicId),
    });

    if (!existingTopic) {
      return c.json({ message: "This topic does not exist", data: {} }, 404);
    }

    const commentId = c.req.param("commentId");

    const existingComment = await db.query.comments.findFirst({
      where: eq(comments.id, commentId),
    });

    if (!existingComment) {
      return c.json({ message: "This comment does not exist", data: {} }, 404);
    }

    if (existingComment.topicId !== existingTopic.id) {
      return c.json(
        { message: "This comment does not belong to this topic", data: {} },
        404,
      );
    }

    const existingLike = await db.query.likes.findFirst({
      where: and(
        eq(likes.userId, existingUser.id),
        eq(likes.topicId, existingTopic.id),
        eq(likes.commentId, existingComment.id),
      ),
    });

    if (!existingLike) {
      await db.insert(likes).values({
        userId: existingUser.id,
        topicId: existingTopic.id,
        commentId: existingComment.id,
      });
    } else {
      await db
        .delete(likes)
        .where(
          and(
            eq(likes.userId, existingUser.id),
            eq(likes.topicId, existingTopic.id),
            eq(likes.commentId, existingComment.id),
          ),
        );
    }

    return c.json({
      message: "",
      data: {},
    });
  })
  .delete("/:commentId", apiAuthMiddleware, async (c) => {
    const jwtPayload = c.get("jwtPayload");

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, jwtPayload.email),
    });

    if (!existingUser) {
      return c.json({ message: "This account does not exist", data: {} }, 404);
    }

    const topicId = c.req.param("topicId");

    if (!topicId) {
      return c.json({ message: "Topic id is required", data: {} }, 400);
    }

    const existingTopic = await db.query.topics.findFirst({
      where: eq(topics.id, topicId),
    });

    if (!existingTopic) {
      return c.json({ message: "This topic does not exist", data: {} }, 404);
    }

    const commentId = c.req.param("commentId");

    const existingComment = await db.query.comments.findFirst({
      where: eq(comments.id, commentId),
    });

    if (!existingComment) {
      return c.json({ message: "This comment does not exist", data: {} }, 404);
    }

    if (existingComment.topicId !== existingTopic.id) {
      return c.json(
        { message: "This comment does not belong to this topic", data: {} },
        404,
      );
    }

    if (existingComment.userId !== existingUser.id) {
      return c.json(
        {
          message: "You are not allowed to delete this comment",
          data: {},
        },
        403,
      );
    }

    await db.delete(comments).where(eq(comments.id, existingComment.id));

    return c.json({
      message: "You have successfully deleted your comment",
      data: {},
    });
  });

export default app;
