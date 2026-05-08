import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth-murid";

export async function POST() {
  try {
    await clearSession();
    return NextResponse.json({ success: true, message: "Logout berhasil" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ success: false, error: "Gagal logout" }, { status: 500 });
  }
}
