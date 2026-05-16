"use client";

import { useEffect, useState } from "react";
import { Calendar, RefreshCw, Trash2, MapPin, Check, X } from "lucide-react";

export default function JadwalTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterKelas, setFilterKelas] = useState("Semua");
  const [defaultLocation, setDefaultLocation] = useState("");
  const [showLokasiForm, setShowLokasiForm] = useState(false);
  const [lokasiInput, setLokasiInput] = useState("");
  const [editingLokasi, setEditingLokasi] = useState(null); // id yg lagi diedit
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    setLoading(true);
    fetch("/api/jadwal")
      .then((r) => r.json())
      .then((res) => { if (res.success) setData(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const fetchDefaultLocation = () => {
    fetch("/api/settings/default-location")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.location) {
          setDefaultLocation(res.data.location);
          setLokasiInput(res.data.location);
        }
      })
      .catch(console.error);
  };

  useEffect(() => { fetchData(); fetchDefaultLocation(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Hapus jadwal?")) return;
    await fetch(`/api/jadwal?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  const saveDefaultLocation = async () => {
    if (!lokasiInput.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/settings/default-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: lokasiInput.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        setDefaultLocation(lokasiInput.trim());
        setShowLokasiForm(false);
      }
    } catch {}
    setSaving(false);
  };

  const updateAllLocations = async () => {
    if (!defaultLocation) return;
    if (!confirm(`Update lokasi semua jadwal yang kosong jadi "${defaultLocation}"?`)) return;
    setSaving(true);
    try {
      await fetch("/api/jadwal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_all_locations", location: defaultLocation }),
      });
      fetchData();
    } catch {}
    setSaving(false);
  };

  const saveEditLokasi = async (id) => {
    if (!editValue.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/jadwal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, location: editValue.trim() }),
      });
      setEditingLokasi(null);
      fetchData();
    } catch {}
    setSaving(false);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header + Filter */}
      <div className="flex items-center justify-between mb-4">
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

      {/* Lokasi Default */}
      <div className="flex items-center gap-3 mb-6">
        {showLokasiForm ? (
          <div className="flex items-center gap-2 flex-1">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={lokasiInput}
              onChange={(e) => setLokasiInput(e.target.value)}
              placeholder="Contoh: Studio Magic Pencil, Cimahpar"
              className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
              autoFocus
            />
            <button onClick={saveDefaultLocation} disabled={saving}
              className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Simpan
            </button>
            <button onClick={() => setShowLokasiForm(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <button onClick={() => { setShowLokasiForm(true); setLokasiInput(defaultLocation); }}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <MapPin className="w-4 h-4" />
              {defaultLocation ? defaultLocation : "Atur Lokasi Default"}
            </button>
            {defaultLocation && (
              <button onClick={updateAllLocations} disabled={saving}
                className="text-xs text-gray-500 hover:text-gray-700 underline underline-offset-2">
                Update semua jadwal
              </button>
            )}
          </>
        )}
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
                  <th className="text-left p-3 font-semibold text-text-light">Lokasi</th>
                  <th className="text-center p-3 font-semibold text-text-light">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const filtered = filterKelas === "Semua" ? data : data.filter((d) => d.class_name === filterKelas);
                  if (filtered.length === 0) return <tr key="empty"><td colSpan="7" className="text-center py-12 text-text-light"><Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />Belum ada jadwal</td></tr>;
                  return filtered.map((row, i) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 text-text-light">{i + 1}</td>
                    <td className="p-3 font-medium text-primary">{row.participant_name || row.registration_id}</td>
                    <td className="p-3 text-text-light">{row.class_name}</td>
                    <td className="p-3 text-text-light">{row.schedule_date}</td>
                    <td className="p-3 text-text-light">{row.schedule_time}</td>
                    <td className="p-3">
                      {editingLokasi === row.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-28 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
                            autoFocus
                          />
                          <button onClick={() => saveEditLokasi(row.id)} disabled={saving}
                            className="p-1 text-gray-500 hover:text-gray-700">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setEditingLokasi(null)}
                            className="p-1 text-gray-400 hover:text-gray-600">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingLokasi(row.id); setEditValue(row.location || defaultLocation || ""); }}
                          className="text-sm text-left text-text-light hover:text-gray-700 underline underline-offset-2 decoration-dotted decoration-gray-300">
                          {row.location || (defaultLocation ? <span className="text-gray-400">{defaultLocation}</span> : "-")}
                        </button>
                      )}
                    </td>
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
