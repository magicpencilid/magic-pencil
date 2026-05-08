/* =============================================
   🔐 SESSION CHECK — Cek status login admin
   ============================================= */

import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const loggedIn = await isAuthenticated();

  return NextResponse.json({
    success: true,
    authenticated: loggedIn,
  });
}
