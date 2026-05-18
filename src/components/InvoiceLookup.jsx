/* =============================================
   INVOICE LOOKUP — Cari / Lihat Invoice
   
   User bisa:
   - Cari invoice by nomor invoice
   - Atau langsung liat invoice kalo ada parameter ?id=
   ============================================= */

"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock, FileText, Search, AlertCircle, Download, Printer } from "lucide-react";

export default function InvoiceLookup() {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/invoice");
      const json = await res.json();

      if (json.success) {
        const found = json.data.find(
          (inv) => inv.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (found) {
          setInvoice(found);
        } else {
          setError("Invoice tidak ditemukan");
        }
      }
    } catch {
      setError("Gagal mencari invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-alt">
      {/* Header */}
      <div className="gradient-hero py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">Invoice</h1>
          <p className="text-primary/70">
            Cek invoice pembayaran kursus Magic Pencil.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-8 pb-16">
        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nomor invoice (INV-...)"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-accent text-white px-6 py-3 rounded-xl font-semibold hover:bg-accent-dark transition-colors disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
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

        {/* Invoice Detail */}
        {invoice && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-text-light uppercase mb-1">Invoice</p>
                <h2 className="text-xl font-bold text-primary">{invoice.invoice_number}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 text-sm bg-gray-100 text-text-light px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <div className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 ${
                  invoice.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {invoice.payment_status === "paid" ? <><CheckCircle className="w-4 h-4" /> LUNAS</> : <><Clock className="w-4 h-4" /> PENDING</>}
                </div>
              </div>
            </div>

            {/* Detail */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-text-light">Nama Pendaftar</span>
                <span className="font-medium text-primary">{invoice.full_name || "-"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-text-light">Nama Peserta</span>
                <span className="font-medium text-primary">{invoice.participant_name || "-"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-text-light">Tanggal</span>
                <span className="font-medium text-primary">{invoice.created_at}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-text-light">Batas Bayar</span>
                <span className="font-medium text-primary">{invoice.payment_due_date || "-"}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-lg font-bold text-primary">Total</span>
                <span className="text-lg font-bold text-primary">
                  Investasi {Number(invoice.amount).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Info pembayaran */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
              <p className="font-semibold mb-1">Cara Pembayaran</p>
              <p>Transfer ke <strong>BLU BY BCA DIGITAL</strong></p>
              <p>Atas nama <strong>D Willy Ardhany</strong></p>
              <p>No.Rek <strong>001662116182</strong></p>
              <p className="mt-2 text-gray-500">
                Konfirmasi pembayaran via WhatsApp setelah transfer.
              </p>
            </div>
          </div>
        )}

        {/* Belum ada invoice */}
        {!invoice && !loading && !error && (
          <div className="text-center py-12 text-text-light">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Masukkan nomor invoice untuk melihat detail</p>
          </div>
        )}
      </div>
    </div>
  );
}
