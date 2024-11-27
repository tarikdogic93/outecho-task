import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "@/features/auth/server/routes";
import profile from "@/features/profile/server/routes";
import topics from "@/features/topics/server/routes";
import comments from "@/features/comments/server/routes";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/auth", auth)
  .route("/profile", profile)
  .route("/topics", topics)
  .route("/comments", comments);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
