/* =============================================
   📊 DASHBOARD — Halaman Utama Murid
   
   Fitur:
   - Informasi akun
   - Check-in / Check-out absensi
   - Status absensi hari ini
   - Jadwal hari ini
   - Riwayat absensi
   ============================================= */

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Calendar, Clock, BookOpen, CreditCard,
  CheckCircle, XCircle, Loader2, LogIn, User, LogOut, ImageIcon, AlertCircle,
} from "lucide-react";
import NotificationManager from "@/components/NotificationManager";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [absensiHariIni, setAbsensiHariIni] = useState(null);
  const [absensiLoading, setAbsensiLoading] = useState(false);
  const [absensiMsg, setAbsensiMsg] = useState("");
  const [riwayat, setRiwayat] = useState([]);
  const [invoiceData, setInvoiceData] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(true);

  const fetchAbsensi = useCallback(async () => {
    try {
      const [hariRes, riwayatRes] = await Promise.all([
        fetch("/api/absensi/hari-ini"),
        fetch("/api/absensi"),
      ]);
      const hariData = await hariRes.json();
      const riwayatData = await riwayatRes.json();
      if (hariData.success) setAbsensiHariIni(hariData.data);
      if (riwayatData.success) setRiwayat(riwayatData.data.slice(0, 5));
    } catch {}
  }, []);

  const fetchInvoice = useCallback(async () => {
    try {
      const res = await fetch("/api/invoice/mine");
      const data = await res.json();
      if (data.success) setInvoiceData(data.data);
    } catch {}
    setInvoiceLoading(false);
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth-murid/me");
      const data = await res.json();
      if (!data.success) {
        router.push("/login");
        return;
      }
      setUser(data.data);
      fetchAbsensi();
      fetchInvoice();
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router, fetchAbsensi]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  async function handleCheckin() {
    setAbsensiLoading(true);
    setAbsensiMsg("");
    try {
      const res = await fetch("/api/absensi/checkin", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setAbsensiMsg("✅ Check-in berhasil!");
        fetchAbsensi();
      } else {
        setAbsensiMsg("❌ " + (data.error || "Gagal check-in"));
      }
    } catch {
      setAbsensiMsg("❌ Gagal menghubungi server");
    }
    setAbsensiLoading(false);
  }

  async function handleCheckout() {
    setAbsensiLoading(true);
    setAbsensiMsg("");
    try {
      const res = await fetch("/api/absensi/checkout", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setAbsensiMsg("✅ Check-out berhasil!");
        fetchAbsensi();
      } else {
        setAbsensiMsg("❌ " + (data.error || "Gagal check-out"));
      }
    } catch {
      setAbsensiMsg("❌ Gagal menghubungi server");
    }
    setAbsensiLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) return null;

  const initial = user.nama?.charAt(0)?.toUpperCase() || "?";
  const sudahCheckin = absensiHariIni?.check_in;
  const sudahCheckout = absensiHariIni?.check_out;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar mini */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-600">{initial}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">{user.nama}</p>
              <p className="text-xs text-text-light">{user.kelas}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-text-light hover:text-accent">
              Beranda
            </Link>
            <button
              onClick={async () => {
                await fetch("/api/auth-murid/logout", { method: "POST" });
                router.push("/login");
              }}
              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-400" />
            Profil
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-light">Nama</span>
              <p className="font-medium text-primary">{user.nama}</p>
            </div>
            <div>
              <span className="text-text-light">Email</span>
              <p className="font-medium text-primary">{user.email || "-"}</p>
            </div>
            <div>
              <span className="text-text-light">Kelas</span>
              <p className="font-medium text-primary">{user.kelas}</p>
            </div>
            <div>
              <span className="text-text-light">WhatsApp</span>
              <p className="font-medium text-primary">{user.whatsapp}</p>
            </div>
          </div>
        </div>

        {/* 🎯 ABSENSI CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <LogIn className="w-5 h-5 text-gray-400" />
            Absensi Hari Ini
          </h2>

          {absensiMsg && (
            <div className="mb-4 text-sm font-medium">{absensiMsg}</div>
          )}

          {/* Status badge */}
          <div className="flex items-center gap-3 mb-5">
            <div className={`p-2 rounded-full ${sudahCheckin ? (sudahCheckout ? "bg-gray-100" : "bg-gray-200") : "bg-gray-50"}`}>
              {sudahCheckin ? (
                <CheckCircle className="w-6 h-6 text-gray-600" />
              ) : (
                <XCircle className="w-6 h-6 text-gray-300" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">
                {sudahCheckout ? "✅ Selesai (Check-out)" :
                 sudahCheckin ? "⏳ Belum Check-out" :
                 "⏳ Belum Check-in"}
              </p>
              <p className="text-xs text-text-light">
                {sudahCheckin ? `Masuk: ${absensiHariIni.check_in}` : "Belum absen hari ini"}
                {sudahCheckout && ` • Keluar: ${absensiHariIni.check_out}`}
              </p>
            </div>
          </div>

          {/* Tombol */}
          <div className="flex gap-3">
            {!sudahCheckin && (
              <button
                onClick={handleCheckin}
                disabled={absensiLoading}
                className="flex-1 bg-accent text-white py-3 rounded-full text-sm font-semibold hover:bg-accent-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {absensiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                {absensiLoading ? "Memproses..." : "✅ Check-in"}
              </button>
            )}
            {sudahCheckin && !sudahCheckout && (
              <button
                onClick={handleCheckout}
                disabled={absensiLoading}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-full text-sm font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {absensiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                {absensiLoading ? "Memproses..." : "🚪 Check-out"}
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/dashboard/jadwal"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all text-center"
          >
            <Calendar className="w-7 h-7 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-primary">Jadwal</p>
            <p className="text-xs text-text-light">Lihat jadwal kelas</p>
          </Link>
          <Link
            href="/dashboard/absensi"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all text-center"
          >
            <CheckCircle className="w-7 h-7 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-primary">Riwayat Absensi</p>
            <p className="text-xs text-text-light">Lihat semua absensi</p>
          </Link>
          <Link
            href="/dashboard/karya"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all text-center"
          >
            <ImageIcon className="w-7 h-7 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-primary">Karya Saya</p>
            <p className="text-xs text-text-light">Upload & galeri pribadi</p>
          </Link>
          {/* Investasi Card — dinamis dari API, klik masuk riwayat */}
          <Link
            href="/dashboard/investasi"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all block">
            {invoiceLoading ? (
              <div className="text-center">
                <Loader2 className="w-6 h-6 animate-spin text-gray-300 mx-auto mb-2" />
              </div>
            ) : !invoiceData ? (
              <div className="text-center">
                <CreditCard className="w-7 h-7 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-400">Investasi</p>
                <p className="text-xs text-text-light">Belum ada invoice</p>
              </div>
            ) : (
              <>
                {/* Header: Status + Icon */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <p className="text-sm font-semibold text-primary">Investasi</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    invoiceData.payment_status === 'lunas'
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {invoiceData.payment_status === 'lunas' ? 'Lunas' : 'Pending'}
                  </span>
                </div>

                {/* Detail */}
                <div className="space-y-1 text-xs text-text-light">
                  <p className="font-medium text-primary text-sm">
                    Investasi {Number(invoiceData.amount).toLocaleString("id-ID")}
                  </p>
                  {invoiceData.payment_status !== 'lunas' && (
                    <>
                      <p>No. {invoiceData.invoice_number}</p>
                      <p>Batas: {invoiceData.payment_due_date}</p>
                    </>
                  )}
                  {invoiceData.pembayaran?.verified_at && (
                    <p className="text-gray-600 text-xs mt-1">
                      ✓ Terverifikasi
                    </p>
                  )}
                </div>
              </>
            )}
          </Link>
        </div>

        {/* Riwayat Absensi */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            Riwayat Absensi
          </h2>
          {riwayat.length === 0 ? (
            <div className="text-center py-6 text-text-light">
              <p className="text-sm">Belum ada riwayat absensi</p>
            </div>
          ) : (
            <div className="space-y-2">
              {riwayat.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    {r.check_out ? (
                      <CheckCircle className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-300" />
                    )}
                    <span className="text-sm text-primary">{r.tanggal}</span>
                  </div>
                  <div className="text-xs text-text-light">
                    {r.check_in ? r.check_in.split(",")[1]?.trim() || r.check_in : "-"}
                    {r.check_out ? ` → ${r.check_out.split(",")[1]?.trim() || r.check_out}` : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔔 PWA + Notifikasi */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <NotificationManager />
        </div>
      </main>
    </div>
  );
}
