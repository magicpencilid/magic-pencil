import { NextResponse } from "next/server";
import { getCurrentMurid } from "@/lib/auth-murid";

export async function GET() {
  try {
    const murid = await getCurrentMurid();

    if (!murid) {
      return NextResponse.json({ success: false, error: "Tidak terautentikasi" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: murid.id,
        murid_id: murid.murid_id,
        email: murid.email,
        nama: murid.participant_name,
        full_name: murid.full_name,
        whatsapp: murid.whatsapp,
        kelas: murid.class_name,
      },
    });
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json({ success: false, error: "Gagal memuat data" }, { status: 500 });
  }
}
