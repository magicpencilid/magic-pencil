/* =============================================
   LOGIN API — Validasi password admin
   ============================================= */

import { NextResponse } from "next/server";
import { validateAdminPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request) {
  try {
    const text = await request.text();
    const body = JSON.parse(text);
    const { password } = body;

    if (!password) {
      return NextResponse.json({ success: false, error: "Password wajib diisi" }, { status: 400 });
    }

    if (!validateAdminPassword(password)) {
      return NextResponse.json({ success: false, error: "Password salah" }, { status: 401 });
    }

    await setSessionCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal login" }, { status: 500 });
  }
}
