import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { getCurrentMurid } from "@/lib/auth-murid";

/**
 * GET /api/absensi/hari-ini — Status absensi hari ini
 * Return: { check_in, check_out, status } atau null kalo belum
 */
export async function GET() {
  try {
    const murid = await getCurrentMurid();
    if (!murid) {
      return NextResponse.json({ success: false, error: "Tidak terautentikasi" }, { status: 401 });
    }

    const db = getDb();
    const today = new Date().toISOString().split("T")[0];

    const absen = db.prepare(
      "SELECT id, check_in, check_out, status FROM absensi WHERE murid_id = ? AND tanggal = ?"
    ).get(murid.murid_id, today);

    return NextResponse.json({
      success: true,
      data: absen || null,
      today,
    });
  } catch (error) {
    console.error("Hari ini error:", error);
    return NextResponse.json({ success: false, error: "Gagal memuat" }, { status: 500 });
  }
}
