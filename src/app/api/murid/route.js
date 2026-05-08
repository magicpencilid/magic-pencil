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

    let query = `SELECT * FROM pendaftar`;
    const params = [];

    const conditions = [];
    if (status) {
      conditions.push("status = ?");
      params.push(status);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY created_at DESC";

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
