/* =============================================
   ?? MINI STORE — Pengenal Toko Merchandise
   
   Section kecil di homepage setelah Gallery,
   ngenalin toko merchandise Magic Pencil.
   ============================================= */

import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function MiniStore() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
          {/* Icon dekoratif */}
          <div className="hidden md:flex w-14 h-14 rounded-2xl bg-accent/10 items-center justify-center shrink-0">
            <ShoppingBag className="w-7 h-7 text-accent" />
          </div>

          {/* Teks */}
          <div className="flex-1">
            <p className="font-bold text-primary text-xs uppercase tracking-wider mb-1.5">
              Merchandise
            </p>
            <p className="text-text-light text-sm md:text-base leading-relaxed">
              Kami juga menyediakan berbagai produk seperti kaos, totebag, dan merchandise lainnya 
              yang menampilkan karya terbaik dari para murid.
            </p>
          </div>

          {/* Tombol */}
          <Link
            href="/store"
            className="inline-flex items-center gap-2 text-accent text-sm font-semibold hover:text-accent-dark transition-all shrink-0 group"
          >
            Kunjungi Toko
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
