import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  if (body.currentPage == null) {
    return NextResponse.json({ error: "currentPage required" }, { status: 400 });
  }
  const cp = Math.max(0, parseInt(String(body.currentPage), 10) || 0);
  await sql`UPDATE books SET current_page = ${cp} WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
