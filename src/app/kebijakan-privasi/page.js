/* =============================================
   KEBIJAKAN PRIVASI — Halaman Privasi & Data
   
   Dokumen legal standar website.
   Wajib untuk verifikasi WA API Meta.
   ============================================= */

import { Shield, Info, Database, Lock, CheckCircle } from "lucide-react";

const sections = [
  {
    icon: Info,
    title: "Informasi yang Kami Kumpulkan",
    content: `Kami dapat mengumpulkan data seperti nama, alamat email, nomor telepon, dan informasi lain yang diberikan saat pendaftaran atau pengisian formulir.`,
  },
  {
    icon: Database,
    title: "Penggunaan Informasi",
    content: `Informasi yang dikumpulkan digunakan untuk:
- Proses pendaftaran kelas
- Komunikasi terkait layanan
- Peningkatan kualitas layanan`,
  },
  {
    icon: Lock,
    title: "Perlindungan Data",
    content: `Kami menjaga keamanan informasi pengguna dan tidak membagikan data pribadi kepada pihak ketiga tanpa izin, kecuali jika diwajibkan oleh hukum.`,
  },
  {
    icon: CheckCircle,
    title: "Persetujuan",
    content: `Dengan menggunakan layanan kami, Anda menyetujui kebijakan privasi ini.`,
  },
];

export default function KebijakanPrivasiPage() {
  return (
    <div className="min-h-screen bg-surface-alt">
      {/* ===== HEADER ===== */}
      <div className="gradient-hero py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">
            Kebijakan Privasi
          </h1>
          <p className="text-text-light mt-3 max-w-2xl mx-auto">
            Magic Pencil menghargai privasi setiap pengguna. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
          </p>
        </div>
      </div>

      {/* ===== KONTEN ===== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
          {/* Info update */}
          <div className="bg-gray-50 rounded-xl p-4 mb-8 text-sm text-text-light">
            Berlaku sejak: <strong className="text-primary">Mei 2026</strong>
          </div>

          {/* Konten per section */}
          <div className="space-y-10">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <section key={s.title}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-primary mb-3">
                        {s.title}
                      </h2>
                      <div className="text-text-light leading-relaxed whitespace-pre-line">
                        {s.content}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          {/* ===== FOOTER NOTE ===== */}
          <div className="mt-12 pt-8 border-t border-gray-100 text-sm text-text-light">
            <p>
              Jika ada pertanyaan lebih lanjut mengenai kebijakan privasi ini, silakan hubungi kami melalui halaman <a href="/kontak" className="text-accent hover:text-accent-dark underline">Kontak</a>.
            </p>
            <p className="mt-2">
              — <strong>Magic Pencil</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
