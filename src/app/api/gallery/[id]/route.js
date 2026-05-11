/* =============================================
   📡 API: /api/gallery/[id] — Hapus Foto Galeri
   
   DELETE — Hapus foto dari gallery_photos (admin only)
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { isAuthenticated } from "@/lib/auth";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(request, props) {
  try {
    // Cek admin auth
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ success: false, errors: ["Unauthorized"] }, { status: 401 });
    }

    const params = await props.params;
    const id = Number(params.id);
    const db = getDb();

    const photo = db.prepare("SELECT * FROM gallery_photos WHERE id = ?").get(id);
    if (!photo) {
      return NextResponse.json({ success: false, errors: ["Foto tidak ditemukan"] }, { status: 404 });
    }

    // Hapus file gambar
    if (photo.image_path) {
      const filePath = path.join(process.cwd(), "public", photo.image_path);
      try { await unlink(filePath); } catch { /* file mungkin udah ilang */ }
    }

    db.prepare("DELETE FROM gallery_photos WHERE id = ?").run(id);

    return NextResponse.json({ success: true, message: "Foto berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting gallery photo:", error);
    return NextResponse.json({ success: false, errors: ["Gagal hapus foto"] }, { status: 500 });
  }
}
