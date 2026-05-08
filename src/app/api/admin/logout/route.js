/* =============================================
   🚪 LOGOUT API — Hapus session cookie
   ============================================= */

import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  try {
    await clearSessionCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal logout" }, { status: 500 });
  }
}

/* Juga handle GET via link langsung */
export { POST as GET };
