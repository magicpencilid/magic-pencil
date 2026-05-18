/* =============================================
   🔔 NOTIFICATION MANAGER — PWA + Push Notification
   
   Fitur:
   - Register service worker
   - Subscribe push notification
   - Tombol install PWA
   ============================================= */

"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, CheckCircle, Download, Loader2 } from "lucide-react";

export default function NotificationManager() {
  const [notifStatus, setNotifStatus] = useState(null); // null | "loading" | "active" | "blocked" | "unsupported"
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Cek support
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setNotifStatus("unsupported");
      return;
    }

    // Cek permission
    if (Notification.permission === "granted") {
      setNotifStatus("active");
    } else if (Notification.permission === "denied") {
      setNotifStatus("blocked");
    }

    // Listen PWA install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Cek kalo udah installed
    window.addEventListener("appinstalled", () => {
      setShowInstallBtn(false);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  /**
   * Register service worker + subscribe push
   */
  async function enableNotifications() {
    setNotifStatus("loading");
    try {
      // Register SW
      const registration = await navigator.serviceWorker.register("/sw.js");

      // Minta permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setNotifStatus("blocked");
        return;
      }

      // Ambil VAPID public key
      const keyRes = await fetch("/api/notifikasi/vapid-key");
      const keyData = await keyRes.json();
      if (!keyData.success) {
        setNotifStatus("unsupported");
        return;
      }

      // Subscribe
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(keyData.publicKey),
      });

      // Kirim ke server
      await fetch("/api/notifikasi/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      setNotifStatus("active");
    } catch {
      setNotifStatus("blocked");
    }
  }

  /**
   * Install PWA
   */
  async function installPWA() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setShowInstallBtn(false);
    }
    setDeferredPrompt(null);
  }

  return (
    <div className="space-y-3">
      {/* Install PWA Button */}
      {showInstallBtn && (
        <button
          onClick={installPWA}
          className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Install Magic Pencil
        </button>
      )}

      {/* Enable Notifications */}
      {notifStatus === null && (
        <button
          onClick={enableNotifications}
          className="w-full bg-gray-200 text-gray-700 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
        >
          <Bell className="w-4 h-4" />
          Aktifkan Notifikasi
        </button>
      )}

      {notifStatus === "loading" && (
        <div className="text-center text-sm text-text-light py-3">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-1" />
          Memproses...
        </div>
      )}

      {notifStatus === "active" && (
        <div className="bg-gray-100 rounded-2xl p-4 text-center">
          <Bell className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-primary flex items-center justify-center gap-1.5"><CheckCircle className="w-4 h-4" /> Notifikasi Aktif</p>
          <p className="text-xs text-text-light mt-1">
            Kamu akan mendapat update jadwal & info kelas
          </p>
        </div>
      )}

      {notifStatus === "blocked" && (
        <div className="bg-gray-100 rounded-2xl p-4 text-center">
          <BellOff className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-primary">Notifikasi Diblokir</p>
          <p className="text-xs text-text-light mt-1">
            Aktifkan di pengaturan browser {'>'} Privasi & Keamanan {'>'} Notifikasi
          </p>
        </div>
      )}

      {notifStatus === "unsupported" && null}
    </div>
  );
}

/**
 * Utility: Base64 → Uint8Array (buat VAPID key)
 */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
