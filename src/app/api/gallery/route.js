/* =============================================
   API: /api/gallery — Galeri Foto
   
   GET   — List foto (gallery_photos + karya approved)
   POST  — Upload foto baru (admin only, multipart)
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { isAuthenticated } from "@/lib/auth";
import { processImage } from "@/lib/process-image";
import { writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

/* =============================================
   GET — Ambil semua foto
   Gabung: gallery_photos (willy) + karya approved (murid)
   ============================================= */
export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const homepage = searchParams.get("homepage");

    let willyQuery = `
      SELECT id, title, deskripsi, image_path, show_on_homepage, 'willy' as source, created_at
      FROM gallery_photos
    `;

    if (homepage === "1") {
      willyQuery += ` WHERE show_on_homepage = 1 ORDER BY created_at DESC LIMIT 6`;
    } else {
      willyQuery += ` ORDER BY created_at DESC`;
    }

    // Ambil foto willy
    const willyPhotos = db.prepare(willyQuery).all();

    // Ambil karya murid yang approved
    const muridKarya = db.prepare(`
      SELECT k.id, k.judul as title, k.deskripsi, k.image_path, 'murid' as source,
             COALESCE(p.participant_name, 'Murid') as participant_name, k.kelas, k.created_at
      FROM karya_murid k
      LEFT JOIN pendaftar p ON p.id = k.murid_id
      WHERE k.status = 'approved'
      ORDER BY k.created_at DESC
    `).all();

    // Transform gallery photo paths pake proxy biar gak kena cache issue Next.js
    const willyWithProxy = willyPhotos.map((p) => ({
      ...p,
      image_path: `/api/gallery/image${p.image_path}`,
    }));

    return NextResponse.json({
      success: true,
      data: {
        willy: willyWithProxy,
        murid: muridKarya,
      },
    });
  } catch (error) {
    console.error("Error fetching gallery:", error?.message || error, "\nStack:", error?.stack?.substring(0, 500));
    return NextResponse.json(
      { success: false, errors: [error?.message || "Gagal mengambil data galeri"] },
      { status: 500 }
    );
  }
}

/* =============================================
   POST — Upload foto baru (admin only)
   ============================================= */
export async function POST(request) {
  try {
    // Cek admin auth
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ success: false, errors: ["Unauthorized"] }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get("title");
    const deskripsi = formData.get("deskripsi") || "";
    const show_homepage = formData.get("show_homepage") === "1" ? 1 : 0;

    // Limit check: max 6 foto di Beranda
    if (show_homepage === 1) {
      const db = getDb();
      const currentCount = db.prepare("SELECT COUNT(*) as count FROM gallery_photos WHERE show_on_homepage = 1").get();
      if (currentCount.count >= 6) {
        return NextResponse.json({
          success: false,
          errors: ["Maksimal 6 foto yang bisa ditampilkan di Beranda. Hapus centang dari foto lain dulu."]
        }, { status: 400 });
      }
    }

    const file = formData.get("file");

    // Validasi
    const errors = [];
    if (!title?.trim()) errors.push("Judul foto wajib diisi");
    if (!file || !(file instanceof File)) errors.push("File gambar wajib diupload");
    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Validasi file
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, errors: ["File harus berupa gambar (JPG/PNG/WEBP)"] },
        { status: 400 }
      );
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, errors: ["Ukuran file maksimal 5 MB"] }, { status: 400 });
    }

    // Simpan file — compress + watermark otomatis
    const uploadDir = path.join(process.cwd(), "public", "uploads", "gallery");
    if (!existsSync(uploadDir)) {
      const { mkdir } = await import("fs/promises");
      await mkdir(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { buffer: processedBuffer, format } = await processImage(buffer);
    const filename = `gallery-${Date.now()}.${format}`;
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, processedBuffer);
    const imagePath = `/uploads/gallery/${filename}`;

    // Simpan ke database
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO gallery_photos (title, deskripsi, image_path, show_on_homepage)
      VALUES (@title, @deskripsi, @image_path, @show_on_homepage)
    `);

    const result = stmt.run({
      title: title.trim(),
      deskripsi: deskripsi.trim() || null,
      image_path: imagePath,
      show_on_homepage: show_homepage,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        image_path: imagePath,
        message: "Foto berhasil diupload!",
      },
    });
  } catch (error) {
    console.error("Error uploading gallery photo:", error?.message || error);
    return NextResponse.json(
      { success: false, errors: [error?.message || "Gagal mengupload foto"] },
      { status: 500 }
    );
  }
}
