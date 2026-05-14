import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  // All months (archived + current), with their books, ordered newest first.
  const months = await sql`
    SELECT id, num, name, topic, topic_short, blurb,
           date_iso, date_label, time_label, location,
           status, winner_label, archived_at
    FROM months
    ORDER BY num DESC
  `;

  if (months.length === 0) {
    return NextResponse.json({ months: [] });
  }

  const ids = months.map((m) => m.id as string);
  const books = await sql`
    SELECT id, month_id, reader_id, picker_id, title, subtitle, author, year, pages,
           current_page, cover_hue, cover_accent, cover_glyph
    FROM books
    WHERE month_id = ANY(${ids}::uuid[])
  `;

  const byMonth = new Map<string, typeof books>();
  for (const b of books) {
    const k = b.month_id as string;
    const arr = byMonth.get(k) ?? [];
    arr.push(b);
    byMonth.set(k, arr);
  }

  return NextResponse.json({
    months: months.map((m) => ({
      id: m.id,
      num: m.num,
      name: m.name,
      topic: m.topic,
      topicShort: m.topic_short,
      blurb: m.blurb,
      dateISO: new Date(m.date_iso as string).toISOString(),
      dateLabel: m.date_label,
      timeLabel: m.time_label,
      location: m.location,
      status: m.status,
      winnerLabel: m.winner_label,
      archivedAt: m.archived_at ? new Date(m.archived_at as string).toISOString() : null,
      books: (byMonth.get(m.id as string) ?? []).map((b) => ({
        id: b.id,
        readerId: b.reader_id,
        pickerId: b.picker_id,
        title: b.title,
        subtitle: b.subtitle,
        author: b.author,
        year: b.year,
        pages: b.pages,
        currentPage: b.current_page,
        coverHue: b.cover_hue,
        coverAccent: b.cover_accent,
        coverGlyph: b.cover_glyph,
      })),
    })),
  });
}
