import { NextResponse } from "next/server";
import { sendPushNotification } from "@/lib/push";
import { getDb } from "@/lib/database";

/**
 * POST /api/notifikasi/send — kirim notifikasi (admin only)
 * Body: { title, body, url }
 */
export async function POST(request) {
  try {
    const { title, body, url, userType } = await request.json();

    if (!title) {
      return NextResponse.json({ success: false, error: "Title wajib diisi" }, { status: 400 });
    }

    // Cek session admin
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session")?.value;
    const { createSessionToken } = await import("@/lib/auth");
    const expectedToken = createSessionToken(process.env.ADMIN_PASSWORD);
    if (!adminSession || adminSession !== expectedToken) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const results = await sendPushNotification({
      title,
      body: body || "",
      url: url || "/",
      userType: userType || null,
    });

    const sent = results.filter((r) => r.status === "sent").length;

    return NextResponse.json({
      success: true,
      message: `Notifikasi terkirim ke ${sent} perangkat`,
      results,
    });
  } catch (error) {
    console.error("Send notif error:", error);
    return NextResponse.json({ success: false, error: "Gagal kirim notifikasi" }, { status: 500 });
  }
}
