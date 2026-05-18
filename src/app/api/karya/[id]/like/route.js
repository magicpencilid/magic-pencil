/* =============================================
   API: /api/karya/[id]/like — Like/Unlike Karya Murid
   
   GET  — Cek status like + jumlah
   POST — Toggle like/unlike (fingerprint-based)
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";

export async function GET(request, props) {
  try {
    const params = await props.params;
    const karyaId = Number(params.id);
    const { searchParams } = new URL(request.url);
    const fingerprint = searchParams.get("fingerprint");

    if (isNaN(karyaId)) {
      return NextResponse.json({ success: false, errors: ["ID karya tidak valid"] }, { status: 400 });
    }

    const db = getDb();
    const count = db.prepare("SELECT COUNT(*) as c FROM karya_likes WHERE karya_id = ?").get(karyaId).c;

    let liked = false;
    if (fingerprint) {
      const existing = db.prepare(
        "SELECT id FROM karya_likes WHERE karya_id = ? AND fingerprint = ?"
      ).get(karyaId, fingerprint);
      liked = !!existing;
    }

    return NextResponse.json({ success: true, liked, count });
  } catch (error) {
    console.error("Error get karya likes:", error);
    return NextResponse.json({ success: false, errors: ["Gagal ambil data like"] }, { status: 500 });
  }
}

export async function POST(request, props) {
  try {
    const params = await props.params;
    const karyaId = Number(params.id);

    if (isNaN(karyaId)) {
      return NextResponse.json({ success: false, errors: ["ID karya tidak valid"] }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const fingerprint = body.fingerprint;

    if (!fingerprint || typeof fingerprint !== "string") {
      return NextResponse.json({ success: false, errors: ["Fingerprint required"] }, { status: 400 });
    }

    const db = getDb();

    // Cek apakah udah pernah like
    const existing = db.prepare(
      "SELECT id FROM karya_likes WHERE karya_id = ? AND fingerprint = ?"
    ).get(karyaId, fingerprint);

    if (existing) {
      // Unlike — hapus like
      db.prepare("DELETE FROM karya_likes WHERE id = ?").run(existing.id);
      const count = db.prepare("SELECT COUNT(*) as c FROM karya_likes WHERE karya_id = ?").get(karyaId).c;
      return NextResponse.json({ success: true, liked: false, count });
    } else {
      // Like — tambah
      db.prepare(
        "INSERT INTO karya_likes (karya_id, fingerprint) VALUES (?, ?)"
      ).run(karyaId, fingerprint);
      const count = db.prepare("SELECT COUNT(*) as c FROM karya_likes WHERE karya_id = ?").get(karyaId).c;
      return NextResponse.json({ success: true, liked: true, count });
    }
  } catch (error) {
    console.error("Error toggle karya like:", error);
    return NextResponse.json({ success: false, errors: ["Gagal proses like"] }, { status: 500 });
  }
}
