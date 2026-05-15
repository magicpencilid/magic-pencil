/* =============================================
   🔗 SHARE MODAL — Dialog Share ke Medsos
   
   Platform: Instagram, TikTok, Facebook, WhatsApp, Twitter, Copy Link
   ============================================= */

"use client";

import { X } from "lucide-react";

const platforms = [
  {
    id: "instagram",
    name: "Instagram",
    color: "hover:bg-pink-50 hover:text-pink-600",
    icon: "📸",
    getUrl: (url) => `https://www.instagram.com/share?url=${encodeURIComponent(url)}`,
  },
  {
    id: "tiktok",
    name: "TikTok",
    color: "hover:bg-gray-50 hover:text-gray-900",
    icon: "🎵",
    getUrl: (url) => `https://www.tiktok.com/share?url=${encodeURIComponent(url)}`,
  },
  {
    id: "facebook",
    name: "Facebook",
    color: "hover:bg-blue-50 hover:text-blue-600",
    icon: "👍",
    getUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    color: "hover:bg-green-50 hover:text-green-600",
    icon: "💬",
    getUrl: (url, text) => `https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`,
  },
  {
    id: "twitter",
    name: "Twitter / X",
    color: "hover:bg-gray-50 hover:text-gray-900",
    icon: "🐦",
    getUrl: (url, text) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
];

export default function ShareModal({ isOpen, onClose, item, shareUrl }) {
  if (!isOpen) return null;

  const shareText = item?.title
    ? `Lihat "${item.title}" — Magic Pencil`
    : "Magic Pencil — Galeri Sketsa & Karya";

  function handleShare(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      onClose();
    } catch {
      // fallback
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm mx-0 sm:mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar (mobile) */}
        <div className="sm:hidden w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-1" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-primary">Bagikan ke</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Platform list */}
        <div className="px-5 py-4 space-y-1">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => handleShare(p.getUrl(shareUrl, shareText))}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-gray-700 transition-all ${p.color}`}
            >
              <span className="text-lg">{p.icon}</span>
              <span className="font-medium">{p.name}</span>
              <span className="ml-auto text-[10px] text-gray-300">buka ➔</span>
            </button>
          ))}
        </div>

        {/* Copy link */}
        <div className="px-5 pb-5">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 text-sm text-gray-600 font-medium hover:bg-gray-100 transition-all"
          >
            🔗 Salin Link
          </button>
        </div>
      </div>
    </div>
  );
}
