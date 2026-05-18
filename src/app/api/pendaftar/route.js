/* =============================================
   API: GET /api/pendaftar - List Pendaftar
   
   Query params:
   - page   (optional, int) - paginated response
   - limit  (optional, int, default 20)
   - search (optional, string) - filter nama/WA
   - status (optional, string) - filter status
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const db = getDb();

    // Jika ada page - paginated
    if (searchParams.has("page")) {
      const page = Math.max(1, Number(searchParams.get("page")) || 1);
      const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
      const offset = (page - 1) * limit;

      const total = db.prepare("SELECT COUNT(*) as count FROM pendaftar").get().count;
      const rows = db.prepare(
        "SELECT * FROM pendaftar ORDER BY created_at DESC LIMIT ? OFFSET ?"
      ).all(limit, offset);

      return NextResponse.json({
        success: true,
        data: rows,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }

    // Tanpa page -> return semua (backward compat)
    const rows = db.prepare("SELECT * FROM pendaftar ORDER BY created_at DESC").all();
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching pendaftar:", error);
    return NextResponse.json(
      { success: false, errors: ["Gagal mengambil data"] },
      { status: 500 }
    );
  }
}
