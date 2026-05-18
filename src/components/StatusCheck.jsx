/* =============================================
   STATUS CHECK — Cek Status Pendaftaran
   
   User masukin nomor WA → API cek data →
   Nampilin status + invoice kalo ada.
   ============================================= */

"use client";

import { useState } from "react";
import { Phone, Search, CheckCircle, Clock, XCircle, AlertCircle, ArrowRight } from "lucide-react";
import KonfirmasiPembayaran from "./KonfirmasiPembayaran";

const statusConfig = {
  baru: { label: "Baru", icon: Clock, color: "text-gray-700", bg: "bg-gray-100" },
  dikontak: { label: "Menunggu Respon", icon: Clock, color: "text-gray-700", bg: "bg-gray-100" },
  aktif: { label: "Terdaftar", icon: CheckCircle, color: "text-gray-700", bg: "bg-gray-200" },
  batal: { label: "Batal", icon: XCircle, color: "text-gray-500", bg: "bg-gray-100" },
  selesai: { label: "Selesai", icon: CheckCircle, color: "text-gray-500", bg: "bg-gray-100" },
};

export default function StatusCheck() {
  const [wa, setWa] = useState("");
  const [result, setResult] = useState(null);
  const [akunInfo, setAkunInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!wa.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/status?wa=${encodeURIComponent(wa.trim())}`);
      const json = await res.json();

      if (!json.success) {
        setError(json.errors?.[0] || "Data tidak ditemukan");
      } else {
        setResult(json.data);
        setAkunInfo(json.data.akun);
      }
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-alt">
      {/* Header */}
      <div className="gradient-hero py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">Cek Status</h1>
          <p className="text-primary">
            Masukkan nomor WhatsApp yang didaftarkan untuk mengecek status pendaftaran.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-8 pb-16">
        {/* Form Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={wa}
                onChange={(e) => setWa(e.target.value)}
                placeholder="Masukkan no. WhatsApp (contoh: 0812xxxx)"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-accent text-white px-6 py-3 rounded-xl font-semibold hover:bg-accent-dark transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Cari
                </>
              )}
            </button>
          </form>
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Hasil */}
        {result && (
          <div className="space-y-6 animate-slide-up">
            {/* Info Pendaftar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-primary mb-4">Data Pendaftaran</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-light uppercase">Nama Lengkap</p>
                  <p className="font-medium text-primary">{result.registrant.full_name}</p>
                </div>
                <div>
                  <p className="text-xs text-text-light uppercase">Nama Peserta</p>
                  <p className="font-medium text-primary">{result.registrant.participant_name}</p>
                </div>
                <div>
                  <p className="text-xs text-text-light uppercase">Kelas</p>
                  <p className="font-medium text-primary">{result.registrant.class_name}</p>
                </div>
                <div>
                  <p className="text-xs text-text-light uppercase">Tanggal Daftar</p>
                  <p className="font-medium text-primary">{result.registrant.created_at}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-text-light uppercase mb-2">Status</p>
                <div className="flex items-center gap-2">
                  {(() => {
                    const cfg = statusConfig[result.registrant.status] || statusConfig.baru;
                    const Icon = cfg.icon;
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ${cfg.bg} ${cfg.color}`}>
                        <Icon className="w-4 h-4" />
                        {cfg.label}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Invoice kalo ada */}
            {result.invoice && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-primary mb-4">Invoice</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-light uppercase">No. Invoice</p>
                    <p className="font-medium text-primary">{result.invoice.invoice_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-light uppercase">Total</p>
                    <p className="font-bold text-lg text-primary">
                      Investasi {Number(result.invoice.amount).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-light uppercase">Batas Bayar</p>
                    <p className="font-medium text-primary">{result.invoice.payment_due_date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-light uppercase">Status Bayar</p>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      result.invoice.payment_status === "paid" ? "bg-gray-100 text-gray-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {result.invoice.payment_status === "paid" ? "Lunas" : "Menunggu"}
                    </span>
                  </div>
                </div>

                {/* Tombol Konfirmasi Bayar — cuma muncul kalo pending */}
                {result.invoice.payment_status === "pending" && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <KonfirmasiPembayaran
                      registrant={result.registrant}
                      invoice={result.invoice}
                      akunInfo={akunInfo}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
