/* =============================================
   📡 API: GET /api/stats — Statistik Dashboard
   
   Ngambil data: total pendaftar, per status,
   per kelas, per bulan, pending verifikasi.
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";

export async function GET() {
  try {
    const db = getDb();

    const total = db.prepare("SELECT COUNT(*) as count FROM pendaftar").get();
    const byStatus = db.prepare(
      "SELECT status, COUNT(*) as count FROM pendaftar GROUP BY status ORDER BY count DESC"
    ).all();
    const byClass = db.prepare(
      "SELECT class_name, COUNT(*) as count FROM pendaftar GROUP BY class_name ORDER BY count DESC"
    ).all();
    const today = db.prepare(
      "SELECT COUNT(*) as count FROM pendaftar WHERE date(created_at) = date('now', 'localtime')"
    ).get();
    const pendingVerifikasi = db.prepare(
      "SELECT COUNT(*) as count FROM pembayaran WHERE status = 'pending'"
    ).get();
    const totalRevenue = db.prepare(
      "SELECT COALESCE(SUM(i.amount), 0) as total FROM invoice i WHERE i.payment_status = 'lunas'"
    ).get();
    const pendingInvoice = db.prepare(
      "SELECT COUNT(*) as count FROM invoice WHERE payment_status = 'pending'"
    ).get();
    const verifiedStudents = db.prepare(
      "SELECT id, full_name, participant_name, class_name, status FROM pendaftar WHERE status = 'aktif' ORDER BY updated_at DESC"
    ).all();

    return NextResponse.json({
      success: true,
      data: {
        total: total.count,
        today: today.count,
        byStatus,
        byClass,
        pendingVerifikasi: pendingVerifikasi.count,
        pendingInvoice: pendingInvoice.count,
        totalRevenue: totalRevenue.total,
        verifiedStudents,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, errors: ["Gagal mengambil statistik"] },
      { status: 500 }
    );
  }
}
