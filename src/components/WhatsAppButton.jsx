/* =============================================
   💬 WHATSAPP BUTTON — Floating WA link
   
   Tombol hijau melayang di pojok kanan bawah.
   Pake inline styles biar aman di semua browser.
   ============================================= */

"use client";

import { useState, useEffect } from "react";

const WA_NUMBER = "628111150563";

function encodeWA(text) {
  return encodeURIComponent(text);
}

export function getWALink(message) {
  const defaultMsg = "Halo admin Magic Pencil! Saya mau tanya-tanya tentang kursus menggambar.";
  const text = message || defaultMsg;
  return `https://wa.me/${WA_NUMBER}?text=${encodeWA(text)}`;
}

/* Inline keyframes via style tag — aman di semua browser */
const pulseKeyframes = `
@keyframes wa-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(34, 197, 94, 0); }
}
@keyframes wa-fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

export default function WhatsAppButton({ message }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Show tooltip after 3 seconds
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Inject keyframes
  useEffect(() => {
    const styleId = "wa-keyframes";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = pulseKeyframes;
      document.head.appendChild(style);
    }
  }, []);

  const btnStyle = {
    width: 56,
    height: 56,
    backgroundColor: "#22c55e",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    animation: mounted ? "wa-pulse 2s infinite" : "none",
  };

  return (
    <div
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 8,
      }}
    >
      {/* Tooltip */}
      {showTooltip && (
        <div
          style={{
            position: "relative",
            backgroundColor: "#fff",
            color: "#374151",
            fontSize: 14,
            borderRadius: 8,
            padding: "8px 16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            maxWidth: 200,
            animation: "wa-fade-in 0.3s ease-out",
          }}
        >
          <button
            onClick={() => setShowTooltip(false)}
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              width: 20,
              height: 20,
              backgroundColor: "#e5e7eb",
              borderRadius: "50%",
              border: "none",
              fontSize: 10,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
              lineHeight: 1,
            }}
            aria-label="Tutup"
          >
            ✕
          </button>
          Ada yang bisa dibantu? 😊
          <div
            style={{
              position: "absolute",
              bottom: -6,
              right: 24,
              width: 12,
              height: 12,
              backgroundColor: "#fff",
              transform: "rotate(45deg)",
            }}
          />
        </div>
      )}

      {/* Tombol WA */}
      <a
        href={getWALink(message)}
        target="_blank"
        rel="noopener noreferrer"
        style={btnStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.backgroundColor = "#16a34a";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.backgroundColor = "#22c55e";
        }}
        aria-label="Chat via WhatsApp"
      >
        <svg
          viewBox="0 0 32 32"
          style={{ width: 28, height: 28, fill: "#fff" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.692.713 5.218 1.961 7.42L2 30l6.695-1.93A13.948 13.948 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm6.855 19.645c-.36.933-1.046 1.72-1.936 2.067-.49.192-1.046.295-1.607.293a4.998 4.998 0 01-1.428-.2c-2.302-.633-4.346-2.173-5.838-3.798-1.565-1.636-2.628-3.574-3.09-5.21a5.866 5.866 0 01-.2-1.607 3.87 3.87 0 01.293-1.607c.346-.89 1.134-1.576 2.067-1.936.203-.08.42-.122.64-.125.223-.004.445.03.653.1.332.11.626.305.856.567l1.64 1.833a1.155 1.155 0 01.155 1.23c-.06.12-.145.228-.25.32l-.654.654a.486.486 0 00-.138.382c.022.164.072.323.146.47.388.82 1.011 1.578 1.72 2.21.71.632 1.495 1.14 2.36 1.494.18.07.368.112.56.125a.486.486 0 00.382-.138l.654-.654a1.155 1.155 0 011.23-.155c.102.055.2.12.29.195l1.833 1.64c.262.23.457.524.567.856.07.208.104.43.099.654-.002.22-.045.436-.124.64z" />
        </svg>
      </a>
    </div>
  );
}
