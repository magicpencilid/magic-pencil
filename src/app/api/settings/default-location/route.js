import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";

export async function GET() {
  try {
    const db = getDb();
    const row = db.prepare("SELECT value FROM schedule_config WHERE type = 'default_location' LIMIT 1").get();
    return NextResponse.json({
      success: true,
      data: { location: row?.value || "" },
    });
  } catch (error) {
    return NextResponse.json({ success: false, errors: ["Gagal mengambil lokasi"] }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const location = body.location?.trim() || "";
    if (!location) {
      return NextResponse.json({ success: false, errors: ["Lokasi tidak boleh kosong"] }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare("SELECT id FROM schedule_config WHERE type = 'default_location'").get();
    if (existing) {
      db.prepare("UPDATE schedule_config SET value = ? WHERE type = 'default_location'").run(location);
    } else {
      db.prepare("INSERT INTO schedule_config (type, value, sort_order) VALUES ('default_location', ?, 0)").run(location);
    }

    return NextResponse.json({ success: true, data: { location } });
  } catch (error) {
    return NextResponse.json({ success: false, errors: ["Gagal menyimpan lokasi"] }, { status: 500 });
  }
}
