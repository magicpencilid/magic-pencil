/* =============================================
   GALLERY — Galeri Foto Magic Pencil
   
   Grid Instagram-style, penuh warna.
   Campuran foto studio + karya murid approved.
   ============================================= */

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ImageIcon, Loader2, ChevronRight, X, Heart, Repeat2, Share2, ShoppingBag } from "lucide-react";
import ShareModal from "@/components/ShareModal";

const tabs = [
  { id: "all", label: "Semua" },
  { id: "willy", label: "Foto Studio" },
  { id: "murid", label: "Karya Murid" },
];

/* Dapetin fingerprint */
function getFingerprint() {
  if (typeof window === "undefined") return "";
  let fp = localStorage.getItem("gallery_fp");
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem("gallery_fp", fp);
  }
  return fp;
}

export default function GalleryPage() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(-1);

  // — Like state —
  const [likes, setLikes] = useState({});
  const [userLikes, setUserLikes] = useState({});

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

  function getLikeApi(item) {
    return item.source === "murid"
      ? `/api/karya/${item.id}/like`
      : `/api/gallery/${item.id}/like`;
  }

  // Fetch likes pas buka lightbox
  useEffect(() => {
    if (selectedIdx < 0) return;
    const fp = getFingerprint();
    if (!fp) return;

    filtered.forEach((item) => {
      fetch(`${getLikeApi(item)}?fingerprint=${encodeURIComponent(fp)}`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success) {
            setLikes((prev) => ({ ...prev, [item.id]: res.count }));
            setUserLikes((prev) => ({ ...prev, [item.id]: res.liked }));
          }
        })
        .catch(() => {});
    });
  }, [selectedIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleLike(item) {
    const fp = getFingerprint();
    if (!fp) return;

    fetch(getLikeApi(item), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fingerprint: fp }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setLikes((prev) => ({ ...prev, [item.id]: res.count }));
          setUserLikes((prev) => ({ ...prev, [item.id]: res.liked }));
        }
      })
      .catch(() => {});
  }

  const closeDetail = useCallback(() => {
    setSelected(null);
    setSelectedIdx(-1);
  }, []);

  // Auto-scroll to selected photo on open
  useEffect(() => {
    if (selectedIdx >= 0 && feedRef.current) {
      const target = feedRef.current.children[selectedIdx];
      if (target) target.scrollIntoView({ behavior: "instant", block: "center" });
    }
  }, [selectedIdx]);

  // Keyboard
  useEffect(() => {
    if (!selected) return;
    const handler = (e) => {
      if (e.key === "Escape") closeDetail();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, closeDetail]);

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
                {/* Title overlay */}
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium truncate text-left">{item.title}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* ===== LIGHTBOX — VERTICAL FEED ===== */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black overflow-y-auto overscroll-contain">
          {/* Fixed close button */}
          <button
            onClick={closeDetail}
            className="fixed top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Vertical feed */}
          <div ref={feedRef} className="min-h-full flex flex-col items-center pt-4 pb-20">
            {filtered.map((item, idx) => {
              const isLiked = userLikes[item.id] || false;
              const likeCount = likes[item.id] || 0;

              return (
                <div
                  key={`${item.source}-${item.id}`}
                  className="w-full max-w-2xl flex flex-col items-center px-4 pb-6"
                >
                  {/* Foto */}
                  <div className="relative w-full">
                    <img
                      src={item.image_path}
                      alt={item.title}
                      className="w-full h-auto object-contain rounded-lg shadow-2xl"
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                    {/* Judul overlay — kiri atas */}
                    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent rounded-t-lg">
                      <p className="text-white font-semibold text-sm drop-shadow-lg">
                        {item.title}
                      </p>
                    </div>
                  </div>

                  {/* Action bar — love, repost, share */}
                  <div className="mt-3 w-full flex items-center gap-5 px-1">
                    {/* Love */}
                    <button
                      onClick={() => handleLike(item)}
                      className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 transition-all ${
                          isLiked ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                      <span className="text-xs font-medium text-white/70 min-w-[1.2rem] text-left">{likeCount}</span>
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
                      href="/store"
                      className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
                      title="Beli Merch"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span className="text-xs font-medium">Beli Merch</span>
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
    </div>
  );
}
