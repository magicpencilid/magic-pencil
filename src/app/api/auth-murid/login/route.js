import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { verifyPassword, setSession } from "@/lib/auth-murid";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email dan password wajib diisi" }, { status: 400 });
    }

    const db = getDb();

    // Cari akun
    const akun = db.prepare(`
      SELECT a.id, a.murid_id, a.email, a.password_hash, p.participant_name, p.status
      FROM akun_murid a
      JOIN pendaftar p ON a.murid_id = p.id
      WHERE a.email = ?
    `).get(email);

    if (!akun) {
      return NextResponse.json({ success: false, error: "Email atau password salah" }, { status: 401 });
    }

    if (!verifyPassword(password, akun.password_hash)) {
      return NextResponse.json({ success: false, error: "Email atau password salah" }, { status: 401 });
    }

    // Set session
    await setSession(akun.murid_id);

    return NextResponse.json({
      success: true,
      data: {
        murid_id: akun.murid_id,
        nama: akun.participant_name,
        email: akun.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, error: "Gagal login" }, { status: 500 });
  }
}
