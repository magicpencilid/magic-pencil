/* =============================================
   📄 SYARAT & KETENTUAN — Halaman Syket + Alur Daftar
   
   Fungsi ganda:
   - Biasanya: static page buat baca syarat & ketentuan
   - Dari daftar: plus scroll detection + tombol setuju/tidak
   ============================================= */

"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Scale, ChevronRight, CheckCircle, FileText } from "lucide-react";

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

function SyaratKetentuanContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bottomRef = useRef(null);

  const [fromDaftar, setFromDaftar] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [formData, setFormData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [invoiceInfo, setInvoiceInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cek parameter ?from=daftar — ambil data dari sessionStorage
  useEffect(() => {
    if (searchParams.get("from") === "daftar") {
      const saved = sessionStorage.getItem("pendaftaran_data");
      if (saved) {
        setFormData(JSON.parse(saved));
        setFromDaftar(true);
      } else {
        // Safety: data gak ada, balikin ke daftar
        router.replace("/daftar");
      }
    }
  }, [searchParams, router]);

  // IntersectionObserver — deteksi scroll ke bagian paling bawah
  useEffect(() => {
    if (!fromDaftar || !bottomRef.current || submitted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setScrolledToBottom(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px 100px 0px" }
    );

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [fromDaftar, submitted]);

  // Handle "Saya Setuju"
  const handleSetuju = async () => {
    if (!formData) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, agreeTerms: true }),
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.errors?.join(", ") || "Gagal mendaftar");
        setLoading(false);
        return;
      }

      const regId = result.data.id;

      // Generate invoice otomatis
      let invoiceData = null;
      try {
        const invRes = await fetch("/api/invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ registration_id: regId }),
        });
        const invResult = await invRes.json();
        if (invResult.success) invoiceData = invResult.data;
      } catch {
        // Invoice gagal, tapi daftar tetap berhasil
      }

      setInvoiceInfo(invoiceData);
      setLoading(false);
      setSubmitted(true);
      sessionStorage.removeItem("pendaftaran_data");
    } catch (err) {
      setError("Koneksi gagal, coba lagi");
      setLoading(false);
    }
  };

  // Handle "Tidak Setuju"
  const handleTidakSetuju = () => {
    sessionStorage.removeItem("pendaftaran_data");
    router.push("/daftar");
  };

  // =============================================
  // SUCCESS VIEW — setelah berhasil daftar
  // =============================================
  if (submitted && formData) {
    return (
      <div className="min-h-screen bg-surface-alt flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center animate-fade-in">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Pendaftaran Berhasil! 🎉</h2>
            <p className="text-text-light mb-2">
              Terima kasih {formData.fullName}! Data kamu sudah kami terima dan kamu telah menyetujui Syarat & Ketentuan yang berlaku.
            </p>

            {invoiceInfo && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left text-sm mb-6 mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-accent" />
                  <span className="font-semibold text-primary">Invoice Tagihan</span>
                </div>
                <div className="space-y-1 text-text-light">
                  <p>No. Invoice: <strong className="text-primary">{invoiceInfo.invoice_number}</strong></p>
                  <p>Total: <strong className="text-primary text-lg">Investasi {Number(invoiceInfo.amount).toLocaleString("id-ID")}</strong></p>
                  <p>Batas Bayar: <strong className="text-primary">{invoiceInfo.payment_due_date}</strong></p>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                  Transfer ke <strong>BLU BY BCA DIGITAL</strong> a.n. <strong>D Willy Ardhany</strong>
                </div>
              </div>
            )}

            <p className="text-text-light text-sm mb-6">
              Kamu bisa cek status pendaftaran &amp; konfirmasi pembayaran di halaman <strong>Cek Status</strong> dengan nomor WhatsApp kamu.
            </p>

            <a
              href="/status"
              className="inline-block bg-accent text-white px-6 py-2.5 rounded-full font-semibold hover:bg-accent-dark transition-colors"
            >
              Cek Status Pendaftaran →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // =============================================
  // TAMPILAN UTAMA — konten syarat & ketentuan
  // =============================================
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
            {fromDaftar
              ? "Silakan baca dengan saksama, lalu pilih di bagian bawah."
              : "Mohon baca dengan saksama sebelum melakukan pendaftaran."}
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

          {/* ===== Sentinel: pemicu scroll-to-bottom ===== */}
          <div ref={bottomRef} className="h-4" />

          {/* ===== TOMBOL SETUJU / TIDAK SETUJU (hanya dari daftar) ===== */}
          {fromDaftar && scrolledToBottom && !submitted && (
            <div className="mt-10 pt-8 border-t border-gray-100 animate-fade-in">
              <p className="text-center text-sm text-text-light mb-6">
                Dengan menekan <strong>Saya Setuju</strong>, Anda menyatakan telah membaca dan menyetujui seluruh Syarat & Ketentuan di atas.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm mb-4 text-center">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleSetuju}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-accent text-white px-10 py-3.5 rounded-full font-semibold hover:bg-accent-dark transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Mendaftarkan...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Saya Setuju
                    </>
                  )}
                </button>
                <button
                  onClick={handleTidakSetuju}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 border-2 border-gray-300 text-primary px-10 py-3.5 rounded-full font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Tidak Setuju
                </button>
              </div>
            </div>
          )}

          {/* ===== Indikator scroll dulu (kalo dari daftar, belum sampai bawah) ===== */}
          {fromDaftar && !scrolledToBottom && !submitted && (
            <div className="mt-10 pt-8 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-400 animate-pulse">
                ⬇ Scroll ke bawah untuk melanjutkan
              </p>
            </div>
          )}

          {/* ===== Footer note (kalo akses langsung) ===== */}
          {!fromDaftar && (
            <div className="mt-12 pt-8 border-t border-gray-100 text-sm text-text-light">
              <p className="mb-2">
                Dengan mendaftar, Anda menyatakan telah membaca dan menyetujui seluruh Syarat & Ketentuan di atas.
              </p>
              <p>
                — <strong>Magic Pencil</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SyaratKetentuanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-alt" />}>
      <SyaratKetentuanContent />
    </Suspense>
  );
}
