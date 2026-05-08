import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { getCurrentMurid } from "@/lib/auth-murid";

/**
 * POST /api/absensi/checkout
 */
export async function POST(request) {
  try {
    const murid = await getCurrentMurid();
    if (!murid) {
      return NextResponse.json({ success: false, error: "Tidak terautentikasi" }, { status: 401 });
    }

    const db = getDb();
    const today = new Date().toISOString().split("T")[0];

    // Cari absensi hari ini
    const absen = db.prepare(
      "SELECT id, check_in, check_out FROM absensi WHERE murid_id = ? AND tanggal = ?"
    ).get(murid.murid_id, today);

    if (!absen) {
      return NextResponse.json({ success: false, error: "Belum check-in hari ini" }, { status: 400 });
    }

    if (absen.check_out) {
      return NextResponse.json({ success: false, error: "Sudah check-out hari ini" }, { status: 409 });
    }

    const now = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

    db.prepare("UPDATE absensi SET check_out = ? WHERE id = ?").run(now, absen.id);

    return NextResponse.json({
      success: true,
      message: "Check-out berhasil! Sampai jumpa lagi 🎨",
      check_out: now,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ success: false, error: "Gagal check-out" }, { status: 500 });
  }
}
