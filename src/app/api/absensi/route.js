import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { getCurrentMurid } from "@/lib/auth-murid";

/**
 * GET /api/absensi — Riwayat absensi murid yang login
 * GET /api/absensi?murid_id=123 — Filter spesifik (admin)
 * GET /api/absensi?tanggal=2026-05-08 — Filter tanggal
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filterMuridId = searchParams.get("murid_id");
    const filterTanggal = searchParams.get("tanggal");

    const db = getDb();

    let murid_id = null;

    // Kalo ada filter murid_id, admin yang akses
    if (filterMuridId) {
      murid_id = parseInt(filterMuridId);
    } else {
      // Murid biasa — ambil dari session
      const murid = await getCurrentMurid();
      if (!murid) {
        return NextResponse.json({ success: false, error: "Tidak terautentikasi" }, { status: 401 });
      }
      murid_id = murid.murid_id;
    }

    let query = `
      SELECT a.id, a.murid_id, a.jadwal_id, a.check_in, a.check_out, a.status, a.tanggal,
             p.participant_name, p.class_name
      FROM absensi a
      JOIN pendaftar p ON a.murid_id = p.id
      WHERE a.murid_id = ?
    `;
    const params = [murid_id];

    if (filterTanggal) {
      query += " AND a.tanggal = ?";
      params.push(filterTanggal);
    }

    query += " ORDER BY a.tanggal DESC, a.id DESC";

    const rows = db.prepare(query).all(...params);

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Absensi GET error:", error);
    return NextResponse.json({ success: false, error: "Gagal memuat absensi" }, { status: 500 });
  }
}
