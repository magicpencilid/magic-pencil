/* =============================================
   ?? MINI ABOUT — Pengenal Magic Pencil
   
   Section kecil di homepage setelah hero,
   ngenalin Magic Pencil ke pengunjung baru.
   ============================================= */

import Link from "next/link";
import { Palette, ArrowRight } from "lucide-react";

export default function MiniAbout() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
          {/* Icon dekoratif */}
          <div className="hidden md:flex w-14 h-14 rounded-2xl bg-accent/10 items-center justify-center shrink-0">
            <Palette className="w-7 h-7 text-accent" />
          </div>

          {/* Teks */}
          <div className="flex-1">
            <p className="text-text-light text-sm md:text-base leading-relaxed">
              Magic Pencil adalah penyedia kelas menggambar yang membantu peserta mengembangkan 
              kemampuan seni melalui pembelajaran yang terstruktur dan mudah dipahami.
            </p>
          </div>

          {/* Tombol */}
          <Link
            href="/tentang-kami"
            className="inline-flex items-center gap-2 text-accent text-sm font-semibold hover:text-accent-dark transition-all shrink-0 group"
          >
            Lihat Selengkapnya
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
