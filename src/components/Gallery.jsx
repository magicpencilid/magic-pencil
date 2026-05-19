/* =============================================
   GALLERY — Galeri Sketsa Karya
   
   Showcase grid dari gallery_photos (show_on_homepage=1).
   Statis — gak ada lightbox/click.
   ============================================= */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ImageIcon, ArrowRight } from "lucide-react";

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery?homepage=1")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          // Ambil dari willy (gallery_photos), batasi 6
          setPhotos((res.data.willy || []).slice(0, 6));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Belum ada foto ditampilkan di Beranda</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((item, index) => (
              <div
                key={item.id}
                className="relative rounded-xl overflow-hidden aspect-square border border-gray-100 select-none"
                style={{
                  animation: `slide-up 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {item.image_path ? (
                  <img
                    src={item.image_path}
                    alt={item.title}
                    className="w-full h-full object-contain pointer-events-none"
                    draggable="false"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-light">{item.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
}

        {/* Link ke galeri penuh */}
        {!loading && photos.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/galeri"
              className="inline-flex items-center gap-2 text-accent text-sm font-semibold hover:text-accent-dark transition-all group"
            >
              Lihat Semua di Galeri
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
