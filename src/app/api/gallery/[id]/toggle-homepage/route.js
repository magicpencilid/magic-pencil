/* =============================================
   📡 API: /api/gallery/[id]/toggle-homepage
   
   PATCH — Toggle show_on_homepage (admin only)
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { isAuthenticated } from "@/lib/auth";

export async function PATCH(request, props) {
  try {
    const params = await props.params;
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ success: false, errors: ["Unauthorized"] }, { status: 401 });
    }

    const { show_on_homepage } = await request.json();
    const id = params.id;

    if (typeof show_on_homepage !== "number") {
      return NextResponse.json(
        { success: false, errors: ["Value show_on_homepage harus 0 atau 1"] },
        { status: 400 }
      );
    }

    const db = getDb();
    const result = db.prepare("UPDATE gallery_photos SET show_on_homepage = ? WHERE id = ?").run(show_on_homepage, id);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, errors: ["Foto tidak ditemukan"] }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { id, show_on_homepage },
      message: show_on_homepage ? "Foto ditampilkan di Beranda" : "Foto disembunyikan dari Beranda",
    });
  } catch (error) {
    console.error("Error toggling homepage:", error?.message || error);
    return NextResponse.json(
      { success: false, errors: [error?.message || "Gagal mengubah status"] },
      { status: 500 }
    );
  }
}
