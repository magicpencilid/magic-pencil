import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { getCurrentMurid } from "@/lib/auth-murid";

/**
 * GET /api/jadwal-murid — Jadwal kelas murid yang login
 * Query params: filter=hari-ini|minggu-ini|semua
 */
export async function GET(request) {
  try {
    const murid = await getCurrentMurid();
    if (!murid) {
      return NextResponse.json({ success: false, error: "Tidak terautentikasi" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "semua";

    const db = getDb();

    // Ambil jadwal berdasarkan class_name murid
    let query = `
      SELECT j.id, j.class_name, j.schedule_date, j.schedule_time,
             j.teacher_name, j.location, j.notes,
             p.participant_name, p.full_name
      FROM jadwal j
      JOIN pendaftar p ON j.registration_id = p.id
      WHERE j.class_name = ?
    `;
    const params = [murid.class_name];

    const today = new Date();
    const yyyyMmDd = today.toISOString().split("T")[0];

    // Dapatkan hari Senin minggu ini (Indonesia timezone)
    const dayOfWeek = today.getDay(); // 0=Minggu, 1=Senin...
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    const mondayStr = monday.toISOString().split("T")[0];
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const sundayStr = sunday.toISOString().split("T")[0];

    if (filter === "hari-ini") {
      query += " AND j.schedule_date = ?";
      params.push(yyyyMmDd);
    } else if (filter === "minggu-ini") {
      query += " AND j.schedule_date >= ? AND j.schedule_date <= ?";
      params.push(mondayStr, sundayStr);
    }

    query += " ORDER BY j.schedule_date ASC, j.schedule_time ASC";

    const jadwal = db.prepare(query).all(...params);

    return NextResponse.json({
      success: true,
      data: jadwal,
      filter,
      today: yyyyMmDd,
    });
  } catch (error) {
    console.error("Jadwal murid error:", error);
    return NextResponse.json({ success: false, error: "Gagal memuat jadwal" }, { status: 500 });
  }
}
