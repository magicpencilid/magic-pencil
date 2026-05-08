import { NextResponse } from "next/server";
import { saveSubscription } from "@/lib/push";

/**
 * POST /api/notifikasi/subscribe — simpan subscription baru
 * Body: { endpoint, keys: { auth, p256dh } }
 */
export async function POST(request) {
  try {
    const { endpoint, keys } = await request.json();

    if (!endpoint || !keys?.auth || !keys?.p256dh) {
      return NextResponse.json({ success: false, error: "Data subscription tidak lengkap" }, { status: 400 });
    }

    // Cek apakah murid yang login
    let userId = null;
    let userType = "anonim";
    try {
      const { getCurrentMurid } = await import("@/lib/auth-murid");
      const murid = await getCurrentMurid();
      if (murid) {
        userId = murid.murid_id;
        userType = "murid";
      }
    } catch {}

    saveSubscription({
      userType,
      userId,
      endpoint,
      auth: keys.auth,
      p256dh: keys.p256dh,
    });

    return NextResponse.json({ success: true, message: "Berlangganan notifikasi berhasil" });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ success: false, error: "Gagal berlangganan" }, { status: 500 });
  }
}
