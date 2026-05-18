/* =============================================
   API: /api/produk/upload — Upload gambar produk
   
   POST — Upload gambar + simpan path
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync, unlinkSync } from "fs";
import path from "path";
import { Jimp } from "jimp";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const produkId = formData.get("produk_id");
    const file = formData.get("file");

    if (!produkId) {
      return NextResponse.json({ success: false, errors: ["ID produk wajib diisi"] }, { status: 400 });
    }
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, errors: ["File gambar wajib diupload"] }, { status: 400 });
    }

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

    const db = getDb();
    const produk = db.prepare("SELECT id FROM produk WHERE id = ?").get(Number(produkId));
    if (!produk) {
      return NextResponse.json({ success: false, errors: ["Produk tidak ditemukan"] }, { status: 404 });
    }

    // Simpan file
    const uploadDir = path.join(process.cwd(), "public", "uploads", "produk");
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // Simpan file sementara + kompres ke JPEG
    const rawExt = file.name.split(".").pop() || "jpg";
    const rawFilename = `produk-${produkId}-${Date.now()}.${rawExt}`;
    const rawPath = path.join(uploadDir, rawFilename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(rawPath, buffer);

    // Kompres pake Jimp: resize max 800px + quality 80
    let compressedPath = rawPath;
    let imagePath = `/uploads/produk/${rawFilename}`;
    try {
      const image = await Jimp.read(rawPath);
      if (image.bitmap.width > 800) image.resize({ w: 800 });
      const jpgFilename = rawFilename.replace(/\.[^.]+$/, ".jpg");
      const jpgPath = path.join(uploadDir, jpgFilename);
      const compressed = await image.getBuffer("image/jpeg", { quality: 80 });
      await writeFile(jpgPath, compressed);
      unlinkSync(rawPath); // hapus file asli
      compressedPath = jpgPath;
      imagePath = `/uploads/produk/${jpgFilename}`;
    } catch (jimpErr) {
      console.error("Jimp compression failed, saving raw:", jimpErr.message);
      // fallback: pake file asli kalo kompresi gagal
    }

    // Update produk
    db.prepare("UPDATE produk SET gambar = ? WHERE id = ?").run(imagePath, Number(produkId));

    return NextResponse.json({
      success: true,
      data: { gambar: imagePath, message: "Gambar berhasil diupload" },
    });
  } catch (error) {
    console.error("Error uploading produk image:", error);
    return NextResponse.json(
      { success: false, errors: ["Gagal mengupload gambar"] },
      { status: 500 }
    );
  }
}
