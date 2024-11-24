import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

import * as schema from "./schema";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

export { db };
