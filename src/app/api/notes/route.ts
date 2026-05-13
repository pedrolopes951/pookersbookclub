import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const who = Number(body.who);
  const page = Math.max(0, parseInt(String(body.page ?? 0), 10) || 0);
  const text = String(body.text ?? "").trim();
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });
  if (who !== 0 && who !== 1) return NextResponse.json({ error: "who must be 0 or 1" }, { status: 400 });

  const monthRows = await sql`SELECT id FROM months WHERE status = 'current' LIMIT 1`;
  const monthId = monthRows[0]?.id;
  if (!monthId) return NextResponse.json({ error: "no current month" }, { status: 500 });

  const rows = await sql`
    INSERT INTO notes (month_id, who, page, text)
    VALUES (${monthId}, ${who}, ${page}, ${text})
    RETURNING id, who, page, text
  `;
  return NextResponse.json({ note: rows[0] }, { status: 201 });
}
