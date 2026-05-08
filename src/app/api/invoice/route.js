/* =============================================
   📡 API: GET /api/invoice — List invoice
        POST /api/invoice — Generate invoice baru
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";

/* 🔍 GET: List semua invoice */
export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare(`
      SELECT i.*, p.full_name, p.participant_name
      FROM invoice i
      LEFT JOIN pendaftar p ON i.registration_id = p.id
      ORDER BY i.created_at DESC
    `).all();

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json(
      { success: false, errors: ["Gagal mengambil invoice"] },
      { status: 500 }
    );
  }
}

/* 🆕 POST: Generate invoice untuk pendaftar */
export async function POST(request) {
  try {
    const body = await request.json();
    const db = getDb();

    // Cek pendaftar
    const registrant = db.prepare("SELECT * FROM pendaftar WHERE id = ?").get(body.registration_id);
    if (!registrant) {
      return NextResponse.json(
        { success: false, errors: ["Pendaftar tidak ditemukan"] },
        { status: 404 }
      );
    }

    // Generate nomor invoice: INV-{YYYYMMDD}-{ID}
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const invoiceNumber = `INV-${dateStr}-${body.registration_id}`;

    // Ambil harga dari tabel kelas
    const kelas = db.prepare("SELECT price FROM kelas WHERE name = ?").get(registrant.class_name);
    const amount = body.amount || kelas?.price || 500000;

    const stmt = db.prepare(`
      INSERT INTO invoice (registration_id, invoice_number, amount, payment_due_date, payment_status)
      VALUES (@registration_id, @invoice_number, @amount, @payment_due_date, 'pending')
    `);

    // Due date: 7 hari dari sekarang
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString().slice(0, 10);

    const result = stmt.run({
      registration_id: body.registration_id,
      invoice_number: invoiceNumber,
      amount,
      payment_due_date: dueDate,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        invoice_number: invoiceNumber,
        amount,
        payment_due_date: dueDate,
      },
    });
  } catch (error) {
    console.error("Invoice generation error:", error);
    return NextResponse.json(
      { success: false, errors: ["Gagal membuat invoice"] },
      { status: 500 }
    );
  }
}
