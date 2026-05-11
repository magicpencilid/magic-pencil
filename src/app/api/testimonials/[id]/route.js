// API: /api/testimonials/[id] — DELETE admin

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import fs from "fs";
import path from "path";

export async function DELETE(request, props) {
  try {
    const params = await props.params;
    const id = Number(params.id);
    const db = getDb();

    const data = db.prepare("SELECT * FROM testimonials WHERE id = ?").get(id);
    if (!data) {
      return NextResponse.json({ success: false, errors: ["Testimoni tidak ditemukan"] }, { status: 404 });
    }

    // Hapus file foto kalo ada
    if (data.photo_path) {
      const filename = data.photo_path.split("/").pop();
      const filePath = path.join(process.cwd(), "public", "uploads", "testimonials", filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    db.prepare("DELETE FROM testimonials WHERE id = ?").run(id);
    return NextResponse.json({ success: true, message: "Testimoni berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json({ success: false, errors: ["Gagal menghapus testimoni"] }, { status: 500 });
  }
}
