import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set. Add it to .env.local.");
}

// HTTP-based driver — one statement per call, perfect for serverless route handlers.
export const sql = neon(url);
