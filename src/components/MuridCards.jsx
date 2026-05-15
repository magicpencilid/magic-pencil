/* =============================================
   👤 MURID CARDS — Monochrome Grey
   
   Tampilan visual profil murid dalam bentuk kartu.
   Tema grey — sesuai arahan Willy.
   ============================================= */

"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Loader2,
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BookOpen,
  Clock,
  Key,
  RefreshCw,
  UserPlus,
  X,
} from "lucide-react";

const statusFilter = [
  { value: "", label: "Semua" },
  { value: "aktif", label: "Terdaftar" },
  { value: "baru", label: "Baru Daftar" },
  { value: "selesai", label: "Selesai" },
];

const statusBadge = {
  aktif: { bg: "bg-gray-700", text: "text-white", label: "Terdaftar" },
  baru: { bg: "bg-gray-400", text: "text-white", label: "Baru Daftar" },
  selesai: { bg: "bg-gray-200", text: "text-gray-600", label: "Selesai" },
  default: { bg: "bg-gray-100", text: "text-gray-500", label: "Dikontak" },
};

export default function MuridCards() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [resetModal, setResetModal] = useState(null); // { email, password_plain, nama }
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter) params.set("status", filter);

    fetchData();
  }, [filter]);

  const fetchData = () => {
    fetch(`/api/murid?${new URLSearchParams(filter ? { status: filter } : {}).toString()}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const filtered = data.filter(
    (m) =>
      m.participant_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.class_name?.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    total: data.length,
    aktif: data.filter((m) => m.status === "aktif").length,
    baru: data.filter((m) => m.status === "baru").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Users className="w-6 h-6 text-gray-500" />
          Data Murid
        </h1>
        <p className="text-sm text-text-light">Database seluruh peserta Magic Pencil</p>
      </div>

      {/* Summary bar — monochrome grey */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100 text-sm">
          <span className="text-text-light">Total: </span>
          <span className="font-bold text-primary">{counts.total}</span>
        </div>
        <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200 text-sm">
          <span className="text-text-light">Terdaftar: </span>
          <span className="font-bold text-gray-700">{counts.aktif}</span>
        </div>
        <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200 text-sm">
          <span className="text-text-light">Baru: </span>
          <span className="font-bold text-gray-500">{counts.baru}</span>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama murid..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <div className="flex gap-2">
          {statusFilter.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilter(s.value)}
              className={`text-sm px-3 py-2 rounded-xl transition-colors ${
                filter === s.value
                  ? "bg-accent text-white"
                  : "bg-white border border-gray-200 text-text-light hover:border-accent"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-text-light">Tidak ada data murid</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((m) => {
            const initial = m.participant_name?.charAt(0)?.toUpperCase() || "?";
            const badge = statusBadge[m.status] || statusBadge.default;

            return (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Profile header — monochrome */}
                <div className="p-5 text-center bg-gradient-to-br from-gray-50 to-gray-100/50">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 bg-gray-200">
                    <span className="text-2xl font-bold text-gray-600">{initial}</span>
                  </div>
                  <h3 className="font-bold text-primary truncate">{m.participant_name}</h3>
                  <span
                    className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${badge.bg} ${badge.text}`}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* Detail — grey icons */}
                <div className="p-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-text-light">
                    <User className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    <span className="truncate">{m.full_name || "-"}</span>
                  </div>
                  {m.alamat && (
                    <div className="flex items-center gap-2 text-text-light">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                      <span className="truncate text-xs">{m.alamat}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-text-light">
                    <Phone className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    <span>{m.whatsapp || "-"}</span>
                  </div>
                  {m.email && (
                    <div className="flex items-center gap-2 text-text-light">
                      <Mail className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                      <span className="truncate text-xs">{m.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-text-light">
                    <BookOpen className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    <span className="font-medium text-primary">{m.class_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-light">
                    <Calendar className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    <span className="text-xs">{m.age} tahun</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-light">
                    <Clock className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    <span className="text-xs">{m.created_at}</span>
                  </div>

                  {/* 🔑 Status Akun */}
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Key className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                        {m.akun_email ? (
                          <span className="text-xs text-gray-500 truncate">{m.akun_email}</span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Belum punya akun</span>
                        )}
                      </div>
                      {m.akun_email ? (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            setResetLoading(true);
                            try {
                              const res = await fetch(`/api/murid/${m.id}/reset-password`, { method: "POST" });
                              const json = await res.json();
                              if (json.success) {
                                setResetModal({
                                  email: json.data.email,
                                  password_plain: json.data.password_plain,
                                  nama: m.participant_name,
                                });
                              }
                            } catch {}
                            setResetLoading(false);
                          }}
                          disabled={resetLoading}
                          className="text-xs text-accent hover:text-accent-dark font-medium shrink-0"
                          title="Reset Password"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${resetLoading ? "animate-spin" : ""}`} />
                        </button>
                      ) : m.status === "aktif" ? (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            // Trigger auto-create via PUT status
                            try {
                              const res = await fetch(`/api/pendaftar/${m.id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ status: "aktif" }),
                              });
                              const json = await res.json();
                              if (json.success) {
                                if (json.akun) {
                                  setResetModal({
                                    email: json.akun.email,
                                    password_plain: json.akun.password_plain,
                                    nama: m.participant_name,
                                  });
                                }
                                fetchData();
                              }
                            } catch {}
                          }}
                          className="text-xs text-accent hover:text-accent-dark font-medium shrink-0 flex items-center gap-1"
                          title="Buat Akun"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🔑 Modal Reset / Buat Akun */}
      {resetModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setResetModal(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-primary text-lg flex items-center gap-2">
                <Key className="w-5 h-5 text-gray-400" />
                Kredensial Akun
              </h2>
              <button onClick={() => setResetModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Akun untuk <strong>{resetModal.nama}</strong>:
            </p>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Email</p>
                <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200">
                  <code className="text-sm font-mono text-primary">{resetModal.email}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(resetModal.email)}
                    className="text-xs text-accent hover:text-accent-dark font-medium ml-2 whitespace-nowrap"
                  >
                    📋 Salin
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Password</p>
                <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200">
                  <code className="text-sm font-mono text-primary font-bold tracking-wider">{resetModal.password_plain}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(resetModal.password_plain)}
                    className="text-xs text-accent hover:text-accent-dark font-medium ml-2 whitespace-nowrap"
                  >
                    📋 Salin
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 mb-4">
              ⚠️ Password ini <strong>hanya tampil sekali</strong>. Salin sekarang sebelum menutup.
            </div>

            <button
              onClick={() => setResetModal(null)}
              className="w-full py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-dark transition-colors"
            >
              Mengerti, Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
