/* =============================================
   🎨 KARYA CONSTANTS — Status & Label (Client-safe)
   
   Dipisah dari server-side helper biar aman di client.
   ============================================= */

/**
 * Mapping status ke label Indonesia
 */
export const STATUS_LABEL = {
  private: "Privat",
  pending: "Menunggu",
  approved: "Disetujui",
  rejected: "Ditolak",
};

/**
 * Mapping status ke warna Tailwind
 */
export const STATUS_COLOR = {
  private: "bg-gray-100 text-gray-600",
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

/**
 * Generate teks share ke sosmed
 */
export function generateShareText(karya) {
  return `🎨 Karya ${karya.participant_name || "Murid"} — "${karya.judul}"
📚 Kelas: ${karya.kelas || "—"}
✨ Magic Pencil`;
}
