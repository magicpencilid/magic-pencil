/* =============================================
   📡 API: /api/kelas — Manage Kelas & Harga
   
   GET  /api/kelas — List semua kelas
   POST /api/kelas — Tambah kelas baru
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT * FROM kelas ORDER BY is_active DESC, name ASC").all();
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json(
      { success: false, errors: ["Gagal mengambil data kelas"] },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const db = getDb();

    if (!body.name?.trim()) {
      return NextResponse.json({ success: false, errors: ["Nama kelas wajib diisi"] }, { status: 400 });
    }
    // Kelas Private boleh tanpa harga (hubungi admin)
    const isPrivate = body.name?.trim().toLowerCase().includes("private");
    if (!isPrivate && (!body.price || body.price < 1)) {
      return NextResponse.json({ success: false, errors: ["Harga wajib diisi"] }, { status: 400 });
    }

    // Cek duplikat
    const existing = db.prepare("SELECT id FROM kelas WHERE name = ?").get(body.name.trim());
    if (existing) {
      return NextResponse.json({ success: false, errors: ["Nama kelas sudah ada"] }, { status: 409 });
    }

    const stmt = db.prepare(
      "INSERT INTO kelas (name, price, description) VALUES (@name, @price, @description)"
    );
    const result = stmt.run({
      name: body.name.trim(),
      price: isPrivate ? 0 : Number(body.price),
      description: body.description?.trim() || null,
    });

    return NextResponse.json({
      success: true,
      data: { id: result.lastInsertRowid, message: "Kelas berhasil ditambahkan" },
    });
  } catch (error) {
    console.error("Error creating kelas:", error);
    return NextResponse.json({ success: false, errors: ["Gagal menambah kelas"] }, { status: 500 });
  }
}
