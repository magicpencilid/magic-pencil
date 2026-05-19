/* =============================================
   TENTANG KAMI — Profil Magic Pencil
   
   Visi, misi, program, dan informasi umum.
   ============================================= */

import { Palette, Target, BookOpen, Shirt, MapPin, Mail } from "lucide-react";

const programs = [
  "Teknik dasar menggambar pensil",
  "Shading dan pencahayaan",
  "Komposisi dan proporsi",
  "Pengembangan gaya gambar",
];

export default function TentangKamiPage() {
  return (
    <div className="min-h-screen bg-surface-alt">
      {/* ===== HEADER ===== */}
      <div className="gradient-hero py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Palette className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">
            Tentang Kami
          </h1>
          <p className="text-text-light mt-3 max-w-2xl mx-auto">
            Mengembangkan kreativitas seni melalui media pensil dan cat akrilik.
          </p>
        </div>
      </div>

      {/* ===== KONTEN ===== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16 space-y-6">
        
        {/* ===== CARD 1 — Pengantar ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-1">
              <Palette className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-text-light leading-relaxed">
                Magic Pencil adalah penyedia kelas menggambar yang berfokus pada pengembangan kemampuan seni menggunakan media pensil dan cat akrilik. Kami menyediakan program pembelajaran yang dirancang untuk pemula hingga tingkat lanjutan, untuk semua umur.
              </p>
            </div>
          </div>
        </div>

        {/* ===== CARD 2 — Visi & Filosofi ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-1">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-text-light leading-relaxed">
                Didirikan dengan tujuan membantu setiap orang mengekspresikan kreativitasnya, Magic Pencil menghadirkan metode pembelajaran yang terstruktur, mudah dipahami, dan menyenangkan. Kami percaya bahwa setiap orang memiliki potensi untuk menggambar dengan baik melalui latihan yang tepat.
              </p>
            </div>
          </div>
        </div>

        {/* ===== CARD 3 — Program ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-1">
              <BookOpen className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-primary mb-4">
                Program Kami
              </h2>
              <ul className="space-y-2">
                {programs.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-text-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ===== CARD 4 — Merch ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-1">
              <Shirt className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-text-light leading-relaxed">
                Selain menyediakan kelas menggambar, Magic Pencil juga menghadirkan produk kreatif seperti kaos, totebag, dan merchandise lainnya yang menampilkan karya dari para murid. Produk ini merupakan bagian dari dukungan kami terhadap kreativitas dan apresiasi karya seni.
              </p>
            </div>
          </div>
        </div>

        {/* ===== CARD 5 — Info Kontak & Lokasi ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-1">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-text-light leading-relaxed mb-4">
                Magic Pencil beroperasi secara offline, dan melayani peserta dari daerah Bogor, Jakarta dan sekitarnya.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 text-sm">
                <a
                  href="mailto:admin@magicpencil.my.id"
                  className="flex items-center gap-2 text-accent hover:text-accent-dark transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  admin@magicpencil.my.id
                </a>
                <span className="flex items-center gap-2 text-text-light">
                  <MapPin className="w-4 h-4" />
                  Indonesia
                </span>
                <span className="flex items-center gap-2 text-text-light">
                  <MapPin className="w-4 h-4" />
                  Bogor & Jakarta
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
