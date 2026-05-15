/* =============================================
   🖼️ GALLERY — Galeri Sketsa Karya
   
   Grid responsive + lightbox Instagram-style vertical feed.
   ============================================= */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, Heart, Repeat2, Share2, ShoppingBag } from "lucide-react";
import ShareModal from "./ShareModal";

/* 📝 Data gallery — tambahin image: "/images/gallery-N.webp" kalo ada gambar */
const galleryItems = [
  { id: 1, title: "Sketsa #1", image: "/images/gallery-1.webp", deskripsi: "Sketsa awal dengan pensil arsir", gradient: "from-gray-200 to-gray-300" },
  { id: 2, title: "Sketsa #2", image: "/images/gallery-2.webp", deskripsi: "Latihan shading dan gradasi", gradient: "from-gray-100 to-gray-200" },
  { id: 3, title: "Sketsa #3", image: "/images/gallery-3.webp", deskripsi: "Eksplorasi bentuk geometris", gradient: "from-gray-200 to-gray-400" },
  { id: 4, title: "Sketsa #4", image: "/images/gallery-4.webp", deskripsi: "Komposisi grid dan titik hilang", gradient: "from-gray-100 to-gray-300" },
  { id: 5, title: "Sketsa #5", image: "/images/gallery-5.webp", deskripsi: "Teknik cross-hatching", gradient: "from-gray-200 to-gray-300" },
  { id: 6, title: "Sketsa #6", image: "/images/gallery-6.webp", deskripsi: "Perspektif satu titik", gradient: "from-gray-100 to-gray-200" },
];

/* 🔑 Dapetin fingerprint — simpen di localStorage */
function getFingerprint() {
  if (typeof window === "undefined") return "";
  let fp = localStorage.getItem("gallery_fp");
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem("gallery_fp", fp);
  }
  return fp;
}

export default function Gallery() {
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const selected = selectedIdx >= 0 ? galleryItems[selectedIdx] : null;

  const close = useCallback(() => {
    setSelectedIdx(-1);
    setShareOpen(false);
  }, []);
  const [shareOpen, setShareOpen] = useState(false);
  const feedRef = useRef(null);

  // — Like state —
  const [likes, setLikes] = useState({});       // { [photoId]: count }
  const [userLikes, setUserLikes] = useState({}); // { [photoId]: boolean }

  // Fetch likes pas buka lightbox — pake GET (cek aja, gak toggle)
  useEffect(() => {
    if (selectedIdx < 0) return;
    const fp = getFingerprint();
    if (!fp) return;

    galleryItems.forEach((item) => {
      fetch(`/api/gallery/${item.id}/like?fingerprint=${encodeURIComponent(fp)}`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success) {
            setLikes((prev) => ({ ...prev, [item.id]: res.count }));
            setUserLikes((prev) => ({ ...prev, [item.id]: res.liked }));
          }
        })
        .catch(() => {});
    });
  }, [selectedIdx]);

  function handleLike(photoId) {
    const fp = getFingerprint();
    if (!fp) return;

    fetch(`/api/gallery/${photoId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fingerprint: fp }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setLikes((prev) => ({ ...prev, [photoId]: res.count }));
          setUserLikes((prev) => ({ ...prev, [photoId]: res.liked }));
        }
      })
      .catch(() => {});
  }

  function handleShareClick(item) {
    const shareUrl = window.location.href;
    const shareText = `Lihat "${item.title}" — Magic Pencil`;

    if (navigator.share) {
      navigator.share({ title: item.title, text: shareText, url: shareUrl }).catch(() => {});
    } else {
      setShareOpen(true);
    }
  }

  // Auto-scroll ke foto dipilih
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
              key={item.id}
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
            {galleryItems.map((item, idx) => {
              const isLiked = userLikes[item.id] || false;
              const likeCount = likes[item.id] || 0;

              return (
                <div
                  key={item.id}
                  className="w-full max-w-2xl flex flex-col items-center px-4 pb-6"
                >
                  {/* Foto */}
                  <div className="relative w-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-auto object-contain rounded-lg shadow-2xl"
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                    {/* Judul overlay — kiri atas (kayak IG) */}
                    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent rounded-t-lg">
                      <p className="text-white font-semibold text-sm drop-shadow-lg">
                        {item.title}
                      </p>
                    </div>
                  </div>

                  {/* Action bar — love, repost, share (kayak IG) */}
                  <div className="mt-3 w-full flex items-center gap-5 px-1">
                    {/* Love */}
                    <button
                      onClick={() => handleLike(item.id)}
                      className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 transition-all ${
                          isLiked ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                      {likeCount > 0 && (
                        <span className="text-xs font-medium text-white/70">{likeCount}</span>
                      )}
                    </button>

                    {/* Repost */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareClick(item);
                      }}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      <Repeat2 className="w-5 h-5" />
                    </button>

                    {/* Share */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareClick(item);
                      }}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>

                    {/* Beli Merch */}
                    <a
                      href={`https://wa.me/628111150563?text=${encodeURIComponent(`Halo kak, saya mau pesan merch dengan desain "${item.title}" — Magic Pencil. Mohon info ketersediaan dan harga. Terima kasih 🙏`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-white transition-colors"
                      title="Beli Merch"
                    >
                      <ShoppingBag className="w-5 h-5" />
                    </a>
                  </div>

                  {/* Caption */}
                  {item.deskripsi && (
                    <p className="mt-2 w-full text-xs text-white/60 px-1 leading-relaxed">
                      {item.deskripsi}
                    </p>
                  )}
                </div>
              );
            })}
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
