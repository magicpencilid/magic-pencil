/* =============================================
   ?? HERO CAROUSEL — Galeri Sketsa Bergerak
   
   Full-screen carousel yang otomatis slide
   6 gambar sketsa dari Willy.
   ============================================= */

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* =============================================
   ?? DATA SKETSA (6 gambar)
   ============================================= */
const sketches = [
  {
    id: 1,
    title: "Sketsa Potret",
    desc: "Hasil karya sketsa pensil",
    gradient: "bg-white",
  },
  {
    id: 2,
    title: "Sketsa Figuratif",
    desc: "Eksplorasi bentuk dan bayangan",
    gradient: "bg-white",
  },
  {
    id: 3,
    title: "Sketsa Lanskap",
    desc: "Pemandangan alam dengan arsiran detail",
    gradient: "bg-white",
  },
  {
    id: 4,
    title: "Sketsa Ekspresif",
    desc: "Gaya bebas dengan pensil arang",
    gradient: "bg-white",
  },
  {
    id: 5,
    title: "Sketsa Anatomi",
    desc: "Studi proporsi dan gestur",
    gradient: "bg-white",
  },
  {
    id: 6,
    title: "Sketsa Imajinatif",
    desc: "Dari imajinasi ke goresan pensil",
    gradient: "bg-white",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % sketches.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + sketches.length) % sketches.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="relative w-full h-[85vh] md:h-screen min-h-[500px] max-h-[900px]">
        
        {/* Slides — gambar non-aktif pake loading=lazy biar gak semua di-load bareng */}
        {sketches.map((sketch, index) => (
          <div
            key={sketch.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === current
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <div className={`w-full h-full ${sketch.gradient} flex items-center justify-center`}>
              <div className="w-full h-full flex items-start justify-center px-8 md:px-16 pt-4 md:pt-8 pb-8 md:pb-16">
                <div className="relative w-full max-w-5xl">
                  <div className="w-full rounded-2xl overflow-hidden relative flex items-center justify-center select-none">
                    <img
                      src={`/images/slide-${sketch.id}.webp`}
                      alt={sketch.title}
                      className="w-full h-full object-contain max-h-[75vh] pointer-events-none"
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      draggable="false"
                      onContextMenu={(e) => e.preventDefault()}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br ${sketch.gradient} flex items-center justify-center" style={{display: 'none'}}>
                      <p className="text-gray-400 text-sm uppercase tracking-wider">{sketch.title}</p>
                    </div>
                    {/* Overlay anti-save */}
                    <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()} />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/10 to-transparent h-32 pointer-events-none" />
          </div>
        ))}

        {/* Navigation arrows */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-all text-primary hover:scale-105" aria-label="Previous slide">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-all text-primary hover:scale-105" aria-label="Next slide">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ===== BRAND OVERLAY — "The art of pencil." ===== */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex flex-col gap-4 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-gray-200 text-[11px] font-semibold text-accent uppercase tracking-wider w-fit">
              Kelas Menggambar Untuk Semua Umur
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary leading-tight">
              The art of pencil.
            </h1>
            <p className="text-text-light text-sm md:text-base leading-relaxed max-w-xl">
              Pencil sesuatu yang unik, cuma dengan lead hitam bisa membuat suatu gambar yang dramatis, 
              yang bisa bikin orang yang melihat berbisik, &ldquo;Kok bisa gitu ya pakai pensil doang?&rdquo;
            </p>
            <p className="text-text-light text-sm md:text-base leading-relaxed max-w-xl">
              Itulah magisnya pensil. Bagaimana kalau yang ngambar itu Anda? Akan ada sebuah senyum tipis 
              di muka Anda — sebuah kebahagiaan yang tidak bisa dibeli pakai uang.
            </p>
            <div className="flex gap-3 mt-2">
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay — full text */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-white/95 to-transparent pt-28 pb-6 px-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/80 border border-gray-200 text-[10px] font-semibold text-accent uppercase tracking-wider mb-2">
          Kelas Menggambar Untuk Semua Umur
        </span>
        <h1 className="text-3xl font-display font-bold text-primary">The art of pencil.</h1>
        <div className="mt-2 space-y-2 text-sm text-text-light leading-relaxed">
          <p>
            Pencil sesuatu yang unik, cuma dengan lead hitam bisa membuat suatu gambar yang dramatis,
            yang bisa bikin orang yang melihat berbisik, &ldquo;Kok bisa gitu ya pakai pensil doang?&rdquo;
          </p>
          <p>
            Itulah magisnya pensil. Bagaimana kalau yang ngambar itu Anda? Akan ada sebuah senyum tipis
            di muka Anda — sebuah kebahagiaan yang tidak bisa dibeli pakai uang.
          </p>
        </div>
      </div>
    </section>
  );
}
