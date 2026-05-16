"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/* =============================================
   🛍️ Halaman Store — Katalog Merch Magic Pencil
   ============================================= */

const KATEGORI = ["Semua", "Totebag", "Kaos", "Mug", "Lainnya"];

export default function StorePage() {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kategoriAktif, setKategoriAktif] = useState("Semua");
  const [selected, setSelected] = useState(null); // produk yang diklik
  const [ukuranDipilih, setUkuranDipilih] = useState("");
  const [warnaDipilih, setWarnaDipilih] = useState("");
  const [jumlah, setJumlah] = useState(1);
  const [namaPemesan, setNamaPemesan] = useState("");
  const [waPemesan, setWaPemesan] = useState("");

  useEffect(() => {
    fetch("/api/produk")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setProduk(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    kategoriAktif === "Semua"
      ? produk
      : produk.filter((p) => p.kategori === kategoriAktif.toLowerCase());

  function openDetail(p) {
    setSelected(p);
    setUkuranDipilih(p.ukuran_tersedia?.[0] || "");
    setWarnaDipilih(p.warna_tersedia?.[0] || "");
    setJumlah(1);
    setNamaPemesan("");
    setWaPemesan("");
    document.body.classList.add("store-modal-open");
  }

  function closeDetail() {
    setSelected(null);
    document.body.classList.remove("store-modal-open");
  }

  function buatWaLink() {
    if (!selected) return "#";
    const namaBarang = `${selected.nama}`;
    const ukuranTeks = ukuranDipilih ? `📏 Ukuran: ${ukuranDipilih}\n` : "";
    const warnaTeks = warnaDipilih ? `🎨 Warna: ${warnaDipilih}\n` : "";
    const text = encodeURIComponent(
      `Halo kak, saya mau pesan:\n📦 ${namaBarang} - ${jumlah}x\n${ukuranTeks}${warnaTeks}👤 Nama: ${namaPemesan || "(isi nama)"}\n📱 WA: ${waPemesan || "(isi WA)"}\n\nMohon info biaya + ongkir. Terima kasih 🙏`
    );
    return `https://wa.me/628111150563?text=${text}`;
  }

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-16 flex items-center justify-center">
        <div className="animate-spin-slow w-8 h-8 border-2 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Header ─── */}
        <div className="text-center mb-8">
          <h1 className="font-[var(--font-display)] text-3xl md:text-4xl text-[var(--color-primary)] mb-2">
            Merch Magic Pencil
          </h1>
          <p className="text-[var(--color-text-light)] text-sm max-w-md mx-auto">
            Karya murid — di kaos, totebag, dan mug. Edisi terbatas.
          </p>
        </div>

        {/* ─── Filter Kategori ─── */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {KATEGORI.map((k) => (
            <button
              key={k}
              onClick={() => setKategoriAktif(k)}
              className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                kategoriAktif === k
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                  : "bg-white text-[var(--color-text-light)] border-[var(--color-border)] hover:border-[var(--color-accent)]"
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        {/* ─── Grid Produk ─── */}
        {filtered.length === 0 ? (
          <p className="text-center text-[var(--color-text-light)] py-12">
            Belum ada produk tersedia.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => openDetail(p)}
                className="group text-left bg-[var(--color-surface-alt)] rounded-lg overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
              >
                {/* Foto */}
                <div className="w-full h-56 bg-[var(--color-surface-alt)] relative overflow-hidden">
                  {p.gambar ? (
                    <Image
                      src={p.gambar}
                      alt={p.nama}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--color-text-light)] text-sm">
                      {p.kategori === "totebag" ? "👜" : p.kategori === "kaos" ? "👕" : p.kategori === "mug" ? "☕" : "🎁"}
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-3">
                  <p className="text-xs text-[var(--color-text-light)] uppercase tracking-wider mb-0.5">
                    {p.kategori}
                  </p>
                  <p className="text-sm font-medium text-[var(--color-primary)] truncate">
                    {p.nama}
                  </p>
                  <p className="text-sm text-[var(--color-accent)] mt-1">
                    Rp {p.harga.toLocaleString("id-ID")}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── Modal Detail Produk ─── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={closeDetail}
        >
          <div
            className="bg-white w-full sm:max-w-lg sm:rounded-xl rounded-t-xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gambar */}
            <div className="relative w-full h-72 sm:h-80 md:h-96 bg-[var(--color-surface-alt)]">
              {selected.gambar ? (
                <Image
                  src={selected.gambar}
                  alt={selected.nama}
                  fill
                  className="object-contain p-4"
                  sizes="500px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  {selected.kategori === "totebag" ? "👜" : selected.kategori === "kaos" ? "👕" : selected.kategori === "mug" ? "☕" : "🎁"}
                </div>
              )}
              <button
                onClick={closeDetail}
                className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-[var(--color-primary)] text-lg hover:bg-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Info Produk */}
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-[var(--color-text-light)] uppercase tracking-wider">
                  {selected.kategori}
                </p>
                <h2 className="text-xl font-[var(--font-display)] text-[var(--color-primary)] mt-0.5">
                  {selected.nama}
                </h2>
                <p className="text-lg text-[var(--color-accent)] font-medium mt-1">
                  Rp {selected.harga.toLocaleString("id-ID")}
                </p>
              </div>

              {selected.deskripsi && (
                <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
                  {selected.deskripsi}
                </p>
              )}

              {/* Pilih Warna */}
              {selected.warna_tersedia?.length > 0 && (
                <div>
                  <p className="text-xs text-[var(--color-text-light)] uppercase tracking-wider mb-2">
                    Pilih Warna
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selected.warna_tersedia.map((w) => (
                      <button
                        key={w}
                        onClick={() => setWarnaDipilih(w)}
                        className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                          warnaDipilih === w
                            ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                            : "bg-white text-[var(--color-text-light)] border-[var(--color-border)] hover:border-[var(--color-accent)]"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pilih Ukuran */}
              {selected.ukuran_tersedia?.length > 0 && (
                <div>
                  <p className="text-xs text-[var(--color-text-light)] uppercase tracking-wider mb-2">
                    Pilih Ukuran
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selected.ukuran_tersedia.map((u) => (
                      <button
                        key={u}
                        onClick={() => setUkuranDipilih(u)}
                        className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                          ukuranDipilih === u
                            ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                            : "bg-white text-[var(--color-text-light)] border-[var(--color-border)] hover:border-[var(--color-accent)]"
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Jumlah */}
              <div>
                <p className="text-xs text-[var(--color-text-light)] uppercase tracking-wider mb-2">
                  Jumlah
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setJumlah(Math.max(1, jumlah - 1))}
                    className="w-8 h-8 rounded-full border border-[var(--color-border)] flex items-center justify-center text-sm hover:border-[var(--color-accent)] transition-colors"
                  >
                    –
                  </button>
                  <span className="text-sm font-medium text-[var(--color-primary)] w-6 text-center">
                    {jumlah}
                  </span>
                  <button
                    onClick={() => setJumlah(jumlah + 1)}
                    className="w-8 h-8 rounded-full border border-[var(--color-border)] flex items-center justify-center text-sm hover:border-[var(--color-accent)] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Form Pemesan */}
              <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
                <p className="text-xs text-[var(--color-text-light)] uppercase tracking-wider">
                  Data Pemesan
                </p>
                <input
                  type="text"
                  placeholder="Nama lengkap"
                  value={namaPemesan}
                  onChange={(e) => setNamaPemesan(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] bg-white"
                />
                <input
                  type="text"
                  placeholder="No. WhatsApp"
                  value={waPemesan}
                  onChange={(e) => setWaPemesan(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] bg-white"
                />
              </div>

              {/* Tombol WA */}
              <a
                href={buatWaLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-[var(--color-primary)] text-white text-center text-sm font-medium rounded-lg hover:bg-[var(--color-primary-light)] transition-colors"
              >
                Pesan via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
