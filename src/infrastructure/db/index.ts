import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// Neon Local対応
const neonLocalHost = process.env.NEON_LOCAL_HOST;

if (neonLocalHost) {
  // ローカル開発: Neon Local使用
  neonConfig.fetchEndpoint = `http://${neonLocalHost}:4444/sql`;
  neonConfig.useSecureWebSocket = false;
}

const databaseUrl = neonLocalHost
  ? `postgres://neon:npg@${neonLocalHost}:5432/neondb`
  : process.env.NETLIFY_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Database URL not configured");
}

const sql = neon(databaseUrl);
export const db = drizzle(sql, { casing: "snake_case" });
