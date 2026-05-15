/* =============================================
   🔑 API: POST /api/murid/[id]/reset-password
   
   Reset password akun murid.
   Generate password baru + hash, return plain.
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { hashPassword, generatePassword } from "@/lib/auth-murid";

export async function POST(request, { params }) {
  try {
    const id = Number(params.id);
    const db = getDb();

    // Cek pendaftar & akun
    const akun = db.prepare(`
      SELECT a.id, a.email, p.participant_name
      FROM akun_murid a
      JOIN pendaftar p ON a.murid_id = p.id
      WHERE a.murid_id = ?
    `).get(id);

    if (!akun) {
      return NextResponse.json(
        { success: false, error: "Murid belum punya akun" },
        { status: 404 }
      );
    }

    const passwordPlain = generatePassword();
    const passwordHash = hashPassword(passwordPlain);

    db.prepare("UPDATE akun_murid SET password_hash = ?, updated_at = datetime('now', 'localtime') WHERE murid_id = ?")
      .run(passwordHash, id);

    return NextResponse.json({
      success: true,
      data: {
        email: akun.email,
        password_plain: passwordPlain,
      },
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal reset password" },
      { status: 500 }
    );
  }
}
