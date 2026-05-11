import { dbAll, dbRun } from "@/lib/sqlite";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, inquiryType, message } = body;
    const r = await dbRun(
      `INSERT INTO contact_inquiries (first_name, last_name, email, inquiry_type, message) VALUES (?, ?, ?, ?, ?)`,
      [firstName ?? "", lastName ?? "", email ?? "", inquiryType ?? "General Inquiry", message ?? ""],
    );
    if (r.demoReadonly) {
      return NextResponse.json({ ok: true, demoReadonly: true });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function GET() {
  const rows = await dbAll(`SELECT id, first_name, last_name, email, inquiry_type, created_at FROM contact_inquiries ORDER BY id DESC LIMIT 20`);
  return NextResponse.json(rows);
}
