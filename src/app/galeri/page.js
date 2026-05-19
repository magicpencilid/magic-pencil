/* =============================================
   GALERI — Galeri Foto & Karya Magic Pencil
   
   Gabungan foto studio + karya murid approved.
   Grid seragam, square aspect ratio.
   ============================================= */

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Loader2, ImageIcon, ArrowLeft, ChevronRight, X, Heart, Share2, ShoppingBag, Camera, Palette } from "lucide-react";
import ShareModal from "@/components/ShareModal";

/* Dapetin fingerprint */
function getFingerprint() {
  if (typeof window === "undefined") return "";
  let fp = localStorage.getItem("galeri_fp");
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem("galeri_fp", fp);
  }
  return fp;
}

/* Pilih API like bedasarkan source */
function getLikeApi(item) {
  return item.source === "murid"
    ? `/api/karya/${item.id}/like`
    : `/api/gallery/${item.id}/like`;
}

function formatDate(dateStr) {
  try {
    return new Date(dateStr + "Z").toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function GaleriPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [shareOpen, setShareOpen] = useState(false);

  // Like state
  const [likes, setLikes] = useState({});
  const [userLikes, setUserLikes] = useState({});

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          // Studio dulu, baru murid. Urut berdasarkan tanggal.
          const willy = (res.data.willy || []).map((p) => ({ ...p, source: "willy" }));
          const murid = (res.data.murid || []).map((p) => ({ ...p, source: "murid" }));
          setData([...willy, ...murid]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openDetail = (idx) => {
    setSelectedIdx(idx);
    setSelected(data[idx]);
  };

  const closeDetail = useCallback(() => {
    setSelected(null);
    setSelectedIdx(-1);
  }, []);

  const prev = () => {
    const newIdx = selectedIdx > 0 ? selectedIdx - 1 : data.length - 1;
    setSelectedIdx(newIdx);
    setSelected(data[newIdx]);
  };

  const next = () => {
    const newIdx = selectedIdx < data.length - 1 ? selectedIdx + 1 : 0;
    setSelectedIdx(newIdx);
    setSelected(data[newIdx]);
  };

  // Fetch likes pas buka lightbox
  useEffect(() => {
    if (selectedIdx < 0) return;
    const fp = getFingerprint();
    if (!fp) return;

    data.forEach((item) => {
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

  function handleShareClick(item) {
    const shareUrl = window.location.href;
    const shareText = `Lihat "${item.title}" — Magic Pencil`;
    if (navigator.share) {
      navigator.share({ title: item.title, text: shareText, url: shareUrl }).catch(() => {});
    } else {
      setShareOpen(true);
    }
  }

  // Keyboard navigation
  useEffect(() => {
    if (!selected) return;
    const handleKey = (e) => {
      if (e.key === "Escape") closeDetail();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, selectedIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const SourceIcon = ({ source }) => {
    const Icon = source === "willy" ? Camera : Palette;
    return (
      <Icon className={`w-3.5 h-3.5 ${source === "willy" ? "text-accent" : "text-accent-dark"}`} />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold text-primary">Galeri</h1>
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
      </header>

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 text-text-light">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">Belum ada foto</p>
            <p className="text-sm">Foto dan karya akan tampil di sini</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-4">{data.length} foto</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {data.map((item, idx) => (
                <button
                  key={`${item.source}-${item.id}`}
                  onClick={() => openDetail(idx)}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all text-left w-full group cursor-pointer"
                >
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {item.image_path ? (
                      <img
                        src={item.image_path}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                        <SourceIcon source={item.source} />
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-primary text-sm truncate">{item.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <SourceIcon source={item.source} />
                      <span className="text-[10px] text-gray-400">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeDetail}
        >
          <div
            className="max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close + info */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <SourceIcon source={selected.source} />
                <div>
                  <h2 className="font-bold text-primary">{selected.title}</h2>
                  <p className="text-xs text-text-light">
                    {formatDate(selected.created_at)}
                    {selected.source === "murid" && selected.participant_name
                      ? ` — ${selected.participant_name}`
                      : ""}
                  </p>
                </div>
              </div>
              <button onClick={closeDetail} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image */}
            <div className="bg-gray-100 flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={selected.image_path}
                alt={selected.title}
                className="max-w-full max-h-[60vh] object-contain"
              />
            </div>

            {/* Action bar */}
            <div className="px-4 pt-3 flex items-center gap-4">
              <button
                onClick={() => handleLike(selected)}
                className="flex items-center gap-1.5 text-primary/60 hover:text-primary transition-colors"
              >
                <Heart
                  className={`w-5 h-5 transition-all ${
                    userLikes[selected.id] ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span className="text-xs font-medium min-w-[1.2rem]">{likes[selected.id] || 0}</span>
              </button>

              <button
                onClick={() => handleShareClick(selected)}
                className="flex items-center gap-1.5 text-primary/60 hover:text-primary transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-xs font-medium">Bagikan</span>
              </button>

              <a
                href="/store"
                className="flex items-center gap-1.5 text-primary/60 hover:text-primary transition-colors ml-auto"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="text-xs font-medium">Beli Merch</span>
              </a>
            </div>

            {/* Desc + nav */}
            <div className="p-4">
              {selected.deskripsi && (
                <p className="text-sm text-primary mb-4">{selected.deskripsi}</p>
              )}
              <div className="flex items-center justify-between">
                <button
                  onClick={prev}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-sm text-text-light transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Sebelumnya
                </button>
                <span className="text-xs text-text-light">{selectedIdx + 1} / {data.length}</span>
                <button
                  onClick={next}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-sm text-text-light transition-colors"
                >
                  Selanjutnya <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
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
