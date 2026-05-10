/* =============================================
   💬 WHATSAPP BUTTON — Floating WA link
   
   Tombol hijau melayang di pojok kanan bawah.
   Bisa dikasih custom message atau pake default.
   ============================================= */

"use client";

import { useState } from "react";

const WA_NUMBER = "628111150563";

/**
 * Format teja biar aman jadi URL param
 */
function encodeWA(text) {
  return encodeURIComponent(text);
}

/**
 * Bikin link wa.me dengan message
 */
export function getWALink(message) {
  const defaultMsg = "Halo admin Magic Pencil! Saya mau tanya-tanya tentang kursus menggambar.";
  const text = message || defaultMsg;
  return `https://wa.me/${WA_NUMBER}?text=${encodeWA(text)}`;
}

export default function WhatsAppButton({ message, position = "right-6 bottom-6" }) {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className={`fixed ${position} z-50 flex flex-col items-end gap-2`}>
      {/* Tooltip */}
      {showTooltip && (
        <div className="relative bg-white text-gray-700 text-sm rounded-lg shadow-lg px-4 py-2 max-w-[200px] animate-fade-in">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-200 rounded-full text-xs flex items-center justify-center hover:bg-gray-300"
            aria-label="Tutup"
          >
            ✕
          </button>
          Ada yang bisa dibantu? 😊
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white rotate-45" />
        </div>
      )}

      {/* Tombol WA */}
      <a
        href={getWALink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Chat via WhatsApp"
      >
        <svg
          viewBox="0 0 32 32"
          className="w-7 h-7 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.692.713 5.218 1.961 7.42L2 30l6.695-1.93A13.948 13.948 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm6.855 19.645c-.36.933-1.046 1.72-1.936 2.067-.49.192-1.046.295-1.607.293a4.998 4.998 0 01-1.428-.2c-2.302-.633-4.346-2.173-5.838-3.798-1.565-1.636-2.628-3.574-3.09-5.21a5.866 5.866 0 01-.2-1.607 3.87 3.87 0 01.293-1.607c.346-.89 1.134-1.576 2.067-1.936.203-.08.42-.122.64-.125.223-.004.445.03.653.1.332.11.626.305.856.567l1.64 1.833a1.155 1.155 0 01.155 1.23c-.06.12-.145.228-.25.32l-.654.654a.486.486 0 00-.138.382c.022.164.072.323.146.47.388.82 1.011 1.578 1.72 2.21.71.632 1.495 1.14 2.36 1.494.18.07.368.112.56.125a.486.486 0 00.382-.138l.654-.654a1.155 1.155 0 011.23-.155c.102.055.2.12.29.195l1.833 1.64c.262.23.457.524.567.856.07.208.104.43.099.654-.002.22-.045.436-.124.64z" />
        </svg>
      </a>
    </div>
  );
}
