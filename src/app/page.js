/* =============================================
   HOME PAGE — Halaman Utama
   
   1. HeroCarousel — carousel sketsa + "The art of pencil."
   2. ClassInfo — kartu kelas
   3. CTA section — tombol Daftar & Lihat Kelas
   4. Gallery — galeri sketsa
   ============================================= */

import HeroCarousel from "@/components/HeroCarousel";
import ClassInfo from "@/components/ClassInfo";
import Gallery from "@/components/Gallery";
import Leaderboard from "@/components/Leaderboard";
import TestimoniSection from "@/components/TestimoniSection";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDb } from "@/lib/database";

export const dynamic = 'force-dynamic';

export default function Home() {
  // Fetch testimoni pas render — gak perlu client-side fetch
  let testimonials = [];
  try {
    const db = getDb();
    testimonials = db.prepare("SELECT * FROM testimonials ORDER BY created_at ASC").all();
  } catch {}

  return (
    <>
      <HeroCarousel />
      <ClassInfo />

      {/* ===== CTA SECTION — di tengah, setelah kelas ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-4">
            Siap Mulai Belajar?
          </h2>
          <p className="text-text-light max-w-md mx-auto mb-8 font-light">
            Pilih kelas yang kamu suka dan daftar sekarang. Yuk, wujudkan karya senimu!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/daftar"
              className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-accent-dark transition-all hover:scale-105 shadow-md"
            >
              Daftar Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#kelas"
              className="inline-flex items-center gap-2 border-2 border-gray-300 text-primary px-8 py-3.5 rounded-full text-sm font-semibold hover:border-gray-400 transition-all"
            >
              Lihat Kelas
            </Link>
          </div>
        </div>
      </section>

      <Gallery />
      <Leaderboard />
      <TestimoniSection initialData={testimonials} />
    </>
  );
}
