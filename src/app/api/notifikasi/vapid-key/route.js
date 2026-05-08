import { NextResponse } from "next/server";
import { getVapidPublicKey } from "@/lib/push";

/**
 * GET /api/notifikasi/vapid-key — ambil public key untuk frontend
 */
export async function GET() {
  const key = getVapidPublicKey();
  if (!key) {
    return NextResponse.json({ success: false, error: "VAPID key belum diatur" }, { status: 500 });
  }
  return NextResponse.json({ success: true, publicKey: key });
}
