import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { getCurrentMurid } from "@/lib/auth-murid";

/**
 * POST /api/absensi/checkin
 * Validasi: hanya bisa check-in kalo ada jadwal kelas hari ini
 */
export async function POST(request) {
  try {
    const murid = await getCurrentMurid();
    if (!murid) {
      return NextResponse.json({ success: false, error: "Tidak terautentikasi" }, { status: 401 });
    }

    const db = getDb();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Cek apakah ada jadwal kelas hari ini
    const jadwalHariIni = db.prepare(
      "SELECT id, schedule_time FROM jadwal WHERE class_name = ? AND schedule_date = ?"
    ).get(murid.class_name, today);

    if (!jadwalHariIni) {
      return NextResponse.json({
        success: false,
        error: "Belum ada jadwal kelas hari ini. Cek jadwal kamu di menu Jadwal Kelas."
      }, { status: 400 });
    }

    // Cek udah check-in hari ini?
    const existing = db.prepare(
      "SELECT id, check_in FROM absensi WHERE murid_id = ? AND tanggal = ?"
    ).get(murid.murid_id, today);

    if (existing) {
      return NextResponse.json({ success: false, error: "Sudah check-in hari ini" }, { status: 409 });
    }

    const now = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

    // Auto-pake jadwal_id dari database
    db.prepare(
      "INSERT INTO absensi (murid_id, jadwal_id, check_in, status, tanggal) VALUES (?, ?, ?, 'hadir', ?)"
    ).run(murid.murid_id, jadwalHariIni.id, now, today);

    return NextResponse.json({
      success: true,
      message: "Check-in berhasil! Selamat menggambar",
      check_in: now,
      jadwal: {
        waktu: jadwalHariIni.schedule_time,
      },
    });
  } catch (error) {
    console.error("Checkin error:", error);
    return NextResponse.json({ success: false, error: "Gagal check-in" }, { status: 500 });
  }
}
