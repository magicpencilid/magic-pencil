/* =============================================
   API: GET /api/export?format=csv
   
   Export data pendaftar ke CSV (Excel-compatible).
   Langsung download file.
   ============================================= */

import { getDb } from "@/lib/database";

export async function GET(request) {
  const format = request.nextUrl.searchParams.get("format") || "csv";
  const db = getDb();

  const rows = db.prepare("SELECT * FROM pendaftar ORDER BY created_at DESC").all();

  if (format === "csv") {
    // Header CSV
    const headers = [
      "ID", "Nama Lengkap", "Nama Peserta", "WhatsApp", "Email",
      "Usia", "Kelas", "Sumber Info", "Catatan", "Status",
      "Tanggal Daftar", "Terakhir Update",
    ];

    // Baris data
    const csvRows = rows.map((r) => [
      r.id,
      r.full_name,
      r.participant_name,
      r.whatsapp,
      r.email || "",
      r.age,
      r.class_name,
      r.source || "",
      r.notes || "",
      r.status,
      r.created_at,
      r.updated_at,
    ]);

    // Gabung jadi CSV string
    const csvContent = [
      headers.join(","),
      ...csvRows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    // BOM biar Excel baca UTF-8 dengan bener
    const bom = "\uFEFF";

    return new Response(bom + csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="magic-pencil-pendaftar-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return new Response("Format tidak didukung", { status: 400 });
}
