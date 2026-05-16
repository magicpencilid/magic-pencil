/* =============================================
   💰 KELAS ADMIN — Kelola Kelas & Harga
   
   ✅ FIXED — 5 kelas dengan harga tetap.
   ============================================= */

"use client";

import { BookOpen, CheckCircle } from "lucide-react";

const fixedKelas = [
  {
    name: "Kelas Sketsa",
    price: 1000000,
    type: "monthly",
    desc: "Belajar menyeket bentuk global sebagai pondasi drawing",
  },
  {
    name: "Kelas Gambar",
    price: 1000000,
    type: "monthly",
    desc: "Mengarsir volume, proporsi, depth, hingga komposisi",
  },
  {
    name: "Kelas Private",
    price: null,
    type: "monthly",
    desc: "Bimbingan personal 1-on-1 dengan pengajar. Materi, jadwal, dan durasi bisa disesuaikan.",
  },
  {
    name: "Sesi Lukis Anabul",
    price: 350000,
    type: "single",
    desc: "Lukis anabul kesayanganmu — 1x sesi, alat lengkap",
  },
  {
    name: "Sesi Sketsa",
    price: 300000,
    type: "single",
    desc: "Sketsa sesuai keinginanmu — 1x sesi, alat lengkap",
  },
  {
    name: "Sesi Gambar",
    price: 300000,
    type: "single",
    desc: "Gambar apapun yang kamu suka — 1x sesi, alat lengkap",
  },
];

const formatPrice = (price) => {
  if (price === null) return null;
  return `IDR ${price.toLocaleString("id-ID")}`;
};

export default function KelasAdmin() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-gray-500" />
          Kelola Kelas & Investasi
        </h1>
        <p className="text-sm text-text-light mt-1">
          Daftar kelas dan investasi yang tersedia.
        </p>
      </div>

      {/* Daftar Kelas */}
      <div className="space-y-4">
        {fixedKelas.map((k, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">{k.name}</h3>
                <p className="text-xs text-text-light">{k.desc}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Investasi</p>
              {k.price ? (
                <p className="text-lg font-bold text-primary">{formatPrice(k.price)}</p>
              ) : (
                <p className="text-sm font-semibold text-accent bg-accent/5 px-3 py-1 rounded-full">Hubungi Admin</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-text-light mt-6">
        <p className="font-semibold mb-1 text-gray-700">Informasi:</p>
        <p>• Daftar kelas & investasi bersifat tetap dan tidak bisa diubah dari sini.</p>
        <p>• Hubungi developer jika ada perubahan data kelas.</p>
      </div>
    </div>
  );
}
