import { NextResponse } from "next/server";
import { removeSubscription } from "@/lib/push";

/**
 * POST /api/notifikasi/unsubscribe — hapus subscription
 * Body: { endpoint }
 */
export async function POST(request) {
  try {
    const { endpoint } = await request.json();
    if (!endpoint) {
      return NextResponse.json({ success: false, error: "Endpoint wajib diisi" }, { status: 400 });
    }

    removeSubscription(endpoint);

    return NextResponse.json({ success: true, message: "Berhenti berlangganan berhasil" });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json({ success: false, error: "Gagal berhenti berlangganan" }, { status: 500 });
  }
}
