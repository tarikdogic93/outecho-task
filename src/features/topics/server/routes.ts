import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db";
import { users, topics } from "@/db/schemas";
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
          { success: false, message: "This account does not exist", data: {} },
          404,
        );
      }

      const page = Number(c.req.query("page") || 1);
      const limit = Number(c.req.query("limit") || 5);
      const offset = (page - 1) * limit;

      const userTopicsTotalCount = (
        await db.query.topics.findMany({
          where: eq(topics.userId, existingUser.id),
        })
      ).length;

      const userTopics = await db.query.topics.findMany({
        columns: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
        },
        where: eq(topics.userId, existingUser.id),
        limit,
        offset,
        orderBy: (topics, { asc }) => asc(topics.createdAt),
        with: {
          user: {
            columns: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return c.json({
        success: true,
        message: "",
        data: userTopics,
        pagination: {
          page: page,
          totalPages: Math.ceil(userTopicsTotalCount / limit) as number,
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
      return c.json(
        { success: false, message: "This account does not exist", data: {} },
        404,
      );
    }

    const topicId = c.req.param("topicId");

    const existingTopic = await db.query.topics.findFirst({
      where: eq(topics.id, topicId),
      with: {
        user: {
          columns: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!existingTopic) {
      return c.json(
        { success: false, message: "This topic does not exist", data: {} },
        404,
      );
    }

    return c.json({
      success: true,
      message: "",
      data: existingTopic,
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
          { success: false, message: "This account does not exist", data: {} },
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
        success: true,
        message: "You have successfully created your topic",
        data: {
          title,
          description: updatedDescription,
        },
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
          { success: false, message: "This account does not exist", data: {} },
          404,
        );
      }

      const topicId = c.req.param("topicId");

      const existingTopic = await db.query.topics.findFirst({
        where: eq(topics.id, topicId),
      });

      if (!existingTopic) {
        return c.json(
          { success: false, message: "This topic does not exist", data: {} },
          404,
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
        success: true,
        message: "You have successfully updated your topic",
        data: {
          title,
          description: updatedDescription,
        },
      });
    },
  )
  .post("/:topicId/delete", apiAuthMiddleware, async (c) => {
    const jwtPayload = c.get("jwtPayload");

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, jwtPayload.email),
    });

    if (!existingUser) {
      return c.json(
        { success: false, message: "This account does not exist", data: {} },
        404,
      );
    }

    const topicId = c.req.param("topicId");

    const existingTopic = await db.query.topics.findFirst({
      where: eq(topics.id, topicId),
    });

    if (!existingTopic) {
      return c.json(
        { success: false, message: "This topic does not exist", data: {} },
        404,
      );
    }

    await db.delete(topics).where(eq(topics.id, existingTopic.id));

    return c.json({
      success: true,
      message: "You have successfully deleted your topic",
      data: {},
    });
  });

export default app;
