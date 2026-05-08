/* =============================================
   📡 API: POST /api/pembayaran/upload
   
   User konfirmasi pembayaran + upload bukti transfer.
   Terima FormData: registration_id, notes, file (image)
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const registration_id = formData.get("registration_id");
    const notes = formData.get("notes") || "";
    const file = formData.get("file");

    if (!registration_id) {
      return NextResponse.json(
        { success: false, errors: ["ID pendaftar wajib diisi"] },
        { status: 400 }
      );
    }

    const db = getDb();

    // Cek pendaftar
    const registrant = db.prepare(
      "SELECT id, full_name FROM pendaftar WHERE id = ?"
    ).get(registration_id);

    if (!registrant) {
      return NextResponse.json(
        { success: false, errors: ["Pendaftar tidak ditemukan"] },
        { status: 404 }
      );
    }

    // Cek invoice
    const invoice = db.prepare(
      "SELECT id, invoice_number, amount FROM invoice WHERE registration_id = ? AND payment_status = 'pending' ORDER BY created_at DESC LIMIT 1"
    ).get(registration_id);

    if (!invoice) {
      return NextResponse.json(
        { success: false, errors: ["Tidak ada invoice aktif untuk pendaftar ini"] },
        { status: 400 }
      );
    }

    // Proses upload file
    let fileUrl = null;
    if (file && file instanceof File) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, errors: ["File harus berupa gambar (JPG/PNG/WEBP)"] },
          { status: 400 }
        );
      }

      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, errors: ["Ukuran file maksimal 5 MB"] },
          { status: 400 }
        );
      }

      const ext = path.extname(file.name) || ".jpg";
      const filename = `bukti-${registration_id}-${Date.now()}${ext}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "bukti-bayar");
      const filePath = path.join(uploadDir, filename);
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);
      fileUrl = `/uploads/bukti-bayar/${filename}`;
    }

    // Simpan ke tabel pembayaran
    const stmt = db.prepare(`
      INSERT INTO pembayaran (registration_id, invoice_id, file_url, status, admin_note)
      VALUES (@registration_id, @invoice_id, @file_url, 'pending', @admin_note)
    `);

    stmt.run({
      registration_id: Number(registration_id),
      invoice_id: invoice.id,
      file_url: fileUrl,
      admin_note: notes || null,
    });

    return NextResponse.json({
      success: true,
      data: {
        message: "Konfirmasi pembayaran diterima! Admin akan verifikasi dalam 1x24 jam.",
        invoice_number: invoice.invoice_number,
        amount: invoice.amount,
        file_url: fileUrl,
      },
    });
  } catch (error) {
    console.error("Payment upload error:", error);
    return NextResponse.json(
      { success: false, errors: ["Gagal memproses konfirmasi"] },
      { status: 500 }
    );
  }
}
