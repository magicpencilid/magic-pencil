import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare(`
      SELECT j.*, p.full_name, p.participant_name
      FROM jadwal j
      LEFT JOIN pendaftar p ON j.registration_id = p.id
      ORDER BY j.schedule_date DESC
    `).all();
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json(
      { success: false, errors: ["Gagal mengambil jadwal"] },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      INSERT INTO jadwal (registration_id, class_name, schedule_date, schedule_time, teacher_name, location, notes)
      VALUES (@registration_id, @class_name, @schedule_date, @schedule_time, @teacher_name, @location, @notes)
    `);

    const result = stmt.run({
      registration_id: body.registration_id,
      class_name: body.class_name,
      schedule_date: body.schedule_date,
      schedule_time: body.schedule_time,
      teacher_name: body.teacher_name || null,
      location: body.location || null,
      notes: body.notes || null,
    });

    return NextResponse.json({
      success: true,
      data: { id: result.lastInsertRowid },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, errors: ["Gagal membuat jadwal"] },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, errors: ["ID diperlukan"] }, { status: 400 });

    const db = getDb();
    db.prepare("DELETE FROM jadwal WHERE id = ?").run(Number(id));

    return NextResponse.json({ success: true, message: "Jadwal dihapus" });
  } catch (error) {
    return NextResponse.json(
      { success: false, errors: ["Gagal menghapus jadwal"] },
      { status: 500 }
    );
  }
}
