/* =============================================
   API: /api/karya/[id]/approve
   
   POST  — Approve / reject karya publik
   Body: { action: "approve" | "reject", admin: "nama" }
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";

export async function POST(request, props) {
  try {
    const params = await props.params;
    const id = Number(params.id);
    const text = await request.text();
    const body = JSON.parse(text);
    const db = getDb();

    if (!body.action || !["approve", "reject"].includes(body.action)) {
      return NextResponse.json({ success: false, errors: ["Action harus 'approve' atau 'reject'"] }, { status: 400 });
    }
    if (!body.admin?.trim()) {
      return NextResponse.json({ success: false, errors: ["Nama admin wajib diisi"] }, { status: 400 });
    }

    const karya = db.prepare("SELECT * FROM karya_murid WHERE id = ? AND status = 'pending'").get(id);
    if (!karya) {
      return NextResponse.json({ success: false, errors: ["Karya tidak ditemukan atau sudah diproses"] }, { status: 404 });
    }

    const newStatus = body.action === "approve" ? "approved" : "rejected";
    db.prepare(`
      UPDATE karya_murid
      SET status = @status, approved_by = @admin, approved_at = datetime('now', 'localtime'), updated_at = datetime('now', 'localtime')
      WHERE id = @id
    `).run({ id, status: newStatus, admin: body.admin.trim() });

    return NextResponse.json({
      success: true,
      message: body.action === "approve" ? "Karya berhasil disetujui" : "Karya ditolak",
      data: { status: newStatus },
    });
  } catch (error) {
    console.error("Error approving karya:", error);
    return NextResponse.json({ success: false, errors: ["Gagal memproses karya"] }, { status: 500 });
  }
}
