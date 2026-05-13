import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  const { rows: months } = await pool.query("SELECT id, num, topic, status FROM months");
  console.log("months:", months);
  const { rows: bks } = await pool.query("SELECT reader_id, title FROM books");
  console.log("books:", bks);
  const { rows: tps } = await pool.query("SELECT label, base_votes FROM topics ORDER BY position");
  console.log("topics:", tps);
  const { rows: pr } = await pool.query("SELECT position, left(text, 40) as snippet FROM prompts ORDER BY position");
  console.log("prompts:", pr);
} finally {
  await pool.end();
}
