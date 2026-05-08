import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { getCurrentMurid } from "@/lib/auth-murid";

/**
 * POST /api/absensi/checkin
 * Body: { jadwal_id? } (opsional — kalo ada jadwal)
 */
export async function POST(request) {
  try {
    const murid = await getCurrentMurid();
    if (!murid) {
      return NextResponse.json({ success: false, error: "Tidak terautentikasi" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { jadwal_id } = body;

    const db = getDb();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Cek udah check-in hari ini?
    const existing = db.prepare(
      "SELECT id, check_in FROM absensi WHERE murid_id = ? AND tanggal = ?"
    ).get(murid.murid_id, today);

    if (existing) {
      return NextResponse.json({ success: false, error: "Sudah check-in hari ini" }, { status: 409 });
    }

    const now = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

    db.prepare(
      "INSERT INTO absensi (murid_id, jadwal_id, check_in, status, tanggal) VALUES (?, ?, ?, 'hadir', ?)"
    ).run(murid.murid_id, jadwal_id || null, now, today);

    return NextResponse.json({
      success: true,
      message: "Check-in berhasil! Selamat menggambar 🎨",
      check_in: now,
    });
  } catch (error) {
    console.error("Checkin error:", error);
    return NextResponse.json({ success: false, error: "Gagal check-in" }, { status: 500 });
  }
}
