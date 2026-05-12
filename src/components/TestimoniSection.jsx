// Testimoni Section — ditampilin di beranda setelah galeri
// Minimal: nama + quote aja, tanpa foto, tanpa bintang
// Data dikasih dari server (initialData)

"use client";

import { useRef } from "react";

export default function TestimoniSection({ initialData = [] }) {
  const scrollRef = useRef(null);

  if (!initialData || initialData.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Mereka dan Gambar
        </h2>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {initialData.map((t) => (
            <div
              key={t.id}
              className="flex-shrink-0 w-72 snap-center bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              {/* Quote */}
              <p className="text-gray-500 text-sm leading-relaxed mb-6 italic">
                &ldquo;{t.teks}&rdquo;
              </p>

              {/* Nama */}
              <div className="text-right">
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
