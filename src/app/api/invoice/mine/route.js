import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { getCurrentMurid } from "@/lib/auth-murid";

/**
 * GET /api/invoice/mine — Ambil invoice murid yang login
 * Return: data invoice + status pembayaran terbaru
 */
export async function GET() {
  try {
    const murid = await getCurrentMurid();
    if (!murid) {
      return NextResponse.json({ success: false, error: "Tidak terautentikasi" }, { status: 401 });
    }

    const db = getDb();

    // Ambil invoice berdasarkan registration_id (= murid.murid_id)
    const invoice = db.prepare(`
      SELECT i.id, i.invoice_number, i.amount, i.payment_due_date, i.payment_status, i.created_at,
             p.participant_name, p.class_name
      FROM invoice i
      JOIN pendaftar p ON i.registration_id = p.id
      WHERE i.registration_id = ?
      ORDER BY i.created_at DESC
      LIMIT 1
    `).get(murid.murid_id);

    if (!invoice) {
      return NextResponse.json({
        success: true,
        data: null,
        message: "Belum ada invoice"
      });
    }

    // Ambil status pembayaran terbaru (kalo ada)
    const pembayaran = db.prepare(`
      SELECT status, uploaded_at, verified_at, admin_note
      FROM pembayaran
      WHERE registration_id = ?
      ORDER BY uploaded_at DESC
      LIMIT 1
    `).get(murid.murid_id);

    return NextResponse.json({
      success: true,
      data: {
        ...invoice,
        pembayaran: pembayaran || null,
      }
    });
  } catch (error) {
    console.error("Invoice mine error:", error);
    return NextResponse.json({ success: false, error: "Gagal memuat invoice" }, { status: 500 });
  }
}
