/* =============================================
   API: /api/karya — Galeri Karya Murid
   
   GET  /api/karya — List karya (filter: ?murid_id=, ?status=)
   POST /api/karya — Upload karya baru (multipart: file, judul, dll)
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { getKarya } from "@/lib/karya";
import { processImage } from "@/lib/process-image";
import { writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const muridId = searchParams.get("murid_id");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;
    const offset = searchParams.get("offset") ? Number(searchParams.get("offset")) : undefined;

    const rows = getKarya({
      muridId: muridId ? Number(muridId) : undefined,
      status: status || undefined,
      limit,
      offset,
    });

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching karya:", error);
    return NextResponse.json(
      { success: false, errors: ["Gagal mengambil data karya"] },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const murid_id = formData.get("murid_id");
    const judul = formData.get("judul");
    const deskripsi = formData.get("deskripsi") || "";
    const kelas = formData.get("kelas") || "";
    const is_public = formData.get("is_public") === "true" ? 1 : 0;
    const file = formData.get("file");

    // Validasi
    const errors = [];
    if (!murid_id) errors.push("ID murid wajib diisi");
    if (!judul?.trim()) errors.push("Judul karya wajib diisi");
    if (!file || !(file instanceof File)) errors.push("File gambar wajib diupload");
    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const db = getDb();

    // Cek murid
    const murid = db.prepare("SELECT id FROM pendaftar WHERE id = ?").get(Number(murid_id));
    if (!murid) {
      return NextResponse.json({ success: false, errors: ["Murid tidak ditemukan"] }, { status: 404 });
    }

    // Validasi file
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, errors: ["File harus berupa gambar (JPG/PNG/WEBP)"] },
        { status: 400 }
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, errors: ["Ukuran file maksimal 10 MB"] }, { status: 400 });
    }

    // Simpan file — compress + watermark otomatis
    const uploadDir = path.join(process.cwd(), "public", "uploads", "karya");
    if (!existsSync(uploadDir)) {
      const { mkdir } = await import("fs/promises");
      await mkdir(uploadDir, { recursive: true });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const { buffer: processedBuffer, format } = await processImage(buffer);
    const filename = `karya-${murid_id}-${Date.now()}.${format}`;
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, processedBuffer);
    const imagePath = `/uploads/karya/${filename}`;

    // Simpan ke database
    const status = is_public ? "pending" : "private";
    const stmt = db.prepare(`
      INSERT INTO karya_murid (murid_id, judul, deskripsi, kelas, image_path, is_public, status)
      VALUES (@murid_id, @judul, @deskripsi, @kelas, @image_path, @is_public, @status)
    `);

    const result = stmt.run({
      murid_id: Number(murid_id),
      judul: judul.trim(),
      deskripsi: deskripsi.trim() || null,
      kelas: kelas.trim() || null,
      image_path: imagePath,
      is_public,
      status,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        image_path: imagePath,
        status,
        message: is_public
          ? "Karya berhasil diupload! Tunggu persetujuan admin."
          : "Karya berhasil disimpan sebagai privat.",
      },
    });
  } catch (error) {
    console.error("Error creating karya:", error);
    return NextResponse.json(
      { success: false, errors: ["Gagal mengupload karya"] },
      { status: 500 }
    );
  }
}
