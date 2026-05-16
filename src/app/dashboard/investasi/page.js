/* =============================================
   💰 INVESTASI — Riwayat Invoice Murid
   
   Nampilin semua invoice murid yang login:
   - Invoice bulanan (lunas/pending)
   - Totalsemua investasi
   ============================================= */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, CheckCircle, Clock, Loader2, AlertCircle, FileText } from "lucide-react";

export default function InvestasiPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth-murid/me")
      .then((r) => r.json())
      .then((res) => {
        if (!res.success) { router.push("/login"); return; }
        setUser(res.data);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/invoice/mine")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setInvoices(res.invoices || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  function formatDate(dateStr) {
    if (!dateStr) return "-";
    // Handle format: "2026-05-23" (date-only) atau "2026-05-16 15:48:00" (datetime)
    const clean = dateStr.split(" ")[0]; // ambil YYYY-MM-DD aja
    if (!clean) return "-";
    const parts = clean.split("-");
    if (parts.length !== 3) return dateStr;
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    if (isNaN(d.getTime())) return dateStr;
    const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
  }

  const totalLunas = invoices
    .filter((inv) => inv.payment_status === "lunas")
    .reduce((sum, inv) => sum + Number(inv.amount), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-primary">Riwayat Investasi</h1>
            {user && <p className="text-xs text-text-light">{user.kelas}</p>}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Ringkasan Total */}
        {invoices.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs text-text-light mb-1">Total Investasi</p>
            <p className="text-2xl font-bold text-primary">
              Rp {totalLunas.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-text-light mt-1">
              {invoices.filter((inv) => inv.payment_status === "lunas").length} dari {invoices.length} invoice lunas
            </p>
          </div>
        )}

        {/* Daftar Invoice */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-20 text-text-light">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-base font-medium">Belum ada invoice</p>
            <p className="text-sm mt-1">Invoice akan muncul setelah kamu mendaftar kelas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => {
              const isLunas = inv.payment_status === "lunas";
              return (
                <div
                  key={inv.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <CreditCard className={`w-5 h-5 ${isLunas ? "text-gray-600" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary">{inv.class_name}</p>
                        <p className="text-xs text-text-light">{inv.invoice_number}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isLunas
                        ? "bg-gray-200 text-gray-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {isLunas ? "Lunas" : "Pending"}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm">
                    <p className="font-bold text-primary text-base">
                      Investasi Rp {Number(inv.amount).toLocaleString("id-ID")}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-text-light mt-2">
                      <div>
                        <span className="block text-gray-400">Tanggal</span>
                        <span className="text-primary">{formatDate(inv.created_at)}</span>
                      </div>
                      <div>
                        <span className="block text-gray-400">Batas Bayar</span>
                        <span className="text-primary">{formatDate(inv.payment_due_date)}</span>
                      </div>
                    </div>
                    {inv.pembayaran?.verified_at && (
                      <p className="text-gray-600 text-xs mt-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-gray-400" />
                        Dibayar & terverifikasi {formatDate(inv.pembayaran.verified_at)}
                      </p>
                    )}
                  </div>

                  {!isLunas && (
                    <a
                      href="/status"
                      className="mt-3 inline-flex items-center gap-1 text-accent text-xs font-semibold hover:text-accent-dark"
                    >
                      <AlertCircle className="w-3 h-3" />
                      Konfirmasi Pembayaran →
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
