/* =============================================
   📡 API: GET /api/murid — Data Murid
   
   Ngambil semua data pendaftar.
   Support filter: ?status=aktif&limit=10
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = searchParams.get("limit");

    let query = `
      SELECT p.*, a.id AS akun_id, a.email AS akun_email, a.password_plain AS akun_password
      FROM pendaftar p
      LEFT JOIN akun_murid a ON a.murid_id = p.id
    `;
    const params = [];

    const conditions = [];
    if (status) {
      conditions.push("p.status = ?");
      params.push(status);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY p.created_at DESC";

    if (limit) {
      query += " LIMIT ?";
      params.push(parseInt(limit));
    }

    const db = getDb();
    const rows = db.prepare(query).all(...params);

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching murid:", error);
    return NextResponse.json(
      { success: false, errors: ["Gagal mengambil data murid"] },
      { status: 500 }
    );
  }
}
