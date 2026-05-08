/* =============================================
   📅 JADWAL MURID — Halaman Jadwal Kelas
   
   Fitur:
   - Tab: Hari Ini / Minggu Ini / Semua
   - Tampilan jadwal per kartu (list)
   - Loading + empty state
   - Navbar mini dengan tombol back
   ============================================= */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, Loader2, User, BookOpen } from "lucide-react";

export default function JadwalMuridPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("hari-ini");
  const [today, setToday] = useState("");

  useEffect(() => {
    // Cek auth dulu
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
    setLoading(true);
    fetch(`/api/jadwal-murid?filter=${filter}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setData(res.data);
          setToday(res.today);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, filter]);

  // Format tanggal
  function formatTanggal(dateStr) {
    if (!dateStr) return "-";
    const d = new Date(dateStr + "T00:00:00");
    const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return `${hari[d.getDay()]}, ${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
  }

  function isToday(dateStr) {
    return dateStr === today;
  }

  const filters = [
    { key: "hari-ini", label: "Hari Ini" },
    { key: "minggu-ini", label: "Minggu Ini" },
    { key: "semua", label: "Semua" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-primary">Jadwal Kelas</h1>
            {user && <p className="text-xs text-text-light">{user.kelas}</p>}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Tab Filter */}
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === f.key
                  ? "bg-gray-800 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        )}

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <div className="text-center py-20 text-text-light">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-base font-medium">Tidak ada jadwal</p>
            <p className="text-sm mt-1">
              {filter === "hari-ini"
                ? "Tidak ada kelas hari ini"
                : filter === "minggu-ini"
                ? "Tidak ada kelas minggu ini"
                : "Belum ada jadwal untuk kelas ini"}
            </p>
          </div>
        )}

        {/* Jadwal Cards */}
        {!loading &&
          data.map((item) => {
            const todayClass = isToday(item.schedule_date) ? "ring-2 ring-accent/20" : "";
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 ${todayClass}`}
              >
                {/* Baris 1: Tanggal + Label */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-primary">{item.class_name}</p>
                    <p className="text-xs text-text-light mt-0.5">{item.participant_name}</p>
                  </div>
                  {isToday(item.schedule_date) && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      Hari Ini
                    </span>
                  )}
                </div>

                {/* Detail */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-text-light">
                    <Calendar className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <span>{formatTanggal(item.schedule_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-light">
                    <Clock className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <span>{item.schedule_time || "Belum ditentukan"}</span>
                  </div>
                  {item.location && (
                    <div className="flex items-center gap-2 text-text-light">
                      <MapPin className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      <span>{item.location}</span>
                    </div>
                  )}
                  {item.teacher_name && (
                    <div className="flex items-center gap-2 text-text-light">
                      <User className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      <span>Pengajar: {item.teacher_name}</span>
                    </div>
                  )}
                  {item.notes && (
                    <div className="flex items-start gap-2 text-text-light mt-1">
                      <BookOpen className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                      <span className="text-xs">{item.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </main>
    </div>
  );
}
