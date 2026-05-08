/* =============================================
   📡 API: DELETE /api/schedule-config/[id]
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";

export async function DELETE(request, { params }) {
  try {
    const id = Number(params.id);
    const db = getDb();
    const item = db.prepare("SELECT * FROM schedule_config WHERE id = ?").get(id);
    if (!item) {
      return NextResponse.json({ success: false, errors: ["Data tidak ditemukan"] }, { status: 404 });
    }
    db.prepare("DELETE FROM schedule_config WHERE id = ?").run(id);
    return NextResponse.json({ success: true, message: "Berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ success: false, errors: ["Gagal hapus"] }, { status: 500 });
  }
}
