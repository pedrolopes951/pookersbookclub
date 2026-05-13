#!/usr/bin/env node
import { Pool, neonConfig } from "@neondatabase/serverless";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, "..", "migrations");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const pool = new Pool({ connectionString: url });
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

try {
  for (const file of files) {
    const body = readFileSync(join(dir, file), "utf8");
    process.stdout.write(`→ running ${file} ... `);
    await pool.query(body);
    console.log("ok");
  }
  console.log("done.");
} finally {
  await pool.end();
}
