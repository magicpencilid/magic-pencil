/* =============================================
   📄 SYARAT & KETENTUAN — Halaman Syket
   
   Static page — ngga perlu client component
   ============================================= */

import { Scale, ChevronRight } from "lucide-react";

const sections = [
  {
    title: "1. Pendaftaran dan Aplikasi",
    content: `Silahkan buka Google Chrome dan lakukan pendaftaran di kolom "Daftar Sekarang".`
  },
  {
    title: "2. Pembayaran",
    content: `Murid dianggap resmi terdaftar setelah mengisi formulir pendaftaran dan melunasi biaya kelas (bulanan/per sesi). 

Pembayaran tidak dapat dibayar sebagian atau dicicil.

Pembayaran dapat dilakukan secara Virtual Account, QRIS ataupun transfer.

Biaya yang sudah dibayarkan tidak dapat ditarik kembali (non-refundable), namun bisa dipindahtangankan kepada orang lain dengan konfirmasi terlebih dahulu.`
  },
  {
    title: "3. Kehadiran dan Penjadwalan",
    content: `Konfirmasi kehadiran dilakukan melalui aplikasi Magic Pencil dengan melakukan check-in / check-out.

Pengaturan jadwal kelas termasuk ketersediaan pengajar dan slot kapasitas yang tersedia semua dilakukan di aplikasi Klaskoo.

Jika berhalangan hadir, harap melakukan perubahan jadwal sehari sebelum kelas dimulai.

Sesi pengganti dikarenakan berhalangan hadir, maka akan diberikan perpanjangan waktu 1 jam pada minggu berikutnya sesuai dengan jadwal kelas yang bersangkutan, tidak di kelas grup lain.

Jika sampai dengan akhir bulan tidak terpenuhi maka akan diberikan waktu 1 jam setelah sesi grup berakhir di minggu pertama awal bulan dengan syarat mendaftar kembali dan melunasi kelas bulan yang berikutnya, selebihnya dianggap hangus.`
  },
  {
    title: "4. Jadwal Kelas & Venue",
    content: `Kelas terbagi menjadi 3 sesi:

  10.00 — 12.00
  13.00 — 15.00
  15.00 — 17.00

Setiap kelas perdana wajib diadakan di Foodcourt Mall Jogja Junction, untuk selanjutnya dilakukan sesuai dengan kesepakatan grup kelas.

Kelas setiap minggunya akan diinformasikan melalui aplikasi dan WhatsApp.

Venue yang dipilih harus tetap di tempat umum dan tidak dapat diadakan di rumah.

Jika terdapat kelas beruntun, maka kelas kedua akan diadakan di tempat yang sama dengan kelas pertama.`
  },
  {
    title: "5. Peralatan Gambar",
    content: `Untuk kelas bulanan, wajib membawa peralatan dasar pribadi seperti: buku sketsa, pensil, pengserut dan penghapus.

Untuk kelas harian, semua keperluan gambar seperti kertas sketsa, pensil, pengserut, penghapus dan cat akrilik sudah disediakan.`
  },
  {
    title: "6. Dokumentasi & Hak Cipta",
    content: `Hak cipta karya tetap milik murid.

Namun, pihak Magic Pencil berhak mengambil foto/video proses dan hasil karya untuk keperluan portofolio atau promosi di media sosial (kecuali jika murid keberatan).

Karya murid akan ditampilkan di website Magic Pencil Student Wall.

Jika ada yang menyenangi karya kamu dan ingin membelinya, kami akan memfasilitasi di sini.`
  }
];

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen bg-surface-alt">
      {/* ===== HEADER ===== */}
      <div className="gradient-hero py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">
            Syarat & Ketentuan
          </h1>
          <p className="text-primary/70 mt-3 max-w-2xl mx-auto">
            Mohon baca dengan saksama sebelum melakukan pendaftaran.
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

          {/* Daftar isi */}
          <nav className="mb-10 pb-8 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-text-light uppercase tracking-wider mb-3">
              Daftar Isi
            </h2>
            <ul className="space-y-1.5">
              {sections.map((s) => (
                <li key={s.title}>
                  <a
                    href={`#${s.title.toLowerCase().replace(/[\s.&]+/g, "-")}`}
                    className="text-sm text-accent hover:text-accent-dark transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Konten per section */}
          <div className="space-y-10">
            {sections.map((s) => (
              <section
                key={s.title}
                id={s.title.toLowerCase().replace(/[\s.&]+/g, "-")}
              >
                <h2 className="text-xl font-bold text-primary mb-4">
                  {s.title}
                </h2>
                <div className="text-text-light leading-relaxed whitespace-pre-line">
                  {s.content}
                </div>
              </section>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-12 pt-8 border-t border-gray-100 text-sm text-text-light">
            <p className="mb-2">
              Dengan mendaftar, Anda menyatakan telah membaca dan menyetujui seluruh Syarat & Ketentuan di atas.
            </p>
            <p>
              — <strong>Magic Pencil</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
