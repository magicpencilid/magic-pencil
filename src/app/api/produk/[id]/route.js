/* =============================================
   📡 API: /api/produk/[id] — Single Produk
   
   GET    — Detail produk
   PUT    — Update produk
   DELETE — Hapus produk
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";

export async function GET(request, props) {
  try {
    const params = await props.params;
    const id = Number(params.id);
    const db = getDb();

    const produk = db.prepare("SELECT * FROM produk WHERE id = ?").get(id);
    if (!produk) {
      return NextResponse.json({ success: false, errors: ["Produk tidak ditemukan"] }, { status: 404 });
    }

    produk.ukuran_tersedia = JSON.parse(produk.ukuran_tersedia || "[]");

    return NextResponse.json({ success: true, data: produk });
  } catch (error) {
    console.error("Error fetching produk:", error);
    return NextResponse.json(
      { success: false, errors: ["Gagal mengambil data produk"] },
      { status: 500 }
    );
  }
}

export async function PUT(request, props) {
  try {
    const params = await props.params;
    const id = Number(params.id);
    const body = await request.json();
    const db = getDb();

    const existing = db.prepare("SELECT id FROM produk WHERE id = ?").get(id);
    if (!existing) {
      return NextResponse.json({ success: false, errors: ["Produk tidak ditemukan"] }, { status: 404 });
    }

    const updates = [];
    const values = { id };

    if (body.nama !== undefined) { updates.push("nama = @nama"); values.nama = body.nama.trim(); }
    if (body.deskripsi !== undefined) { updates.push("deskripsi = @deskripsi"); values.deskripsi = body.deskripsi?.trim() || null; }
    if (body.harga !== undefined) { updates.push("harga = @harga"); values.harga = Number(body.harga); }
    if (body.gambar !== undefined) { updates.push("gambar = @gambar"); values.gambar = body.gambar || null; }
    if (body.kategori !== undefined) { updates.push("kategori = @kategori"); values.kategori = body.kategori; }
    if (body.ukuran_tersedia !== undefined) { updates.push("ukuran_tersedia = @ukuran_tersedia"); values.ukuran_tersedia = JSON.stringify(body.ukuran_tersedia); }
    if (body.status !== undefined) { updates.push("status = @status"); values.status = body.status; }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, errors: ["Tidak ada data yang diupdate"] }, { status: 400 });
    }

    db.prepare(`UPDATE produk SET ${updates.join(", ")} WHERE id = @id`).run(values);

    return NextResponse.json({ success: true, message: "Produk berhasil diupdate" });
  } catch (error) {
    console.error("Error updating produk:", error);
    return NextResponse.json({ success: false, errors: ["Gagal update produk"] }, { status: 500 });
  }
}

export async function DELETE(request, props) {
  try {
    const params = await props.params;
    const id = Number(params.id);
    const db = getDb();

    const existing = db.prepare("SELECT id FROM produk WHERE id = ?").get(id);
    if (!existing) {
      return NextResponse.json({ success: false, errors: ["Produk tidak ditemukan"] }, { status: 404 });
    }

    db.prepare("DELETE FROM produk WHERE id = ?").run(id);

    return NextResponse.json({ success: true, message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting produk:", error);
    return NextResponse.json({ success: false, errors: ["Gagal hapus produk"] }, { status: 500 });
  }
}
