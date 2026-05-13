import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const topicId = String(body.topicId ?? "");
  const voter = String(body.voter ?? "");
  if (!topicId) return NextResponse.json({ error: "topicId required" }, { status: 400 });
  if (voter !== "p" && voter !== "l") {
    return NextResponse.json({ error: "voter must be 'p' or 'l'" }, { status: 400 });
  }

  const existing = await sql`
    SELECT id FROM votes WHERE topic_id = ${topicId} AND voter = ${voter} LIMIT 1
  `;
  if (existing.length > 0) {
    await sql`DELETE FROM votes WHERE topic_id = ${topicId} AND voter = ${voter}`;
    return NextResponse.json({ state: "removed" });
  }
  await sql`INSERT INTO votes (topic_id, voter) VALUES (${topicId}, ${voter})`;
  return NextResponse.json({ state: "added" });
}
