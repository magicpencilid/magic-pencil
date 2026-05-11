/* =============================================
   🖼️ GALLERY — Galeri Sketsa Karya
   
   Grid responsive + lightbox klik gambar.
   ============================================= */

"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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

  const close = useCallback(() => setSelectedIdx(-1), []);
  const prev = useCallback(() => setSelectedIdx((p) => (p - 1 + galleryItems.length) % galleryItems.length), []);
  const next = useCallback(() => setSelectedIdx((p) => (p + 1) % galleryItems.length), []);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIdx < 0) return;
    const handler = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedIdx, close, prev, next]);

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

      {/* ===== LIGHTBOX ===== */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={close}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev button */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Image */}
          <div className="relative z-[5] max-w-full max-h-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={selected.image}
              alt={selected.title}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />

          </div>
        </div>
      )}
    </section>
  );
}
