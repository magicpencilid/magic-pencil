/* =============================================
   API: /api/karya/populer — Karya Murid Terpopuler
   
   GET — 10 karya approved dengan like terbanyak
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();

    const rows = db.prepare(`
      SELECT 
        k.id,
        k.judul,
        k.image_path,
        k.kelas,
        COALESCE(p.participant_name, 'Murid') as participant_name,
        COUNT(kl.id) as like_count
      FROM karya_murid k
      LEFT JOIN pendaftar p ON p.id = k.murid_id
      LEFT JOIN karya_likes kl ON kl.karya_id = k.id
      WHERE k.status = 'approved'
      GROUP BY k.id
      ORDER BY like_count DESC, k.created_at DESC
      LIMIT 10
    `).all();

    // Transform ke full proxy path (kalo perlu)
    const data = rows.map((r) => ({
      ...r,
      like_count: Number(r.like_count),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching populer:", error);
    return NextResponse.json({ success: false, errors: ["Gagal ambil data populer"] }, { status: 500 });
  }
}
