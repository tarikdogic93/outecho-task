import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "@/features/auth/server/routes";
import profile from "@/features/profile/server/routes";
import topics from "@/features/topics/server/routes";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/auth", auth)
  .route("/profile", profile)
  .route("/topics", topics);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
