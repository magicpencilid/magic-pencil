"use client";

import { useEffect, useState } from "react";
import { Calendar, RefreshCw, Trash2, AlertCircle, Plus } from "lucide-react";

export default function JadwalTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    registration_id: "",
    class_name: "",
    schedule_date: "",
    schedule_time: "",
    teacher_name: "",
    location: "",
    notes: "",
  });

  const fetchData = () => {
    setLoading(true);
    fetch("/api/jadwal")
      .then((r) => r.json())
      .then((res) => { if (res.success) setData(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/jadwal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setShowForm(false);
      setForm({ registration_id: "", class_name: "", schedule_date: "", schedule_time: "", teacher_name: "", location: "", notes: "" });
      fetchData();
    } catch {
      alert("Gagal membuat jadwal");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus jadwal?")) return;
    await fetch(`/api/jadwal?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Jadwal Kelas</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 text-sm bg-accent text-white px-3 py-2 rounded-xl hover:bg-accent-dark transition-colors font-medium">
            <Plus className="w-4 h-4" /> Tambah
          </button>
          <button onClick={fetchData} className="flex items-center gap-1 text-sm text-text-light hover:text-primary transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 grid sm:grid-cols-3 gap-3 animate-fade-in">
          <input placeholder="Registration ID" value={form.registration_id} onChange={(e) => setForm({ ...form, registration_id: e.target.value })} className="px-3 py-2 rounded-xl border border-gray-200 text-sm" required />
          <input placeholder="Nama Kelas" value={form.class_name} onChange={(e) => setForm({ ...form, class_name: e.target.value })} className="px-3 py-2 rounded-xl border border-gray-200 text-sm" required />
          <input type="date" value={form.schedule_date} onChange={(e) => setForm({ ...form, schedule_date: e.target.value })} className="px-3 py-2 rounded-xl border border-gray-200 text-sm" required />
          <input type="time" value={form.schedule_time} onChange={(e) => setForm({ ...form, schedule_time: e.target.value })} className="px-3 py-2 rounded-xl border border-gray-200 text-sm" />
          <input placeholder="Pengajar" value={form.teacher_name} onChange={(e) => setForm({ ...form, teacher_name: e.target.value })} className="px-3 py-2 rounded-xl border border-gray-200 text-sm" />
          <input placeholder="Lokasi" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="px-3 py-2 rounded-xl border border-gray-200 text-sm" />
          <div className="sm:col-span-3 flex gap-2">
            <input placeholder="Catatan" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm" />
            <button type="submit" className="bg-accent text-white px-4 py-2 rounded-xl font-semibold text-sm">Simpan</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm">Batal</button>
          </div>
        </form>
      )}

      {loading && (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>
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
                {data.length === 0 && (
                  <tr><td colSpan="8" className="text-center py-12 text-text-light"><Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />Belum ada jadwal</td></tr>
                )}
                {data.map((row, i) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 text-text-light">{i + 1}</td>
                    <td className="p-3 font-medium text-primary">{row.participant_name || row.registration_id}</td>
                    <td className="p-3 text-text-light">{row.class_name}</td>
                    <td className="p-3 text-text-light">{row.schedule_date}</td>
                    <td className="p-3 text-text-light">{row.schedule_time}</td>
                    <td className="p-3 text-text-light">{row.teacher_name || "-"}</td>
                    <td className="p-3 text-text-light">{row.location || "-"}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => handleDelete(row.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 text-xs text-text-light border-t border-gray-50">Total: {data.length} jadwal</div>
        </div>
      )}
    </div>
  );
}
