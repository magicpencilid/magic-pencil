import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { getCurrentMurid } from "@/lib/auth-murid";

/**
 * GET /api/invoice/mine — Ambil semua invoice murid yang login
 * Return: { latest (invoice terbaru), invoices[] (semua) }
 */
export async function GET() {
  try {
    const murid = await getCurrentMurid();
    if (!murid) {
      return NextResponse.json({ success: false, error: "Tidak terautentikasi" }, { status: 401 });
    }

    const db = getDb();

    // Ambil SEMUA invoice murid
    const invoices = db.prepare(`
      SELECT i.id, i.invoice_number, i.amount, i.payment_due_date, i.payment_status, i.created_at,
             p.participant_name, p.class_name
      FROM invoice i
      JOIN pendaftar p ON i.registration_id = p.id
      WHERE i.registration_id = ?
      ORDER BY i.created_at DESC
    `).all(murid.murid_id);

    if (invoices.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        invoices: [],
        message: "Belum ada invoice"
      });
    }

    // Ambil status pembayaran tiap invoice
    const allPembayaran = db.prepare(`
      SELECT p.invoice_id, p.status, p.uploaded_at, p.verified_at, p.admin_note
      FROM pembayaran p
      JOIN invoice i ON p.invoice_id = i.id
      WHERE i.registration_id = ?
      ORDER BY p.uploaded_at DESC
    `).all(murid.murid_id);

    // Map pembayaran ke invoice
    const pembayaranMap = {};
    for (const p of allPembayaran) {
      if (!pembayaranMap[p.invoice_id]) {
        pembayaranMap[p.invoice_id] = p;
      }
    }

    const invoicesWithPayment = invoices.map(inv => ({
      ...inv,
      pembayaran: pembayaranMap[inv.id] || null,
    }));

    return NextResponse.json({
      success: true,
      data: invoicesWithPayment[0], // latest (buat dashboard)
      invoices: invoicesWithPayment, // semua (buat halaman riwayat)
      total: invoicesWithPayment.length,
    });
  } catch (error) {
    console.error("Invoice mine error:", error);
    return NextResponse.json({ success: false, error: "Gagal memuat invoice" }, { status: 500 });
  }
}
