/* =============================================
   KARYA — Shared Utility
   
   Helper queries, status mapping, share text.
   Server-only (database-dependent).
   ============================================= */

import { getDb } from "@/lib/database";

/**
 * Ambil karya murid berdasarkan filter
 */
export function getKarya({ id, muridId, status, limit, offset } = {}) {
  const db = getDb();
  const conditions = [];
  const params = {};

  if (id) { conditions.push("k.id = @id"); params.id = id; }
  if (muridId) { conditions.push("k.murid_id = @murid_id"); params.murid_id = muridId; }
  if (status) { conditions.push("k.status = @status"); params.status = status; }

  const where = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";
  const limitStr = limit ? `LIMIT @limit` : "";
  const offsetStr = offset ? `OFFSET @offset` : "";
  if (limit) params.limit = limit;
  if (offset) params.offset = offset;

  const rows = db.prepare(`
    SELECT k.*, p.participant_name, p.full_name, p.class_name as murid_kelas
    FROM karya_murid k
    LEFT JOIN pendaftar p ON k.murid_id = p.id
    ${where}
    ORDER BY k.created_at DESC
    ${limitStr} ${offsetStr}
  `).all(params);

  return rows;
}

/**
 * Ambil satu karya berdasarkan id
 */
export function getKaryaById(id) {
  const rows = getKarya({ id });
  return rows[0] || null;
}
