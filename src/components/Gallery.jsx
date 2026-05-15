/* =============================================
   🖼️ GALLERY — Galeri Sketsa Karya
   
   Grid responsive + lightbox klik gambar.
   ============================================= */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, Share2 } from "lucide-react";
import ShareModal from "./ShareModal";

/* 📝 Data gallery — tambahin image: "/images/gallery-N.webp" kalo ada gambar */
const galleryItems = [
  { title: "Sketsa #1", image: "/images/gallery-1.webp", gradient: "from-gray-200 to-gray-300" },
  { title: "Sketsa #2", image: "/images/gallery-2.webp", gradient: "from-gray-100 to-gray-200" },
  { title: "Sketsa #3", image: "/images/gallery-3.webp", gradient: "from-gray-200 to-gray-400" },
  { title: "Sketsa #4", image: "/images/gallery-4.webp", gradient: "from-gray-100 to-gray-300" },
  { title: "Sketsa #5", image: "/images/gallery-5.webp", gradient: "from-gray-200 to-gray-300" },
  { title: "Sketsa #6", image: "/images/gallery-6.webp", gradient: "from-gray-100 to-gray-200" },
];

export default function Gallery() {
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const selected = selectedIdx >= 0 ? galleryItems[selectedIdx] : null;

  const close = useCallback(() => {
    setSelectedIdx(-1);
    setShareOpen(false);
  }, []);
  const [shareOpen, setShareOpen] = useState(false);
  const feedRef = useRef(null);

  function handleShareClick(item) {
    const shareUrl = window.location.href;
    const shareText = `Lihat "${item.title}" — Magic Pencil`;

    if (navigator.share) {
      navigator.share({ title: item.title, text: shareText, url: shareUrl }).catch(() => {});
    } else {
      setShareOpen(true);
    }
  }

  // Auto-scroll to selected photo on open
  useEffect(() => {
    if (selectedIdx >= 0 && feedRef.current) {
      const target = feedRef.current.children[selectedIdx];
      if (target) target.scrollIntoView({ behavior: "instant", block: "center" });
    }
  }, [selectedIdx]);

  // Keyboard
  useEffect(() => {
    if (selectedIdx < 0) return;
    const handler = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedIdx, close]);

  return (
    <section id="galeri" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ===== HEADER ===== */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
            Galeri Sketsa
          </h2>
          <p className="text-text-light max-w-2xl mx-auto font-light tracking-wide">
            Sketsa-sketsa karya sendiri. Setiap goresan adalah cerita 
            dan kreativitas tanpa batas.
          </p>
          <div className="w-16 h-0.5 bg-primary mx-auto mt-4 opacity-30" />
        </div>

        {/* ===== GRID GALLERY ===== */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="relative rounded-xl overflow-hidden aspect-square border border-gray-100 select-none cursor-pointer hover:shadow-md transition-shadow"
              style={{
                animation: `slide-up 0.5s ease-out ${index * 0.1}s both`,
              }}
              onClick={() => setSelectedIdx(index)}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain pointer-events-none"
                  draggable="false"
                  onContextMenu={(e) => e.preventDefault()}
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-light">{item.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ===== LIGHTBOX — VERTICAL FEED ===== */}
      {selectedIdx >= 0 && (
        <div className="fixed inset-0 z-50 bg-black overflow-y-auto overscroll-contain">
          {/* Fixed close button */}
          <button
            onClick={close}
            className="fixed top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Vertical feed */}
          <div ref={feedRef} className="min-h-full flex flex-col items-center pt-4 pb-20">
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                className="w-full max-w-2xl flex flex-col items-center px-4 pb-2"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="max-w-full max-h-[75vh] w-auto h-auto object-contain rounded-xl shadow-2xl"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
                <div className="mt-4 w-full flex items-center justify-between gap-3">
                  <p className="font-semibold text-sm text-white">Judul : {item.title}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareClick(item);
                    }}
                    className="text-white/60 hover:text-white text-sm transition-colors bg-white/10 hover:bg-white/20 rounded-full px-4 py-0.5 flex items-center gap-1.5 shrink-0"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Bagikan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        item={selected}
        shareUrl={typeof window !== "undefined" ? window.location.href : ""}
      />
    </section>
  );
}
