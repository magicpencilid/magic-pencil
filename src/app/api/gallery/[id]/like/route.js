/* =============================================
   📡 API: /api/gallery/[id]/like — Like/Unlike Foto
   
   GET  — Cek status like + jumlah (no toggle)
   POST — Toggle like/unlike (fingerprint-based)
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";

export async function GET(request, props) {
  try {
    const params = await props.params;
    const photoId = Number(params.id);
    const { searchParams } = new URL(request.url);
    const fingerprint = searchParams.get("fingerprint");

    if (isNaN(photoId)) {
      return NextResponse.json({ success: false, errors: ["ID foto tidak valid"] }, { status: 400 });
    }

    const db = getDb();
    const count = db.prepare("SELECT COUNT(*) as c FROM gallery_likes WHERE photo_id = ?").get(photoId).c;

    let liked = false;
    if (fingerprint) {
      const existing = db.prepare(
        "SELECT id FROM gallery_likes WHERE photo_id = ? AND fingerprint = ?"
      ).get(photoId, fingerprint);
      liked = !!existing;
    }

    return NextResponse.json({ success: true, liked, count });
  } catch (error) {
    console.error("Error get likes:", error);
    return NextResponse.json({ success: false, errors: ["Gagal ambil data like"] }, { status: 500 });
  }
}

export async function POST(request, props) {
  try {
    const params = await props.params;
    const photoId = Number(params.id);

    if (isNaN(photoId)) {
      return NextResponse.json({ success: false, errors: ["ID foto tidak valid"] }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const fingerprint = body.fingerprint;

    if (!fingerprint || typeof fingerprint !== "string") {
      return NextResponse.json({ success: false, errors: ["Fingerprint required"] }, { status: 400 });
    }

    const db = getDb();

    // Cek apakah udah pernah like
    const existing = db.prepare(
      "SELECT id FROM gallery_likes WHERE photo_id = ? AND fingerprint = ?"
    ).get(photoId, fingerprint);

    if (existing) {
      // Unlike — hapus like
      db.prepare("DELETE FROM gallery_likes WHERE id = ?").run(existing.id);
      const count = db.prepare("SELECT COUNT(*) as c FROM gallery_likes WHERE photo_id = ?").get(photoId).c;
      return NextResponse.json({ success: true, liked: false, count });
    } else {
      // Like — tambah
      db.prepare(
        "INSERT INTO gallery_likes (photo_id, fingerprint) VALUES (?, ?)"
      ).run(photoId, fingerprint);
      const count = db.prepare("SELECT COUNT(*) as c FROM gallery_likes WHERE photo_id = ?").get(photoId).c;
      return NextResponse.json({ success: true, liked: true, count });
    }
  } catch (error) {
    console.error("Error toggle like:", error);
    return NextResponse.json({ success: false, errors: ["Gagal proses like"] }, { status: 500 });
  }
}
