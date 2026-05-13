import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const label = body.label != null ? String(body.label) : null;
  const emoji = body.emoji != null ? String(body.emoji) : null;

  if (label !== null && emoji !== null) {
    await sql`UPDATE topics SET label = ${label}, emoji = ${emoji} WHERE id = ${id}`;
  } else if (label !== null) {
    await sql`UPDATE topics SET label = ${label} WHERE id = ${id}`;
  } else if (emoji !== null) {
    await sql`UPDATE topics SET emoji = ${emoji} WHERE id = ${id}`;
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await sql`DELETE FROM topics WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
