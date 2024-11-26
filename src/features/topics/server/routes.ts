import { Hono } from "hono";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db";
import { users, topics, likes } from "@/db/schemas";
import { apiAuthMiddleware } from "@/lib/api-auth-middleware";
import { topicSchema } from "@/features/topics/schemas";

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

      const page = Number(c.req.query("page") || 1);
      const limit = Number(c.req.query("limit") || 5);
      const offset = (page - 1) * limit;

      const totalCountResult = await db
        .select({
          totalCount: count(topics.id),
        })
        .from(topics)
        .where(eq(topics.userId, existingUser.id))
        .limit(1);

      const totalCount = totalCountResult[0].totalCount;

      const userTopics = await db
        .select({
          id: topics.id,
          title: topics.title,
          createdAt: topics.createdAt,
          updatedAt: topics.updatedAt,
          user: {
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          },
          likesCount: count(likes.id),
        })
        .from(topics)
        .innerJoin(users, eq(topics.userId, users.id))
        .leftJoin(likes, eq(topics.id, likes.topicId))
        .where(eq(topics.userId, existingUser.id))
        .groupBy(topics.id, users.id)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(topics.createdAt));

      return c.json({
        message: "",
        data: userTopics,
        pagination: {
          page: page,
          totalPages: Math.ceil(totalCount / limit) as number,
        },
      });
    },
  )
  .get("/:topicId", apiAuthMiddleware, async (c) => {
    const jwtPayload = c.get("jwtPayload");

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, jwtPayload.email),
    });

    if (!existingUser) {
      return c.json({ message: "This account does not exist", data: {} }, 404);
    }

    const topicId = c.req.param("topicId");

    const existingTopic = await db
      .select({
        title: topics.title,
        description: topics.description,
        createdAt: topics.createdAt,
        updatedAt: topics.updatedAt,
        user: {
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        },
        likesCount: count(likes.id),
        like: sql<boolean>`CASE WHEN ${likes.userId} IS NOT NULL THEN true ELSE false END`,
      })
      .from(topics)
      .innerJoin(users, eq(topics.userId, users.id))
      .leftJoin(likes, eq(topics.id, likes.topicId))
      .where(eq(topics.id, topicId))
      .groupBy(topics.id, users.id, likes.userId)
      .limit(1);

    if (!existingTopic) {
      return c.json({ message: "This topic does not exist", data: {} }, 404);
    }

    return c.json({
      message: "",
      data: existingTopic[0],
    });
  })
  .post(
    "/create",
    apiAuthMiddleware,
    zValidator("json", topicSchema),
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

      const { title, description } = c.req.valid("json");

      const updatedDescription = description ? description : null;

      await db.insert(topics).values({
        userId: existingUser.id,
        title,
        description: updatedDescription,
      });

      return c.json({
        message: "You have successfully created your topic",
        data: {},
      });
    },
  )
  .post(
    "/:topicId/update",
    apiAuthMiddleware,
    zValidator("json", topicSchema),
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

      if (existingTopic.userId !== existingUser.id) {
        return c.json(
          {
            message: "You are not allowed to update this topic",
            data: {},
          },
          403,
        );
      }

      const { title, description } = c.req.valid("json");

      const updatedDescription = description ? description : null;

      await db
        .update(topics)
        .set({
          title,
          description: updatedDescription,
        })
        .where(eq(topics.id, existingTopic.id));

      return c.json({
        message: "You have successfully updated your topic",
        data: {},
      });
    },
  )
  .post("/:topicId/like", apiAuthMiddleware, async (c) => {
    const jwtPayload = c.get("jwtPayload");

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, jwtPayload.email),
    });

    if (!existingUser) {
      return c.json({ message: "This account does not exist", data: {} }, 404);
    }

    const topicId = c.req.param("topicId");

    const existingTopic = await db.query.topics.findFirst({
      where: eq(topics.id, topicId),
    });

    if (!existingTopic) {
      return c.json({ message: "This topic does not exist", data: {} }, 404);
    }

    const existingLike = await db.query.likes.findFirst({
      where: and(
        eq(likes.userId, existingUser.id),
        eq(likes.topicId, existingTopic.id),
      ),
    });

    if (!existingLike) {
      await db.insert(likes).values({
        userId: existingUser.id,
        topicId: existingTopic.id,
      });
    } else {
      await db
        .delete(likes)
        .where(
          and(
            eq(likes.userId, existingUser.id),
            eq(likes.topicId, existingTopic.id),
          ),
        );
    }

    return c.json({
      message: "",
      data: {},
    });
  })
  .post("/:topicId/delete", apiAuthMiddleware, async (c) => {
    const jwtPayload = c.get("jwtPayload");

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, jwtPayload.email),
    });

    if (!existingUser) {
      return c.json({ message: "This account does not exist", data: {} }, 404);
    }

    const topicId = c.req.param("topicId");

    const existingTopic = await db.query.topics.findFirst({
      where: eq(topics.id, topicId),
    });

    if (!existingTopic) {
      return c.json({ message: "This topic does not exist", data: {} }, 404);
    }

    if (existingTopic.userId !== existingUser.id) {
      return c.json(
        {
          message: "You are not allowed to delete this topic",
          data: {},
        },
        403,
      );
    }

    await db.delete(topics).where(eq(topics.id, existingTopic.id));

    return c.json({
      message: "You have successfully deleted your topic",
      data: {},
    });
  });

export default app;
