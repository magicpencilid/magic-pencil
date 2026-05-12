// API: /api/testimonials — GET (public) + POST (admin)

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";

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
    const body = await request.json();
    const nama = body.nama?.trim();
    const teks = body.teks?.trim();

    if (!nama || !teks) {
      return NextResponse.json({ success: false, errors: ["Nama dan teks wajib diisi"] }, { status: 400 });
    }

    const db = getDb();
    const info = db.prepare(
      "INSERT INTO testimonials (nama, teks) VALUES (@nama, @teks)"
    ).run({ nama, teks });

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
