/* =============================================
   🔐 AUTH MURID — Login/Register/Logout
   
   Pake bcryptjs untuk hashing password + JWT
   sederhana via cookies.
   ============================================= */

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const SALT_ROUNDS = 10;
const SESSION_COOKIE = "session_murid";

/**
 * Hash password
 */
export function hashPassword(password) {
  return bcrypt.hashSync(password, SALT_ROUNDS);
}

/**
 * Compare password dengan hash
 */
export function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

/**
 * Generate session token (sederhana — hash dari murid_id + timestamp)
 */
function generateToken(muridId) {
  const raw = `${muridId}:${Date.now()}:magic-pencil-secret`;
  return Buffer.from(raw).toString("base64");
}

/**
 * Parse session token — return { muridId } atau null
 */
function parseToken(token) {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return null;
    return { muridId: parseInt(parts[0]) };
  } catch {
    return null;
  }
}

/**
 * Set session cookie (login)
 */
export async function setSession(muridId) {
  const token = generateToken(muridId);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });
  return token;
}

/**
 * Hapus session cookie (logout)
 */
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Get current murid dari cookie session
 * Return { id, murid_id, email, ...data_murid } atau null
 */
export async function getCurrentMurid() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const payload = parseToken(token);
    if (!payload) return null;

    const { getDb } = await import("./database");
    const db = getDb();

    const akun = db.prepare(`
      SELECT a.id, a.murid_id, a.email, p.participant_name, p.full_name, p.whatsapp, p.class_name
      FROM akun_murid a
      JOIN pendaftar p ON a.murid_id = p.id
      WHERE a.murid_id = ?
    `).get(payload.muridId);

    return akun || null;
  } catch {
    return null;
  }
}

/**
 * Generate random password — "mp" + 4 karakter alfanumerik
 * Contoh: mpA7kX, mp9zQ2, mp3fR8
 */
export function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let random = "";
  for (let i = 0; i < 4; i++) {
    random += chars[Math.floor(Math.random() * chars.length)];
  }
  return "mp" + random;
}

/**
 * Generate email dari nama participant
 * - Slug: lowercase, buang aksen, spasi → titik, buang simbol
 * - Kalo slug kosong/terlalu pendek, pake "user" + random 3 digit
 * - Auto-unique: kalo slug udah dipake, tambah angka increment
 *
 * Contoh:
 *   "Budi"          → budi@magicpencil.my.id
 *   "Siti Nurhaliza" → siti.nurhaliza@magicpencil.my.id
 *   (duplicate)      → siti.nurhaliza1@magicpencil.my.id
 *
 * @param {string} nama - participant_name atau full_name dari pendaftar
 * @param {object} db - Koneksi database (better-sqlite3)
 */
export function generateEmail(nama, db) {
  // Buang aksen + lowercase + spasi jadi titik
  let slug = nama
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // buang diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")     // cuma huruf, angka, spasi
    .trim()
    .replace(/\s+/g, ".")            // spasi → titik
    .replace(/\.+/g, ".")            // titik ganda → tunggal
    .replace(/^\.|\.$/g, "");       // buang titik di ujung

  // Fallback kalo slug kosong atau terlalu pendek
  if (slug.length < 2) {
    const rand = Math.floor(Math.random() * 900) + 100;
    slug = "user" + rand;
  }

  // Cek unique — increment kalo udah dipake
  let candidate = slug;
  let counter = 1;
  const domain = "@magicpencil.my.id";

  while (db.prepare("SELECT id FROM akun_murid WHERE email = ?").get(candidate + domain)) {
    candidate = slug + counter;
    counter++;
  }

  return candidate + domain;
}
