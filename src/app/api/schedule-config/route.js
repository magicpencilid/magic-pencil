/* =============================================
   📡 API: /api/schedule-config
   
   GET  — List semua hari & jam
   POST — Tambah baru
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";

export async function GET() {
  try {
    const db = getDb();
    const hari = db.prepare("SELECT * FROM schedule_config WHERE type='hari' ORDER BY sort_order").all();
    const jam = db.prepare("SELECT * FROM schedule_config WHERE type='jam' ORDER BY sort_order").all();
    return NextResponse.json({ success: true, data: { hari, jam } });
  } catch (error) {
    return NextResponse.json({ success: false, errors: ["Gagal mengambil data"] }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const db = getDb();

    if (!body.type || !body.value?.trim()) {
      return NextResponse.json({ success: false, errors: ["Type dan value wajib diisi"] }, { status: 400 });
    }
    if (!["hari", "jam"].includes(body.type)) {
      return NextResponse.json({ success: false, errors: ["Type harus 'hari' atau 'jam'"] }, { status: 400 });
    }

    const maxSort = db.prepare("SELECT MAX(sort_order) as mx FROM schedule_config WHERE type = ?").get(body.type);
    const stmt = db.prepare("INSERT INTO schedule_config (type, value, sort_order) VALUES (?, ?, ?)");
    const result = stmt.run(body.type, body.value.trim(), (maxSort?.mx || 0) + 1);

    return NextResponse.json({ success: true, data: { id: result.lastInsertRowid } });
  } catch (error) {
    return NextResponse.json({ success: false, errors: ["Gagal menyimpan"] }, { status: 500 });
  }
}
