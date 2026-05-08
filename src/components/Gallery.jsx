/* =============================================
   🖼️ GALLERY — Galeri Sketsa Karya
   
   Grid responsive sketsa-sketsa dari owner.
   Kalo ada gambar asli, ditampilin — kalo belum,
   pake placeholder gradient.
   ============================================= */

"use client";

import { ImageIcon } from "lucide-react";

/* 📝 Data gallery — tambahin image: "/images/gallery-N.webp" kalo ada gambar */
const galleryItems = [
  { title: "Sketsa #1", by: "Owner", image: "/images/gallery-1.webp", gradient: "from-gray-200 to-gray-300" },
  { title: "Sketsa #2", by: "Owner", image: "/images/gallery-2.webp", gradient: "from-gray-100 to-gray-200" },
  { title: "Sketsa #3", by: "Owner", image: "/images/gallery-3.webp", gradient: "from-gray-200 to-gray-400" },
  { title: "Sketsa #4", by: "Owner", image: "/images/gallery-4.webp", gradient: "from-gray-100 to-gray-300" },
  { title: "Sketsa #5", by: "Owner", image: "/images/gallery-5.webp", gradient: "from-gray-200 to-gray-300" },
  { title: "Sketsa #6", by: "Owner", image: "/images/gallery-6.webp", gradient: "from-gray-100 to-gray-200" },
];

export default function Gallery() {
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
              className="group relative rounded-xl overflow-hidden aspect-square cursor-pointer border border-gray-100 select-none"
              style={{
                animation: `slide-up 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              {item.image ? (
                <>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain pointer-events-none"
                    draggable="false"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  {/* Overlay anti-save */}
                  <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()} />
                  {/* Overlay hover info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 z-20">
                    <div>
                      <p className="text-white font-display font-semibold text-lg">{item.title}</p>
                      <p className="text-white/60 text-xs uppercase tracking-wider">{item.by}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={`w-full h-full bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                    <div className="text-center">
                      <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-light">{item.title}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div>
                      <p className="text-white font-display font-semibold text-lg">{item.title}</p>
                      <p className="text-white/60 text-xs uppercase tracking-wider">{item.by}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
