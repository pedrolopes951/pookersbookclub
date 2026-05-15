import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const who = Number(body.who);
  const page = Math.max(0, parseInt(String(body.page ?? 0), 10) || 0);
  const text = String(body.text ?? "").trim();
  const bookIdRaw = body.bookId;
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });
  if (who !== 0 && who !== 1) return NextResponse.json({ error: "who must be 0 or 1" }, { status: 400 });

  const monthRows = await sql`SELECT id FROM months WHERE status = 'current' LIMIT 1`;
  const monthId = monthRows[0]?.id;
  if (!monthId) return NextResponse.json({ error: "no current month" }, { status: 500 });

  let bookId: string | null = null;
  if (bookIdRaw != null && bookIdRaw !== "") {
    const bookRows = await sql`
      SELECT id FROM books WHERE id = ${String(bookIdRaw)} AND month_id = ${monthId} LIMIT 1
    `;
    if (!bookRows[0]) {
      return NextResponse.json({ error: "bookId not in current month" }, { status: 400 });
    }
    bookId = bookRows[0].id as string;
  }

  const rows = await sql`
    INSERT INTO notes (month_id, who, page, text, book_id)
    VALUES (${monthId}, ${who}, ${page}, ${text}, ${bookId})
    RETURNING id, who, page, text, book_id
  `;
  const n = rows[0];
  return NextResponse.json(
    { note: { id: n.id, who: n.who, page: n.page, text: n.text, bookId: n.book_id } },
    { status: 201 }
  );
}
