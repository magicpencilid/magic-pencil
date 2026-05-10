/* =============================================
   📡 API: GET /api/pembayaran — Daftar Pembayaran
   
   Support filter: ?status=pending
   Support limit: ?limit=5
   
   PUT: Verifikasi pembayaran + update status
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { sendPushNotification } from "@/lib/push";
import { sendTelegram } from "@/lib/telegram";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = searchParams.get("limit");

    let query = `
      SELECT p.*, r.full_name, r.participant_name, i.invoice_number, i.amount
      FROM pembayaran p
      LEFT JOIN pendaftar r ON p.registration_id = r.id
      LEFT JOIN invoice i ON p.invoice_id = i.id
    `;

    const params = [];

    if (status) {
      query += " WHERE p.status = ?";
      params.push(status);
    }

    query += " ORDER BY p.uploaded_at DESC";

    if (limit) {
      query += " LIMIT ?";
      params.push(parseInt(limit));
    }

    const db = getDb();
    const rows = db.prepare(query).all(...params);

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching pembayaran:", error);
    return NextResponse.json(
      { success: false, errors: ["Gagal mengambil pembayaran"] },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const db = getDb();

    // Update status pembayaran
    db.prepare(`
      UPDATE pembayaran 
      SET status = @status, 
          verified_at = datetime('now', 'localtime'), 
          verified_by = @verified_by, 
          admin_note = @admin_note 
      WHERE id = @id
    `).run({
      id: body.id,
      status: body.status,
      verified_by: body.verified_by || "admin",
      admin_note: body.admin_note || null,
    });

    // Kalo diverifikasi → update pendaftar jadi 'aktif' + invoice jadi 'lunas'
    if (body.status === "verified") {
      const payment = db.prepare(
        "SELECT registration_id, invoice_id FROM pembayaran WHERE id = ?"
      ).get(body.id);

      if (payment) {
        db.prepare(`
          UPDATE pendaftar 
          SET status = 'aktif', updated_at = datetime('now', 'localtime') 
          WHERE id = ?
        `).run(payment.registration_id);

        if (payment.invoice_id) {
          db.prepare(`
            UPDATE invoice 
            SET payment_status = 'lunas', updated_at = datetime('now', 'localtime') 
            WHERE id = ?
          `).run(payment.invoice_id);
        }
      }
    }

    // Notifikasi ke admin kalo ada verifikasi
    if (body.status === "verified") {
      const payment = db.prepare(
        "SELECT p.registration_id, p.invoice_id, r.full_name FROM pembayaran p LEFT JOIN pendaftar r ON p.registration_id = r.id WHERE p.id = ?"
      ).get(body.id);
      
      const notifText = payment?.full_name 
        ? `✅ ${payment.full_name} — pembayaran diverifikasi, status aktif` 
        : `✅ Pembayaran #${body.id} diverifikasi`;
      
      sendPushNotification({
        title: "✅ Pembayaran Diverifikasi",
        body: notifText,
        url: "/admin/pendaftar",
        userType: "admin",
      }).catch(() => {});
      sendTelegram(notifText).catch(() => {});
    }

    return NextResponse.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      { success: false, errors: ["Gagal update"] },
      { status: 500 }
    );
  }
}
