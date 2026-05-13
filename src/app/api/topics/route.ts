import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const label = String(body.label ?? "").trim();
  const emoji = String(body.emoji ?? "✦").trim() || "✦";
  if (!label) return NextResponse.json({ error: "label required" }, { status: 400 });

  const monthRows = await sql`SELECT id FROM months WHERE status = 'current' LIMIT 1`;
  const monthId = monthRows[0]?.id;
  if (!monthId) return NextResponse.json({ error: "no current month" }, { status: 500 });

  const posRows = await sql`
    SELECT COALESCE(MAX(position), -1) + 1 AS next_pos
    FROM topics WHERE month_id = ${monthId}
  `;
  const nextPos = posRows[0]?.next_pos ?? 0;

  const rows = await sql`
    INSERT INTO topics (month_id, label, emoji, position)
    VALUES (${monthId}, ${label}, ${emoji}, ${nextPos})
    RETURNING id, label, emoji, base_votes, position
  `;
  return NextResponse.json({ topic: rows[0] }, { status: 201 });
}
