import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(req: Request) {
  const body = await req.json();
  const set: Record<string, unknown> = {};
  if (typeof body.topic === "string") set.topic = body.topic;
  if (typeof body.topicShort === "string") set.topic_short = body.topicShort;
  if (typeof body.blurb === "string") set.blurb = body.blurb;
  if (typeof body.dateISO === "string") set.date_iso = body.dateISO;
  if (typeof body.dateLabel === "string") set.date_label = body.dateLabel;
  if (typeof body.timeLabel === "string") set.time_label = body.timeLabel;
  if (typeof body.location === "string") set.location = body.location;

  if (Object.keys(set).length === 0) {
    return NextResponse.json({ error: "no fields to update" }, { status: 400 });
  }

  // The neon tagged-template API doesn't compose well with dynamic SET clauses,
  // so update each field with its own statement. There are <=7 fields per call.
  for (const [col, val] of Object.entries(set)) {
    if (col === "topic") await sql`UPDATE months SET topic = ${val as string} WHERE status = 'current'`;
    else if (col === "topic_short") await sql`UPDATE months SET topic_short = ${val as string} WHERE status = 'current'`;
    else if (col === "blurb") await sql`UPDATE months SET blurb = ${val as string} WHERE status = 'current'`;
    else if (col === "date_iso") await sql`UPDATE months SET date_iso = ${val as string} WHERE status = 'current'`;
    else if (col === "date_label") await sql`UPDATE months SET date_label = ${val as string} WHERE status = 'current'`;
    else if (col === "time_label") await sql`UPDATE months SET time_label = ${val as string} WHERE status = 'current'`;
    else if (col === "location") await sql`UPDATE months SET location = ${val as string} WHERE status = 'current'`;
  }
  return NextResponse.json({ ok: true });
}
