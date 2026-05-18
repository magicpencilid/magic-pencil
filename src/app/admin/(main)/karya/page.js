/* =============================================
   ADMIN KARYA — Review Karya Murid
   
   Tabel semua karya dengan status.
   Approve / reject / delete.
   ============================================= */

"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Trash2, Loader2, Search, ImageIcon } from "lucide-react";
import { STATUS_LABEL, STATUS_COLOR } from "@/lib/karya-constants";

export default function AdminKaryaPage() {
  const filterTabs = ["semua", "pending", "approved", "rejected", "private"];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [adminName, setAdminName] = useState("");

  const fetchKarya = () => {
    setLoading(true);
    let url = "/api/karya";
    if (filter !== "semua") url += `?status=${filter}`;

    fetch(url)
      .then((r) => r.json())
      .then((res) => { if (res.success) setData(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((res) => { if (res.success) setAdminName(res.data?.username || "Admin"); })
      .catch(() => {});

    fetchKarya();
  }, [filter]);

  const handleAction = async (id, action) => {
    if (!adminName) { alert("Gagal membaca nama admin"); return; }
    const res = await fetch(`/api/karya/${id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, admin: adminName }),
    });
    const json = await res.json();
    if (json.success) fetchKarya();
    else alert(json.errors?.join(", ") || "Gagal");
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus karya ini? Tindakan ini tidak bisa dibatalkan.")) return;
    const res = await fetch(`/api/karya/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) fetchKarya();
    else alert(json.errors?.join(", ") || "Gagal hapus");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-primary">Karya Murid</h1>
        <p className="text-sm text-text-light mt-1">Review & kelola karya yang diupload murid</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filterTabs.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filter === f
                ? "bg-primary text-white"
                : "bg-gray-100 text-text-light hover:bg-gray-200"
            }`}
          >
            {f === "semua" ? "Semua" : STATUS_LABEL[f] || f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16 text-text-light">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-base">Belum ada karya dengan status ini</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left p-3 font-semibold text-text-light">Karya</th>
                  <th className="text-left p-3 font-semibold text-text-light">Murid</th>
                  <th className="text-left p-3 font-semibold text-text-light">Kelas</th>
                  <th className="text-left p-3 font-semibold text-text-light">Tanggal</th>
                  <th className="text-center p-3 font-semibold text-text-light">Status</th>
                  <th className="text-center p-3 font-semibold text-text-light">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((karya) => (
                  <tr key={karya.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                          {karya.image_path ? (
                            <img src={karya.image_path} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-primary truncate max-w-[200px]">{karya.judul}</p>
                          {karya.deskripsi && (
                            <p className="text-xs text-text-light truncate max-w-[200px]">{karya.deskripsi}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-medium text-primary">{karya.participant_name || `Murid #${karya.murid_id}`}</td>
                    <td className="p-3 text-text-light">{karya.kelas || karya.murid_kelas || "—"}</td>
                    <td className="p-3 text-text-light text-xs">{karya.created_at}</td>
                    <td className="p-3 text-center">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[karya.status] || "bg-gray-100 text-gray-600"}`}>
                        {STATUS_LABEL[karya.status] || karya.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1">
                        {karya.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleAction(karya.id, "approve")}
                              className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
                              title="Setujui"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAction(karya.id, "reject")}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                              title="Tolak"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(karya.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
