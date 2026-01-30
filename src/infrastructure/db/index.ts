import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// Neon Local 接続設定（開発環境）
if (process.env.NEON_LOCAL_HOST) {
  neonConfig.fetchEndpoint = `http://${process.env.NEON_LOCAL_HOST}:5432/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = "password";
}

// 開発環境: Neon Local、本番環境: NETLIFY_DATABASE_URL
const connectionString = process.env.NEON_LOCAL_HOST
  ? `postgres://neon:npg@${process.env.NEON_LOCAL_HOST}:5432/neondb`
  : process.env.NETLIFY_DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Database connection not configured. Set NETLIFY_DATABASE_URL or NEON_LOCAL_HOST.",
  );
}

const sql = neon(connectionString);
export const db = drizzle(sql, { casing: "snake_case" });
