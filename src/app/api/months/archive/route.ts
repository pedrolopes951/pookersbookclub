import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { sql } from "@/lib/db";

type BookIn = {
  readerId: "p" | "l";
  pickerId: "p" | "l";
  title: string;
  subtitle?: string;
  author?: string;
  year?: number | null;
  pages?: number;
  coverHue?: string;
  coverAccent?: string;
  coverGlyph?: string;
};

type Body = {
  next: {
    name: string;
    topic: string;
    topicShort?: string;
    blurb?: string;
    dateISO: string;
    dateLabel: string;
    timeLabel: string;
    location?: string;
  };
  books: BookIn[];
};

const COVER_PALETTE = [
  { hue: "#4A3D7A", accent: "#E8DDD0" },
  { hue: "#234A5E", accent: "#D4A574" },
  { hue: "#5E2A2A", accent: "#F2EAE0" },
  { hue: "#2D5A3D", accent: "#F2EAE0" },
  { hue: "#7A4A2C", accent: "#F2EAE0" },
];

export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  if (!body?.next?.topic?.trim() || !body?.next?.name?.trim() || !body?.next?.dateISO) {
    return NextResponse.json(
      { error: "next.topic, next.name, and next.dateISO are required" },
      { status: 400 }
    );
  }
  if (!Array.isArray(body.books) || body.books.length !== 2) {
    return NextResponse.json(
      { error: "exactly 2 books required (one per reader)" },
      { status: 400 }
    );
  }
  const readerIds = body.books.map((b) => b.readerId).sort().join(",");
  if (readerIds !== "l,p") {
    return NextResponse.json(
      { error: "books must cover both readers (one with readerId='l', one with readerId='p')" },
      { status: 400 }
    );
  }

  // 1) Find current month + compute winner
  const currentRows = await sql`
    SELECT id, num FROM months WHERE status = 'current' LIMIT 1
  `;
  const current = currentRows[0];
  if (!current) {
    return NextResponse.json({ error: "no current month to archive" }, { status: 500 });
  }
  const currentId = current.id as string;
  const nextNum = (current.num as number) + 1;

  const winnerRows = await sql`
    SELECT t.label, t.base_votes + COUNT(v.id)::int AS total_votes
    FROM topics t
    LEFT JOIN votes v ON v.topic_id = t.id
    WHERE t.month_id = ${currentId}
    GROUP BY t.id, t.label, t.base_votes
    ORDER BY total_votes DESC, t.position ASC
    LIMIT 1
  `;
  const winnerLabel = (winnerRows[0]?.label as string) ?? null;

  // 2) Atomic flip: archive old + insert new + seed new books
  const newId = randomUUID();
  const n = body.next;
  const topicShort = (n.topicShort || n.topic).slice(0, 64);
  const blurb = n.blurb ?? "";
  const location = n.location ?? "";

  const [bookA, bookB] = body.books;
  const palette = COVER_PALETTE[(nextNum - 1) % COVER_PALETTE.length];
  const defaults = (b: BookIn, idx: number) => ({
    subtitle: b.subtitle ?? "",
    author: b.author ?? "",
    year: b.year ?? null,
    pages: Math.max(0, Math.floor(Number(b.pages ?? 0))),
    hue: b.coverHue ?? (idx === 0 ? palette.hue : COVER_PALETTE[(nextNum) % COVER_PALETTE.length].hue),
    accent: b.coverAccent ?? palette.accent,
    glyph: b.coverGlyph ?? "📖",
  });
  const dA = defaults(bookA, 0);
  const dB = defaults(bookB, 1);

  await sql.transaction([
    sql`
      UPDATE months
      SET status = 'archived', archived_at = now(), winner_label = ${winnerLabel}
      WHERE id = ${currentId}
    `,
    sql`
      INSERT INTO months (id, num, name, topic, topic_short, blurb, date_iso, date_label, time_label, location, status)
      VALUES (${newId}, ${nextNum}, ${n.name}, ${n.topic}, ${topicShort}, ${blurb},
              ${n.dateISO}, ${n.dateLabel}, ${n.timeLabel}, ${location}, 'current')
    `,
    sql`
      INSERT INTO books (month_id, reader_id, picker_id, title, subtitle, author, year, pages, cover_hue, cover_accent, cover_glyph)
      VALUES (${newId}, ${bookA.readerId}, ${bookA.pickerId}, ${bookA.title},
              ${dA.subtitle}, ${dA.author}, ${dA.year}, ${dA.pages},
              ${dA.hue}, ${dA.accent}, ${dA.glyph})
    `,
    sql`
      INSERT INTO books (month_id, reader_id, picker_id, title, subtitle, author, year, pages, cover_hue, cover_accent, cover_glyph)
      VALUES (${newId}, ${bookB.readerId}, ${bookB.pickerId}, ${bookB.title},
              ${dB.subtitle}, ${dB.author}, ${dB.year}, ${dB.pages},
              ${dB.hue}, ${dB.accent}, ${dB.glyph})
    `,
  ]);

  return NextResponse.json({
    ok: true,
    archived: { id: currentId, winnerLabel },
    nextMonthId: newId,
  });
}
