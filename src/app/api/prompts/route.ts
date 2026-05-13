import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const text = String(body.text ?? "").trim();
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });

  const monthRows = await sql`SELECT id FROM months WHERE status = 'current' LIMIT 1`;
  const monthId = monthRows[0]?.id;
  if (!monthId) return NextResponse.json({ error: "no current month" }, { status: 500 });

  const posRows = await sql`
    SELECT COALESCE(MAX(position), -1) + 1 AS next_pos
    FROM prompts WHERE month_id = ${monthId}
  `;
  const nextPos = posRows[0]?.next_pos ?? 0;

  const rows = await sql`
    INSERT INTO prompts (month_id, position, text)
    VALUES (${monthId}, ${nextPos}, ${text})
    RETURNING id, position, text
  `;
  return NextResponse.json({ prompt: rows[0] }, { status: 201 });
}
