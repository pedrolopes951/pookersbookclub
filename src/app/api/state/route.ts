import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const monthRows = await sql`
    SELECT id, num, name, topic, topic_short, blurb,
           date_iso, date_label, time_label, location,
           status, winner_label
    FROM months WHERE status = 'current' LIMIT 1
  `;
  const month = monthRows[0];
  if (!month) {
    return NextResponse.json(
      { error: "no current month — run the migration" },
      { status: 500 }
    );
  }
  const monthId = month.id as string;

  const [books, notes, topics, votes, prompts] = await Promise.all([
    sql`
      SELECT id, reader_id, picker_id, title, subtitle, author, year, pages,
             current_page, cover_hue, cover_accent, cover_glyph
      FROM books WHERE month_id = ${monthId}
      ORDER BY reader_id DESC
    `,
    sql`
      SELECT id, who, page, text, created_at
      FROM notes WHERE month_id = ${monthId}
      ORDER BY created_at ASC
    `,
    sql`
      SELECT id, label, emoji, base_votes, position
      FROM topics WHERE month_id = ${monthId}
      ORDER BY position ASC, created_at ASC
    `,
    sql`
      SELECT v.id, v.topic_id, v.voter
      FROM votes v
      JOIN topics t ON t.id = v.topic_id
      WHERE t.month_id = ${monthId}
    `,
    sql`
      SELECT id, position, text
      FROM prompts WHERE month_id = ${monthId}
      ORDER BY position ASC, created_at ASC
    `,
  ]);

  const votesByTopic = new Map<string, string[]>();
  for (const v of votes) {
    const arr = votesByTopic.get(v.topic_id as string) ?? [];
    arr.push(v.voter as string);
    votesByTopic.set(v.topic_id as string, arr);
  }

  return NextResponse.json({
    month: {
      id: month.id,
      num: month.num,
      name: month.name,
      topic: month.topic,
      topicShort: month.topic_short,
      blurb: month.blurb,
      dateISO: new Date(month.date_iso as string).toISOString(),
      dateLabel: month.date_label,
      timeLabel: month.time_label,
      location: month.location,
      winnerLabel: month.winner_label,
    },
    books: books.map((b) => ({
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
    notes: notes.map((n) => ({
      id: n.id,
      who: n.who,
      page: n.page,
      text: n.text,
    })),
    topics: topics.map((t) => {
      const voters = votesByTopic.get(t.id as string) ?? [];
      return {
        id: t.id,
        label: t.label,
        emoji: t.emoji,
        baseVotes: t.base_votes,
        position: t.position,
        voters,
      };
    }),
    prompts: prompts.map((p) => ({
      id: p.id,
      position: p.position,
      text: p.text,
    })),
  });
}
