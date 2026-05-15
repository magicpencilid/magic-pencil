/* =============================================
   🖼️ GALLERY — Galeri Foto Magic Pencil
   
   Grid Instagram-style, penuh warna.
   Campuran foto studio + karya murid approved.
   ============================================= */

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ImageIcon, Loader2, ChevronLeft, ChevronRight, X, Share2 } from "lucide-react";

const tabs = [
  { id: "all", label: "Semua" },
  { id: "willy", label: "Foto Studio" },
  { id: "murid", label: "Karya Murid" },
];

export default function GalleryPage() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(-1);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          const merged = [
            ...(res.data.willy || []).map((p) => ({ ...p, source: "willy" })),
            ...(res.data.murid || []).map((p) => ({ ...p, source: "murid" })),
          ];
          merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setData(merged);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab === "all" ? data : data.filter((item) => item.source === activeTab);

  const openDetail = (idx) => {
    setSelectedIdx(idx);
    setSelected(filtered[idx]);
  };

  const [toast, setToast] = useState("");

  async function handleShare(item) {
    const shareUrl = window.location.href;
    const shareText = `Lihat "${item.title}" — Galeri Magic Pencil`;

    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, text: shareText, url: shareUrl });
      } catch {
        // user cancel
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setToast("✅ Link disalin!");
        setTimeout(() => setToast(""), 2500);
      } catch {
        setToast("❌ Gagal menyalin link");
        setTimeout(() => setToast(""), 2500);
      }
    }
  }

  async function handleSharePlatform(item, platform) {
    const shareUrl = window.location.href;
    const tags = platform === "instagram"
      ? "#MagicPencil #Galeri #FotoKarya"
      : "#MagicPencil #Galeri #FYP";
    const shareText = `Lihat "${item.title}" ${tags}\n${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, text: shareText, url: shareUrl });
      } catch {
        // user cancel
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setToast(`✅ Link + hashtags siap di-paste ke ${platform === "instagram" ? "Instagram" : "TikTok"}!`);
        setTimeout(() => setToast(""), 3000);
      } catch {
        setToast("❌ Gagal");
        setTimeout(() => setToast(""), 2500);
      }
    }
  }

  const closeDetail = useCallback(() => {
    setSelected(null);
    setSelectedIdx(-1);
  }, []);

  const prev = useCallback(() => {
    const newIdx = selectedIdx > 0 ? selectedIdx - 1 : filtered.length - 1;
    setSelectedIdx(newIdx);
    setSelected(filtered[newIdx]);
  }, [selectedIdx, filtered]);

  const next = useCallback(() => {
    const newIdx = selectedIdx < filtered.length - 1 ? selectedIdx + 1 : 0;
    setSelectedIdx(newIdx);
    setSelected(filtered[newIdx]);
  }, [selectedIdx, filtered]);

  // Keyboard
  useEffect(() => {
    if (!selected) return;
    const handler = (e) => {
      if (e.key === "Escape") closeDetail();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, closeDetail, prev, next]);

  return (
    <div className="min-h-screen bg-white">
      {/* ===== HEADER ===== */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold text-primary text-lg">Galeri</h1>
              <p className="text-xs text-text-light">Foto & karya Magic Pencil</p>
            </div>
          </div>
          <Link
            href="/#galeri"
            className="text-xs text-text-light hover:text-primary transition-colors flex items-center gap-1"
          >
            Lihat Sketsa <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 pb-3 flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-50 text-text-light hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
          {!loading && (
            <span className="ml-auto text-[10px] text-gray-300 self-center">{filtered.length} foto</span>
          )}
        </div>
      </header>

      {/* ===== GRID ===== */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-text-light">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">Belum ada foto</p>
            <p className="text-sm">Foto dan karya akan tampil di sini</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
            {filtered.map((item, index) => (
              <button
                key={`${item.source}-${item.id}`}
                onClick={() => openDetail(index)}
                className="aspect-square bg-gray-50 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all group relative"
              >
                <img
                  src={item.image_path}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {/* Source badge */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                    item.source === "willy"
                      ? "bg-white/90 text-primary"
                      : "bg-white/90 text-accent-dark"
                  }`}>
                    {item.source === "willy" ? "Studio" : "Murid"}
                  </span>
                </div>
                {/* Title overlay on hover */}
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium truncate text-left">{item.title}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* ===== LIGHTBOX ===== */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeDetail}
        >
          {/* Toast */}
          {toast && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-black/70 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full shadow-lg">
              {toast}
            </div>
          )}

          {/* Share buttons */}
          <div className="absolute top-4 right-16 z-10 flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); handleShare(selected); }}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
              title="Bagikan"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleSharePlatform(selected, "instagram"); }}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all text-sm font-bold"
              title="Share ke Instagram"
              style={{ color: "#E4405F" }}
            >
              IG
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleSharePlatform(selected, "tiktok"); }}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all text-sm font-bold"
              title="Share ke TikTok"
              style={{ color: "#fff" }}
            >
              TT
            </button>
          </div>

          {/* Close */}
          <button
            onClick={closeDetail}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Image + Info */}
          <div
            className="relative z-[5] max-w-[90vw] max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selected.image_path}
              alt={selected.title}
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-3 text-center text-white/80">
              <p className="font-semibold text-sm">{selected.title}</p>
              {selected.deskripsi && (
                <p className="text-xs text-white/60 mt-1">{selected.deskripsi}</p>
              )}
              <p className="text-[10px] text-white/40 mt-1">
                {selected.source === "willy" ? "Foto Studio" : `Karya ${selected.participant_name || "Murid"}`}
              </p>
            </div>
            {/* Counter */}
            <p className="text-[10px] text-white/30 mt-1">
              {selectedIdx + 1} / {filtered.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
