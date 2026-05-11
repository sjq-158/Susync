import { dbAll } from "@/lib/sqlite";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rows = await dbAll(`SELECT * FROM properties WHERE status = 'active' ORDER BY created_at DESC`);
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
