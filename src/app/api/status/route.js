/* =============================================
   📡 API: GET /api/status?wa=0812345
   
   Cek status pendaftaran berdasarkan nomor WA.
   Kalo ada invoice, ikut ditampilkan.
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";

export async function GET(request) {
  try {
    const wa = request.nextUrl.searchParams.get("wa");
    if (!wa) {
      return NextResponse.json(
        { success: false, errors: ["Masukkan nomor WhatsApp"] },
        { status: 400 }
      );
    }

    const db = getDb();
    const registrant = db.prepare(
      "SELECT * FROM pendaftar WHERE whatsapp = ? ORDER BY created_at DESC LIMIT 1"
    ).get(wa.trim());

    if (!registrant) {
      return NextResponse.json(
        { success: false, errors: ["Data tidak ditemukan untuk nomor tersebut"] },
        { status: 404 }
      );
    }

    // Cari invoice kalo ada
    const invoice = db.prepare(
      "SELECT * FROM invoice WHERE registration_id = ? ORDER BY created_at DESC LIMIT 1"
    ).get(registrant.id);

    return NextResponse.json({
      success: true,
      data: {
        registrant,
        invoice: invoice || null,
      },
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { success: false, errors: ["Gagal mencari data"] },
      { status: 500 }
    );
  }
}
