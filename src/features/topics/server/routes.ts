import { Hono } from "hono";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db";
import { users, topics, likes, comments } from "@/db/schemas";
import { apiAuthMiddleware } from "@/lib/api-auth-middleware";
import { topicSchema } from "@/features/topics/schemas";

const app = new Hono()
  .get(
    "/",
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
          totalCount: count(topics.id),
        })
        .from(topics)
        .limit(1);

      const totalCount = totalCountResult[0].totalCount;

      const allTopics = await db
        .select({
          id: topics.id,
          title: topics.title,
          createdAt: topics.createdAt,
          updatedAt: topics.updatedAt,
          user: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          },
          commentsCount: sql`COUNT(DISTINCT ${comments.id})`,
          likesCount: sql`
          COUNT(DISTINCT CASE 
            WHEN ${likes.commentId} IS NULL AND ${likes.topicId} = ${topics.id} THEN ${likes.userId} 
            ELSE NULL 
          END)
        `,
        })
        .from(topics)
        .innerJoin(users, eq(topics.userId, users.id))
        .leftJoin(comments, eq(topics.id, comments.topicId))
        .leftJoin(likes, eq(topics.id, likes.topicId))
        .where(eq(topics.userId, users.id))
        .groupBy(topics.id, users.id)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(topics.createdAt));

      return c.json({
        message: "",
        data: allTopics,
        pagination: {
          page: page,
          totalPages: Math.ceil(totalCount / limit) as number,
        },
      });
    },
  )
  .get(
    "/me",
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
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          },
          commentsCount: sql`COUNT(DISTINCT ${comments.id})`,
          likesCount: sql`
            COUNT(DISTINCT CASE 
              WHEN ${likes.commentId} IS NULL AND ${likes.topicId} = ${topics.id} THEN ${likes.userId} 
              ELSE NULL 
            END)
          `,
        })
        .from(topics)
        .innerJoin(users, eq(topics.userId, users.id))
        .leftJoin(comments, eq(topics.id, comments.topicId))
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
        id: topics.id,
        title: topics.title,
        description: topics.description,
        createdAt: topics.createdAt,
        updatedAt: topics.updatedAt,
        user: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        },
        commentsCount: sql`COUNT(DISTINCT ${comments.id})`,
        likesCount: sql`
          COUNT(DISTINCT CASE 
            WHEN ${likes.commentId} IS NULL AND ${likes.topicId} = ${topics.id} THEN ${likes.userId} 
            ELSE NULL 
          END)
        `,
        like: sql<boolean>`
          MAX(CASE 
            WHEN ${likes.userId} = ${existingUser.id} AND ${likes.commentId} IS NULL AND ${likes.topicId} = ${topics.id} THEN 1 
            ELSE 0 
          END) = 1
        `,
      })
      .from(topics)
      .innerJoin(users, eq(topics.userId, users.id))
      .leftJoin(comments, eq(topics.id, comments.topicId))
      .leftJoin(likes, eq(topics.id, likes.topicId))
      .where(eq(topics.id, topicId))
      .groupBy(topics.id, users.id)
      .limit(1);

    if (!existingTopic) {
      return c.json({ message: "This topic does not exist", data: {} }, 404);
    }

    return c.json({
      message: "",
      data: existingTopic[0],
    });
  })
  .post("/", apiAuthMiddleware, zValidator("json", topicSchema), async (c) => {
    const jwtPayload = c.get("jwtPayload");

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, jwtPayload.email),
    });

    if (!existingUser) {
      return c.json({ message: "This account does not exist", data: {} }, 404);
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
  })
  .patch(
    "/:topicId",
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
  .delete("/:topicId", apiAuthMiddleware, async (c) => {
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
