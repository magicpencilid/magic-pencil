/* =============================================
   📡 API: PUT/DELETE /api/pendaftar/[id]
   
   PUT  — update status pendaftar
   DELETE — hapus data pendaftar
   
   [id] = dynamic route — id dikirim via URL
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";

/* 🔄 UPDATE data pendaftar (status + field lainnya) */
export async function PUT(request, { params }) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    const db = getDb();

    /* Cek apakah data ada */
    const existing = db.prepare("SELECT id FROM pendaftar WHERE id = ?").get(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, errors: ["Data tidak ditemukan"] },
        { status: 404 }
      );
    }

    /* Kumpulin field yang dikirim */
    const fieldMap = {
      status: "status",
      full_name: "full_name",
      participant_name: "participant_name",
      whatsapp: "whatsapp",
      email: "email",
      alamat: "alamat",
      class_name: "class_name",
      notes: "notes",
      age: "age",
      source: "source",
    };

    const updates = [];
    const values = {};

    for (const [key, col] of Object.entries(fieldMap)) {
      if (body[key] !== undefined && body[key] !== null) {
        updates.push(`${col} = @${key}`);
        values[key] = body[key];
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, errors: ["Tidak ada data yang diupdate"] },
        { status: 400 }
      );
    }

    updates.push("updated_at = datetime('now', 'localtime')");

    const sql = `UPDATE pendaftar SET ${updates.join(", ")} WHERE id = @id`;
    values.id = id;

    db.prepare(sql).run(values);

    return NextResponse.json({ success: true, message: "Data berhasil diupdate" });
  } catch (error) {
    console.error("Error updating pendaftar:", error);
    return NextResponse.json(
      { success: false, errors: ["Gagal mengupdate data"] },
      { status: 500 }
    );
  }
}

/* 🗑️ HAPUS pendaftar */
export async function DELETE(request, { params }) {
  try {
    const id = Number(params.id);
    const db = getDb();

    const existing = db.prepare("SELECT id FROM pendaftar WHERE id = ?").get(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, errors: ["Data tidak ditemukan"] },
        { status: 404 }
      );
    }

    db.prepare("DELETE FROM pendaftar WHERE id = ?").run(id);

    return NextResponse.json({ success: true, message: "Data berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting pendaftar:", error);
    return NextResponse.json(
      { success: false, errors: ["Gagal menghapus data"] },
      { status: 500 }
    );
  }
}
