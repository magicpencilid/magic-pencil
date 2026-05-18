/* =============================================
   ADMIN ABSENSI — Lihat absensi semua murid
   ============================================= */

"use client";

import { useEffect, useState } from "react";
import { RefreshCw, CheckCircle, Clock, Loader2, Search } from "lucide-react";

export default function AdminAbsensiPage() {
  const [data, setData] = useState([]);
  const [allMurid, setAllMurid] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTanggal, setFilterTanggal] = useState(() => new Date().toISOString().split("T")[0]);
  const [viewMode, setViewMode] = useState("riwayat"); // "riwayat" | "rekap"

  const fetchData = async () => {
    setLoading(true);
    try {
      // Ambil semua murid pendaftar
      const muridRes = await fetch("/api/pendaftar");
      const muridData = await muridRes.json();
      if (muridData.success) setAllMurid(muridData.data);

      // Ambil semua absensi
      const absenRes = await fetch("/api/absensi" + (filterTanggal ? `?tanggal=${filterTanggal}` : ""));
      const absenData = await absenRes.json();
      if (absenData.success) setData(absenData.data);

      // Kalo ada pagination issues, ambil data per murid yg aktif
      const aktifMurid = muridData.data.filter((m) => m.status === "aktif");
      const allAbsen = [];
      for (const m of aktifMurid) {
        const r = await fetch(`/api/absensi?murid_id=${m.id}` + (filterTanggal ? `&tanggal=${filterTanggal}` : ""));
        const d = await r.json();
        if (d.success) allAbsen.push(...d.data);
      }
      if (allAbsen.length > 0) setData(allAbsen);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = data.filter((row) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (row.participant_name || row.class_name || "").toLowerCase().includes(q);
  });

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Data Absensi</h1>
        <button onClick={fetchData} className="flex items-center gap-1 text-sm text-text-light hover:text-primary transition-colors">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama murid..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <input
          type="date"
          value={filterTanggal}
          onChange={(e) => setFilterTanggal(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
        <button onClick={() => { setFilterTanggal(new Date().toISOString().split("T")[0]); fetchData(); }}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-text-light hover:bg-gray-50 transition-colors">
          Hari Ini
        </button>
        <div className="flex rounded-xl border border-gray-200 overflow-hidden">
          <button onClick={() => setViewMode("riwayat")}
            className={`px-4 py-2 text-sm transition-colors ${viewMode === "riwayat" ? "bg-gray-200 text-primary font-semibold" : "bg-white text-text-light"}`}>
            Riwayat
          </button>
          <button onClick={() => setViewMode("rekap")}
            className={`px-4 py-2 text-sm transition-colors ${viewMode === "rekap" ? "bg-gray-200 text-primary font-semibold" : "bg-white text-text-light"}`}>
            Rekap
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      )}

      {!loading && viewMode === "riwayat" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left p-3 font-semibold text-text-light">Nama</th>
                  <th className="text-left p-3 font-semibold text-text-light">Kelas</th>
                  <th className="text-left p-3 font-semibold text-text-light">Tanggal</th>
                  <th className="text-left p-3 font-semibold text-text-light">Check-in</th>
                  <th className="text-left p-3 font-semibold text-text-light">Check-out</th>
                  <th className="text-center p-3 font-semibold text-text-light">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan="6" className="text-center py-12 text-text-light">Belum ada data absensi</td></tr>
                )}
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 font-medium text-primary">{row.participant_name}</td>
                    <td className="p-3 text-text-light">{row.class_name}</td>
                    <td className="p-3 text-text-light">{row.tanggal}</td>
                    <td className="p-3 text-text-light">{row.check_in?.split(",")[1]?.trim() || row.check_in || "-"}</td>
                    <td className="p-3 text-text-light">{row.check_out?.split(",")[1]?.trim() || row.check_out || "-"}</td>
                    <td className="p-3 text-center">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        row.check_out ? "bg-gray-200 text-gray-700" :
                        row.check_in ? "bg-gray-100 text-gray-700" :
                        "bg-gray-50 text-gray-500"
                      }`}>
                        {row.check_out ? "Selesai" : row.check_in ? "Berlangsung" : "Tidak Hadir"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && viewMode === "rekap" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left p-3 font-semibold text-text-light">Nama</th>
                  <th className="text-left p-3 font-semibold text-text-light">Kelas</th>
                  <th className="text-center p-3 font-semibold text-text-light">Total Hadir</th>
                  <th className="text-center p-3 font-semibold text-text-light">Total Alpha</th>
                  <th className="text-center p-3 font-semibold text-text-light">Kehadiran</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  // Rekap per murid
                  const map = {};
                  data.forEach((row) => {
                    if (!map[row.murid_id]) {
                      map[row.murid_id] = {
                        id: row.murid_id,
                        nama: row.participant_name,
                        kelas: row.class_name,
                        total: 0,
                        hadir: 0,
                      };
                    }
                    map[row.murid_id].total++;
                    if (row.check_out || row.check_in) map[row.murid_id].hadir++;
                  });

                  const rekap = Object.values(map).filter((r) => {
                    if (!search) return true;
                    return r.nama.toLowerCase().includes(search.toLowerCase());
                  });

                  return rekap.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-12 text-text-light">Belum ada data absensi</td></tr>
                  ) : (
                    rekap.map((r) => {
                      const pct = r.total > 0 ? Math.round((r.hadir / r.total) * 100) : 0;
                      return (
                        <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-3 font-medium text-primary">{r.nama}</td>
                          <td className="p-3 text-text-light">{r.kelas}</td>
                          <td className="p-3 text-center font-semibold text-gray-700">{r.hadir}</td>
                          <td className="p-3 text-center text-gray-500">{r.total - r.hadir}</td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gray-400 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs font-semibold text-gray-600">{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  );
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
