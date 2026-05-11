/* =============================================
   📡 API: /api/karya/[id]
   
   GET   — Detail karya
   PATCH — Update karya (judul, deskripsi, kelas, is_public)
   DELETE— Hapus karya
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { getKaryaById } from "@/lib/karya";
import { unlink } from "fs/promises";
import path from "path";

export async function GET(request, props) {
  try {
    const params = await props.params;
    const id = Number(params.id);
    const karya = getKaryaById(id);

    if (!karya) {
      return NextResponse.json({ success: false, errors: ["Karya tidak ditemukan"] }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: karya });
  } catch (error) {
    console.error("Error fetching karya:", error);
    return NextResponse.json({ success: false, errors: ["Gagal mengambil detail karya"] }, { status: 500 });
  }
}

export async function PATCH(request, props) {
  try {
    const params = await props.params;
    const id = Number(params.id);
    const body = await request.json();
    const db = getDb();

    const karya = db.prepare("SELECT * FROM karya_murid WHERE id = ?").get(id);
    if (!karya) {
      return NextResponse.json({ success: false, errors: ["Karya tidak ditemukan"] }, { status: 404 });
    }

    const updates = [];
    const values = { id };

    if (body.judul !== undefined) { updates.push("judul = @judul"); values.judul = body.judul.trim(); }
    if (body.deskripsi !== undefined) { updates.push("deskripsi = @deskripsi"); values.deskripsi = body.deskripsi; }
    if (body.kelas !== undefined) { updates.push("kelas = @kelas"); values.kelas = body.kelas; }
    if (body.is_public !== undefined) {
      const isPublic = body.is_public ? 1 : 0;
      updates.push("is_public = @is_public");
      values.is_public = isPublic;
      // Kalau ubah ke publik, set status ke pending
      if (isPublic && karya.status === "private") {
        updates.push("status = 'pending'");
      }
      // Kalau ubah ke private, set status ke private
      if (!isPublic && (karya.status === "pending" || karya.status === "rejected")) {
        updates.push("status = 'private'");
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, errors: ["Tidak ada data yang diupdate"] }, { status: 400 });
    }

    updates.push("updated_at = datetime('now', 'localtime')");
    db.prepare(`UPDATE karya_murid SET ${updates.join(", ")} WHERE id = @id`).run(values);

    return NextResponse.json({ success: true, message: "Karya berhasil diupdate" });
  } catch (error) {
    console.error("Error updating karya:", error);
    return NextResponse.json({ success: false, errors: ["Gagal update karya"] }, { status: 500 });
  }
}

export async function DELETE(request, props) {
  try {
    const params = await props.params;
    const id = Number(params.id);
    const db = getDb();

    const karya = db.prepare("SELECT * FROM karya_murid WHERE id = ?").get(id);
    if (!karya) {
      return NextResponse.json({ success: false, errors: ["Karya tidak ditemukan"] }, { status: 404 });
    }

    // Hapus file gambar
    if (karya.image_path) {
      const filePath = path.join(process.cwd(), "public", karya.image_path);
      try { await unlink(filePath); } catch {}
    }

    db.prepare("DELETE FROM karya_murid WHERE id = ?").run(id);

    return NextResponse.json({ success: true, message: "Karya berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting karya:", error);
    return NextResponse.json({ success: false, errors: ["Gagal hapus karya"] }, { status: 500 });
  }
}
