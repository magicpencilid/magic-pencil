// Testimoni Section — ditampilin di beranda setelah galeri
// Foto B&W, card putih, scroll horizontal
// Data dikasih dari server (initialData), gak perlu client fetch

"use client";

import { useRef } from "react";

export default function TestimoniSection({ initialData = [] }) {
  const scrollRef = useRef(null);

  if (!initialData || initialData.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          ★ Apa Kata Mereka
        </h2>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {initialData.map((t) => (
            <div
              key={t.id}
              className="flex-shrink-0 w-80 snap-center bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Star rating */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>

              {/* Teks testimoni */}
              <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">
                &ldquo;{t.teks}&rdquo;
              </p>

              {/* Foto + Nama */}
              <div className="flex items-center gap-3">
                {t.photo_path ? (
                  <img
                    src={t.photo_path}
                    alt={t.nama}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm font-bold">
                    {t.nama.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-gray-800 font-semibold text-sm">
                  — {t.nama}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
