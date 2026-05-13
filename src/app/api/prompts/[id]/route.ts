import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const text = String(body.text ?? "").trim();
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });
  await sql`UPDATE prompts SET text = ${text} WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await sql`DELETE FROM prompts WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
