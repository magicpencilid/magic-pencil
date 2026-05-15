/* =============================================
   📡 API: /api/produk — Online Store Produk
   
   GET  /api/produk — List semua produk (aktif utk publik, semua utk admin)
   POST /api/produk — Tambah produk baru (admin)
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "1";
    const db = getDb();

    let rows;
    if (admin) {
      rows = db.prepare("SELECT * FROM produk ORDER BY created_at DESC").all();
    } else {
      rows = db.prepare("SELECT * FROM produk WHERE status = 'aktif' ORDER BY created_at DESC").all();
    }

    // Parse JSON string fields
    rows = rows.map((r) => ({
      ...r,
      ukuran_tersedia: JSON.parse(r.ukuran_tersedia || "[]"),
    }));

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching produk:", error);
    return NextResponse.json(
      { success: false, errors: ["Gagal mengambil data produk"] },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const db = getDb();

    if (!body.nama?.trim()) {
      return NextResponse.json({ success: false, errors: ["Nama produk wajib diisi"] }, { status: 400 });
    }
    if (!body.harga || body.harga < 1) {
      return NextResponse.json({ success: false, errors: ["Harga wajib diisi"] }, { status: 400 });
    }

    const stmt = db.prepare(
      "INSERT INTO produk (nama, deskripsi, harga, gambar, kategori, ukuran_tersedia) VALUES (@nama, @deskripsi, @harga, @gambar, @kategori, @ukuran_tersedia)"
    );
    const result = stmt.run({
      nama: body.nama.trim(),
      deskripsi: body.deskripsi?.trim() || null,
      harga: Number(body.harga),
      gambar: body.gambar || null,
      kategori: body.kategori || "lainnya",
      ukuran_tersedia: JSON.stringify(body.ukuran_tersedia || []),
    });

    return NextResponse.json({
      success: true,
      data: { id: result.lastInsertRowid, message: "Produk berhasil ditambahkan" },
    });
  } catch (error) {
    console.error("Error creating produk:", error);
    return NextResponse.json({ success: false, errors: ["Gagal menambah produk"] }, { status: 500 });
  }
}
