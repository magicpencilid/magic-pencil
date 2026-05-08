import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { hashPassword } from "@/lib/auth-murid";

export async function POST(request) {
  try {
    const { murid_id, email, password } = await request.json();

    if (!murid_id || !password) {
      return NextResponse.json({ success: false, error: "murid_id dan password wajib diisi" }, { status: 400 });
    }

    const db = getDb();

    // Cek murid ada & statusnya aktif
    const murid = db.prepare("SELECT id, participant_name, status FROM pendaftar WHERE id = ?").get(murid_id);
    if (!murid) {
      return NextResponse.json({ success: false, error: "Murid tidak ditemukan" }, { status: 404 });
    }

    // Cek udah punya akun
    const existing = db.prepare("SELECT id FROM akun_murid WHERE murid_id = ?").get(murid_id);
    if (existing) {
      return NextResponse.json({ success: false, error: "Murid ini sudah punya akun" }, { status: 409 });
    }

    const passwordHash = hashPassword(password);

    db.prepare("INSERT INTO akun_murid (murid_id, email, password_hash) VALUES (?, ?, ?)").run(
      murid_id,
      email || null,
      passwordHash
    );

    return NextResponse.json({
      success: true,
      message: "Akun berhasil dibuat",
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ success: false, error: "Gagal membuat akun" }, { status: 500 });
  }
}
