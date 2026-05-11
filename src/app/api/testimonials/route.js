// API: /api/testimonials — GET (public) + POST (admin upload)

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { processTestimonialImage } from "@/lib/process-testimonial-image";

export async function GET() {
  try {
    const db = getDb();
    const data = db.prepare("SELECT * FROM testimonials ORDER BY created_at ASC").all();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ success: false, errors: ["Gagal mengambil data testimoni"] }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const nama = formData.get("nama")?.trim();
    const teks = formData.get("teks")?.trim();
    const foto = formData.get("foto");

    if (!nama || !teks) {
      return NextResponse.json({ success: false, errors: ["Nama dan teks wajib diisi"] }, { status: 400 });
    }

    const db = getDb();
    let photo_path = null;

    if (foto && foto instanceof Blob) {
      const buffer = Buffer.from(await foto.arrayBuffer());
      const result = await processTestimonialImage(buffer);
      photo_path = `/api/testimonials/image/${result.filename}`;
    }

    const info = db.prepare(
      "INSERT INTO testimonials (nama, teks, photo_path) VALUES (@nama, @teks, @photo_path)"
    ).run({ nama, teks, photo_path });

    return NextResponse.json({
      success: true,
      message: "Testimoni berhasil ditambahkan",
      data: { id: info.lastInsertRowid },
    });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json({ success: false, errors: ["Gagal menambahkan testimoni"] }, { status: 500 });
  }
}
