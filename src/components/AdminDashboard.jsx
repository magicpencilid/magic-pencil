/* =============================================
   📊 ADMIN DASHBOARD — Monochrome Gallery Style
   Hitam, putih, abu-abu aja.
   ============================================= */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  BookOpen,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentRegistrants, setRecentRegistrants] = useState([]);
  const [pendingPembayaran, setPendingPembayaran] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, pendaftarRes, pembayaranRes] = await Promise.all([
          fetch("/api/stats").then((r) => r.json()),
          fetch("/api/pendaftar?limit=5&sort=terbaru").then((r) => r.json()),
          fetch("/api/pembayaran?status=pending&limit=5").then((r) => r.json()),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (pendaftarRes.success) setRecentRegistrants(pendaftarRes.data || []);
        if (pembayaranRes.success) setPendingPembayaran(pembayaranRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div>
          <div className="skeleton h-8 w-48"></div>
          <div className="skeleton h-4 w-64 mt-2"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="skeleton h-10 w-10 rounded-xl"></div>
              <div className="skeleton h-8 w-24 mt-4"></div>
              <div className="skeleton h-4 w-32 mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    { icon: Users, label: "Total Pendaftar", value: stats?.total || 0, href: null },
    { icon: TrendingUp, label: "Hari Ini", value: stats?.today || 0, href: null },
    {
      icon: Clock,
      label: "Pending Verifikasi",
      value: stats?.pendingVerifikasi || 0,
      href: "/admin/pembayaran",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `Investasi ${Number(stats?.totalRevenue || 0).toLocaleString("id-ID")}`,
      href: null,
    },
  ];

  const statusColors = {
    baru: "bg-gray-200 text-gray-700",
    dikontak: "bg-gray-200 text-gray-700",
    aktif: "bg-gray-200 text-gray-700",
    batal: "bg-gray-100 text-gray-500",
    selesai: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <p className="text-sm text-text-light">Overview data pendaftaran Magic Pencil</p>
      </div>

      {/* ========== 1. STATS CARDS ========== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover ${card.href ? "cursor-pointer" : ""}`}
              onClick={() => card.href && (window.location.href = card.href)}
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary mt-3">{card.value}</p>
              <p className="text-sm text-text-light">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* ========== 2. MURID RESMI ========== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 card-hover">
        <h2 className="font-bold text-primary flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-primary" />
          Murid Resmi Magic Pencil
        </h2>
        {stats?.verifiedStudents && stats.verifiedStudents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.verifiedStudents.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-white">
                    {s.participant_name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary truncate">{s.participant_name}</p>
                  <p className="text-xs text-text-light truncate">
                    {s.class_name}{s.full_name ? `  ${s.full_name}` : ""}
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-gray-300 shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <CheckCircle className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-text-light">Belum ada murid resmi</p>
          </div>
        )}
      </div>

      {/* ========== 3. PENDAFTAR + KONFIRMASI ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-primary flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Pendaftar Terbaru
            </h2>
            <Link
              href="/admin/pendaftar"
              className="text-xs text-text-light hover:text-primary flex items-center gap-1 transition-all"
            >
              Lihat semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentRegistrants.length === 0 ? (
            <p className="text-sm text-text-light py-4 text-center">Belum ada pendaftar</p>
          ) : (
            <div className="space-y-2">
              {recentRegistrants.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-transparent transition-all"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-400 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-white">
                      {p.participant_name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary truncate">{p.participant_name}</p>
                    <p className="text-xs text-text-light truncate">{p.class_name}{p.full_name ? `  ${p.full_name}` : ""}</p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                      statusColors[p.status] || "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Verifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-primary flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Konfirmasi Pembayaran
            </h2>
            <Link
              href="/admin/pembayaran"
              className="text-xs text-text-light hover:text-primary flex items-center gap-1 transition-all"
            >
              Lihat semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {pendingPembayaran.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-text-light">Tidak ada konfirmasi pending</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingPembayaran.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-400 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary truncate">
                      {p.participant_name || p.full_name || `ID ${p.registration_id}`}
                    </p>
                    <p className="text-xs text-text-light">
                      Investasi {Number(p.amount || 0).toLocaleString("id-ID")}
                      {p.uploaded_at ? `  ${new Date(p.uploaded_at).toLocaleDateString("id-ID")}` : ""}
                    </p>
                  </div>
                  <Link
                    href="/admin/pembayaran"
                    className="text-xs bg-accent text-white px-3 py-1.5 rounded-lg hover:bg-accent-dark hover:scale-105 transition-all shrink-0"
                  >
                    Verifikasi
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========== 4. KELAS TERPOPULER ========== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-primary flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary" />
          Kelas Terpopuler
        </h2>
        {stats?.byClass && stats.byClass.length > 0 ? (
          <div className="space-y-3">
            {stats.byClass.slice(0, 6).map((k, i) => {
              const maxCount = stats.byClass[0]?.count || 1;
              const pct = (k.count / maxCount) * 100;
              return (
                <div key={k.class_name} className="flex items-center gap-3 group">
                  <span className="text-xs text-text-light w-5 shrink-0 font-medium">{i + 1}</span>
                  <span className="text-sm text-primary flex-1 truncate font-medium">{k.class_name}</span>
                  <div className="w-32 lg:w-48 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-1000"
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-text-light w-8 text-right">{k.count}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-text-light">Belum ada data kelas</p>
        )}
      </div>
    </div>
  );
}
