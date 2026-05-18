/* =============================================
   AUTH — Admin Session Utility
   
   Simple session token via httpOnly cookie.
   Password disimpan di .env.local
   ============================================= */

import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE = "admin_session";
const SESSION_SECRET = "magic-pencil-session-secret-2026";

/* Bikin session token dari password */
export function createSessionToken(password) {
  const hash = crypto
    .createHash("sha256")
    .update(password + SESSION_SECRET)
    .digest("hex");
  return hash;
}

/* Validasi password */
export function validateAdminPassword(password) {
  const correct = process.env.ADMIN_PASSWORD;
  if (!correct) return false;
  return password === correct;
}

/* Set session cookie */
export async function setSessionCookie() {
  const token = createSessionToken(process.env.ADMIN_PASSWORD);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: false, // localhost
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 jam
  });
}

/* Clear session cookie */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/* Cek apakah user sudah login */
export async function isAuthenticated() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return false;
    const expected = createSessionToken(process.env.ADMIN_PASSWORD);
    return token === expected;
  } catch {
    return false;
  }
}
