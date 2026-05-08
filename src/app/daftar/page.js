/* =============================================
   📝 DAFTAR PAGE — Halaman Pendaftaran
   
   Halaman ini nampilin form pendaftaran dengan:
   - Header informasi
   - Form isian
   
   Masih static (belum connect ke backend).
   Di Tahap 3 nanti data beneran masuk database.
   ============================================= */

import RegistrationForm from "@/components/RegistrationForm";
import { Palette, Shield, Clock, Award } from "lucide-react";

/* Keunggulan — tinggal ditambah kalo perlu */
const benefits = [
  {
    icon: Palette,
    text: "Bimbingan pengajar profesional & berpengalaman",
  },
  {
    icon: Clock,
    text: "Jadwal fleksibel, pilih hari yang cocok",
  },
  {
    icon: Award,
    text: "Kelas yang gembira dan menyenangkan",
  },
  {
    icon: Shield,
    text: "Alat & bahan belajar sudah disediakan",
  },
];

export default function DaftarPage() {
  return (
    <div className="min-h-screen bg-surface-alt">
      {/* ===== HEADER HALAMAN ===== */}
      <div className="gradient-hero py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-3">
            Daftar Kelas
          </h1>
          <p className="text-primary/70 max-w-2xl mx-auto">
            Isi form di bawah untuk mendaftar. Tim kami akan menghubungi kamu
            melalui WhatsApp dalam 1x24 jam.
          </p>
        </div>
      </div>

      {/* ===== KONTEN UTAMA ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* ===== KIRI: FORM ===== */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-primary mb-6">
                Form Pendaftaran
              </h2>
              <RegistrationForm />
            </div>
          </div>

          {/* ===== KANAN: INFO SAMPINGAN ===== */}
          <div className="space-y-6">
            {/* Kenapa pilih Magic Pencil */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-primary mb-4">
                Kenapa Magic Pencil?
              </h3>
              <ul className="space-y-4">
                {benefits.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-sm text-text-light">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Kontak */}
            <div className="bg-primary rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-3">Ada pertanyaan?</h3>
              <p className="text-sm text-gray-300 mb-4">
                Hubungi kami langsung via WhatsApp untuk konsultasi gratis.
              </p>
              <a
                href="https://wa.me/628111150563"
                target="_blank"
                className="block text-center bg-white text-primary font-bold py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Chat WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
