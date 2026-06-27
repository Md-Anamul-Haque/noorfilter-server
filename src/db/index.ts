import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { relations } from "./relations"
import * as schema from "./schema"
const globalForPg = globalThis as unknown as {
    pool?: Pool;
};
const pool =
    globalForPg.pool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
})

globalForPg.pool = pool;

export const db = drizzle({
  client: pool,
  schema: schema,
  relations,
  logger: true,
})
export type Db = typeof db
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]