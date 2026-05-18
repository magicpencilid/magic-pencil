/* =============================================
   LEADERBOARD — Karya Murid Terpopuler
   
   Tampilkan 10 karya approved dengan like terbanyak.
   Kayak IG explore — vibe kompetisi sehat.
   ============================================= */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Trophy, Flame, ArrowRight } from "lucide-react";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/karya/populer")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (data.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===== HEADER ===== */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame className="w-6 h-6 text-orange-500" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
            Karya Paling Populer
            </h2>
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-text-light max-w-2xl mx-auto font-light tracking-wide">
            Karya murid yang paling banyak disukai minggu ini. 
            Semakin sering kamu like, semakin semangat mereka berkarya!
          </p>
          <div className="w-16 h-0.5 bg-primary mx-auto mt-4 opacity-30" />
        </div>

        {/* ===== GRID ===== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data.map((karya, idx) => (
            <div
              key={karya.id}
              className={`relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 
                ${idx < 3 ? "ring-2 ring-offset-2 ring-orange-400" : ""}
                hover:shadow-md transition-all group`}
            >
              {/* Peringkat badge */}
              <div className="absolute top-2 left-2 z-10">
                {idx === 0 ? (
                  <span className="flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
                    <Trophy className="w-3 h-3" /> #1
                  </span>
                ) : idx === 1 ? (
                  <span className="bg-gray-400 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
                    #2
                  </span>
                ) : idx === 2 ? (
                  <span className="bg-amber-700 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
                    #3
                  </span>
                ) : (
                  <span className="bg-gray-800/60 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
                    #{idx + 1}
                  </span>
                )}
              </div>

              {/* Like count badge */}
              <div className="absolute top-2 right-2 z-10">
                <span className="flex items-center gap-0.5 bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                  <Heart className="w-2.5 h-2.5 fill-red-500 text-red-500" />
                  {karya.like_count}
                </span>
              </div>

              {/* Image */}
              <Link href={`/galeri`} className="block">
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  {karya.image_path ? (
                    <img
                      src={karya.image_path}
                      alt={karya.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-300 text-xs">No image</span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Info */}
              <div className="p-3">
                <p className="font-bold text-primary text-xs truncate">{karya.judul}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-gray-400 truncate">{karya.participant_name || "Murid"}</span>
                  {karya.kelas && (
                    <span className="text-[10px] text-gray-300">{karya.kelas}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer link */}
        <div className="text-center mt-10">
          <Link
            href="/galeri"
            className="inline-flex items-center gap-2 text-text-light hover:text-primary text-sm font-medium transition-colors"
          >
            Lihat Semua Karya <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
