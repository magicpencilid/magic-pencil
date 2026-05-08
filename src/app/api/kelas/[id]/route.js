/* =============================================
   📡 API: /api/kelas/[id]
   
   PUT    — Update kelas (nama, harga, deskripsi)
   DELETE — Hapus kelas
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";

export async function PUT(request, { params }) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    const db = getDb();

    const updates = [];
    const values = { id };

    if (body.name !== undefined) { updates.push("name = @name"); values.name = body.name; }
    if (body.price !== undefined) { updates.push("price = @price"); values.price = Number(body.price); }
    if (body.description !== undefined) { updates.push("description = @description"); values.description = body.description; }
    if (body.is_active !== undefined) { updates.push("is_active = @is_active"); values.is_active = body.is_active ? 1 : 0; }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, errors: ["Tidak ada data yang diupdate"] }, { status: 400 });
    }

    db.prepare(`UPDATE kelas SET ${updates.join(", ")} WHERE id = @id`).run(values);

    return NextResponse.json({ success: true, message: "Kelas berhasil diupdate" });
  } catch (error) {
    console.error("Error updating kelas:", error);
    return NextResponse.json({ success: false, errors: ["Gagal update kelas"] }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = Number(params.id);
    const db = getDb();

    // Cek apakah ada pendaftar pake kelas ini
    const kelas = db.prepare("SELECT name FROM kelas WHERE id = ?").get(id);
    if (!kelas) {
      return NextResponse.json({ success: false, errors: ["Kelas tidak ditemukan"] }, { status: 404 });
    }

    const used = db.prepare("SELECT COUNT(*) as count FROM pendaftar WHERE class_name = ?").get(kelas.name);
    if (used.count > 0) {
      return NextResponse.json({
        success: false,
        errors: [`Tidak bisa hapus — ${used.count} pendaftar terdaftar di kelas "${kelas.name}"`],
      }, { status: 409 });
    }

    db.prepare("DELETE FROM kelas WHERE id = ?").run(id);

    return NextResponse.json({ success: true, message: "Kelas berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting kelas:", error);
    return NextResponse.json({ success: false, errors: ["Gagal hapus kelas"] }, { status: 500 });
  }
}
