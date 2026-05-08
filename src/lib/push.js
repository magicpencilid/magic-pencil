/* =============================================
   🔔 PUSH NOTIF — Web Push Utility
   
   Setup VAPID keys + kirim notification.
   ============================================= */

import webpush from "web-push";
import { getDb } from "./database";

// VAPID keys — public key buat frontend, private key buat backend
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_EMAIL = process.env.VAPID_EMAIL || "mailto:admin@magicpencil.my.id";

// Kalo keys exist, set VAPID
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

/**
 * Dapatkan VAPID public key
 */
export function getVapidPublicKey() {
  return VAPID_PUBLIC_KEY;
}

/**
 * Simpan subscription baru
 */
export function saveSubscription({ userType, userId, endpoint, auth, p256dh }) {
  const db = getDb();
  // Hapus subscription lama kalo endpoint udah ada
  db.prepare("DELETE FROM push_subscriptions WHERE endpoint = ?").run(endpoint);
  db.prepare(
    "INSERT INTO push_subscriptions (user_type, user_id, endpoint, auth, p256dh) VALUES (?, ?, ?, ?, ?)"
  ).run(userType, userId || null, endpoint, auth, p256dh);
}

/**
 * Hapus subscription
 */
export function removeSubscription(endpoint) {
  const db = getDb();
  db.prepare("DELETE FROM push_subscriptions WHERE endpoint = ?").run(endpoint);
}

/**
 * Kirim push notification ke semua subscriber tertentu
 */
export async function sendPushNotification({ title, body, url, userType, userId }) {
  const db = getDb();

  let query = "SELECT * FROM push_subscriptions WHERE 1=1";
  const params = [];

  if (userType) {
    query += " AND user_type = ?";
    params.push(userType);
  }
  if (userId) {
    query += " AND user_id = ?";
    params.push(userId);
  }

  const subs = db.prepare(query).all(...params);
  const results = [];

  for (const sub of subs) {
    try {
      const pushSub = {
        endpoint: sub.endpoint,
        keys: {
          auth: sub.auth,
          p256dh: sub.p256dh,
        },
      };

      const payload = JSON.stringify({ title, body, url, icon: "/favicon.jpg" });
      await webpush.sendNotification(pushSub, payload);
      results.push({ endpoint: sub.endpoint, status: "sent" });
    } catch (err) {
      // Kalo subscription expired, hapus
      if (err.statusCode === 410 || err.statusCode === 404) {
        removeSubscription(sub.endpoint);
      }
      results.push({ endpoint: sub.endpoint, status: "failed", error: err.message });
    }
  }

  return results;
}
