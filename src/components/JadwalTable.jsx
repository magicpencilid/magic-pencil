"use client";

import { useEffect, useState } from "react";
import { Calendar, RefreshCw, Trash2 } from "lucide-react";

export default function JadwalTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterKelas, setFilterKelas] = useState("Semua");

  const fetchData = () => {
    setLoading(true);
    fetch("/api/jadwal")
      .then((r) => r.json())
      .then((res) => { if (res.success) setData(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Hapus jadwal?")) return;
    await fetch(`/api/jadwal?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Jadwal Kelas</h1>
        <div className="flex items-center gap-3">
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="Semua">Semua Kelas</option>
            {[...new Set(data.map((d) => d.class_name))].map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <button onClick={fetchData} className="flex items-center gap-1 text-sm text-text-light hover:text-primary transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" /></div>
      )}

      {!loading && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left p-3 font-semibold text-text-light">No</th>
                  <th className="text-left p-3 font-semibold text-text-light">Peserta</th>
                  <th className="text-left p-3 font-semibold text-text-light">Kelas</th>
                  <th className="text-left p-3 font-semibold text-text-light">Tanggal</th>
                  <th className="text-left p-3 font-semibold text-text-light">Waktu</th>
                  <th className="text-left p-3 font-semibold text-text-light">Pengajar</th>
                  <th className="text-left p-3 font-semibold text-text-light">Lokasi</th>
                  <th className="text-center p-3 font-semibold text-text-light">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const filtered = filterKelas === "Semua" ? data : data.filter((d) => d.class_name === filterKelas);
                  if (filtered.length === 0) return <tr key="empty"><td colSpan="8" className="text-center py-12 text-text-light"><Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />Belum ada jadwal</td></tr>;
                  return filtered.map((row, i) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 text-text-light">{i + 1}</td>
                    <td className="p-3 font-medium text-primary">{row.participant_name || row.registration_id}</td>
                    <td className="p-3 text-text-light">{row.class_name}</td>
                    <td className="p-3 text-text-light">{row.schedule_date}</td>
                    <td className="p-3 text-text-light">{row.schedule_time}</td>
                    <td className="p-3 text-text-light">{row.teacher_name || "-"}</td>
                    <td className="p-3 text-text-light">{row.location || "-"}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => handleDelete(row.id)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ));
                })()}
              </tbody>
            </table>
          </div>
          <div className="p-3 text-xs text-text-light border-t border-gray-50">{(filterKelas === "Semua" ? data : data.filter((d) => d.class_name === filterKelas)).length} jadwal</div>
        </div>
      )}
    </div>
  );
}
