/* =============================================
   📋 PENDAFTAR TABLE — Data Pendaftar
   
   Fitur:
   - Tabel semua pendaftar
   - Filter status + search
   - Edit status via dropdown
   - Hapus data
   - Export CSV
   - Template WA (expandable)
   ============================================= */

"use client";

import { useEffect, useState } from "react";
import { Search, Trash2, RefreshCw, AlertCircle, Download, MessageSquare, Pencil, X, UserPlus } from "lucide-react";
import WATemplate from "./WATemplate";

export default function PendaftarTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedWA, setSelectedWA] = useState(null); // row yang lagi nampilin template WA
  const [invoiceMap, setInvoiceMap] = useState({});    // invoice per pendaftar
  const [editRow, setEditRow] = useState(null);        // row yang diedit
  const [editForm, setEditForm] = useState({});        // nilai form edit
  const [editSaving, setEditSaving] = useState(false);
  const [akunModal, setAkunModal] = useState(null); // { id, nama }
  const [akunForm, setAkunForm] = useState({ email: "", password: "" });
  const [akunLoading, setAkunLoading] = useState(false);
  const [akunBaru, setAkunBaru] = useState(null); // { email, password_plain, nama } — dari auto-create
  const [notif, setNotif] = useState(null); // { type: "success"|"error", message }
  const [kelasList, setKelasList] = useState([]);
  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/pendaftar").then((r) => r.json()),
      fetch("/api/invoice").then((r) => r.json()),
    ])
      .then(([pendaftarRes, invoiceRes]) => {
        if (pendaftarRes.success) setData(pendaftarRes.data);
        if (invoiceRes.success) {
          const map = {};
          invoiceRes.data.forEach((inv) => {
            map[inv.registration_id] = inv;
          });
          setInvoiceMap(map);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Ambil daftar kelas buat dropdown edit
    fetch("/api/kelas")
      .then((r) => r.json())
      .then((res) => { if (res.success) setKelasList(res.data); })
      .catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset ke halaman 1 kalo search/filter berubah
  useEffect(() => { setCurrentPage(1); }, [search, statusFilter]);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/pendaftar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (result.success) {
        fetchData();
        // Kalo auto-create akun, tampilkan kredensial
        if (result.akun) {
          const row = data.find((r) => r.id === id);
          setAkunBaru({
            email: result.akun.email,
            password_plain: result.akun.password_plain,
            nama: row?.participant_name || row?.full_name || "Murid",
          });
        }
      }
    } catch (err) {
      console.error("Gagal update:", err);
    }
  };

  const openEdit = (row) => {
    setEditRow(row.id);
    setEditForm({
      full_name: row.full_name || "",
      participant_name: row.participant_name || "",
      whatsapp: row.whatsapp || "",
      email: row.email || "",
      alamat: row.alamat || "",
      class_name: row.class_name || "",
      age: row.age || "",
      source: row.source || "",
      notes: row.notes || "",
      status: row.status || "baru",
    });
  };

  const saveEdit = async () => {
    setEditSaving(true);
    try {
      const res = await fetch(`/api/pendaftar/${editRow}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const json = await res.json();
      if (json.success) {
        setEditRow(null);
        fetchData();
      } else {
        alert("❌ " + (json.errors?.[0] || "Gagal simpan"));
      }
    } catch {
      alert("❌ Gagal menghubungi server");
    }
    setEditSaving(false);
  };

  const deleteData = async (id, name) => {
    if (!confirm(`Hapus data "${name}"?`)) return;
    try {
      const res = await fetch(`/api/pendaftar/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) fetchData();
    } catch (err) {
      console.error("Gagal hapus:", err);
    }
  };

  const statusOptions = ["baru", "dikontak", "aktif", "batal", "selesai"];
  const statusLabels = {
    baru: "Baru",
    dikontak: "Menunggu Respon",
    aktif: "Terdaftar",
    batal: "Batal",
    selesai: "Selesai",
  };

  const statusColors = {
    baru: "bg-gray-100 text-gray-700",
    dikontak: "bg-gray-100 text-gray-700",
    aktif: "bg-gray-200 text-gray-700",
    batal: "bg-gray-100 text-gray-500",
    selesai: "bg-gray-100 text-gray-500",
  };

  const generateInvoice = async (id) => {
    try {
      const res = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registration_id: id }),
      });
      const result = await res.json();
      if (result.success) {
        alert(`✅ Invoice ${result.data.invoice_number} berhasil dibuat!`);
        fetchData();
      }
    } catch {
      alert("❌ Gagal membuat invoice");
    }
  };

  const filteredData = data.filter((row) => {
    const matchSearch =
      row.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      row.whatsapp?.includes(search) ||
      row.participant_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? row.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const pageButtons = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  for (let p = startPage; p <= endPage; p++) pageButtons.push(p);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Data Pendaftar</h1>
        <div className="flex items-center gap-2">
          <a
            href="/api/export?format=csv"
            className="flex items-center gap-1.5 text-sm bg-green-50 text-green-700 px-3 py-2 rounded-xl hover:bg-green-100 transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </a>
          <button
            onClick={fetchData}
            className="flex items-center gap-1 text-sm text-text-light hover:text-primary transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama / WA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none bg-white"
        >
          <option value="">Semua Status</option>
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>{statusLabels[opt]}</option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Tabel */}
      {!loading && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left p-3 font-semibold text-text-light">No</th>
                  <th className="text-left p-3 font-semibold text-text-light">Nama</th>
                  <th className="text-left p-3 font-semibold text-text-light">Peserta</th>
                  <th className="text-left p-3 font-semibold text-text-light">WA</th>
                  <th className="text-left p-3 font-semibold text-text-light">Kelas</th>
                  <th className="text-left p-3 font-semibold text-text-light">Tanggal</th>
                  <th className="text-center p-3 font-semibold text-text-light">Status</th>
                  <th className="text-center p-3 font-semibold text-text-light">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-12 text-text-light">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      Belum ada data pendaftar
                    </td>
                  </tr>
                )}
                {paginatedData.map((row, i) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-3 text-text-light">{i + 1}</td>
                    <td className="p-3 font-medium text-primary">{row.full_name}</td>
                    <td className="p-3 text-text-light">{row.participant_name}</td>
                    <td className="p-3 text-text-light">{row.whatsapp}</td>
                    <td className="p-3 text-text-light">{row.class_name}</td>
                    <td className="p-3 text-text-light text-xs">{row.created_at}</td>
                    <td className="p-3 text-center">
                      <select
                        value={row.status}
                        onChange={(e) => updateStatus(row.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer text-center ${statusColors[row.status] || "bg-gray-100 text-gray-700"}`}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt} className="text-center">{statusLabels[opt]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1">
                        {/* Edit */}
                        <button
                          onClick={() => openEdit(row)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit data"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {/* Template WA */}
                        <button
                          onClick={() => setSelectedWA(selectedWA === row.id ? null : row.id)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Template WA"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        {/* Generate Invoice */}
                        {!invoiceMap[row.id] && (
                          <button
                            onClick={() => generateInvoice(row.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-xs font-bold"
                            title="Buat Invoice"
                          >
                            💳
                          </button>
                        )}
                        {/* Buat Akun — auto-generate kredensial */}
                        {row.status === "aktif" && (
                          <button
                            onClick={async () => {
                              try {
                                const res = await fetch(`/api/pendaftar/${row.id}`, {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ status: "aktif" }),
                                });
                                const result = await res.json();
                                if (result.success) {
                                  if (result.akun) {
                                    setAkunBaru({
                                      email: result.akun.email,
                                      password_plain: result.akun.password_plain,
                                      nama: row.participant_name || row.full_name || "Murid",
                                    });
                                    fetchData();
                                  } else {
                                    setNotif({ type: "error", message: `${row.participant_name} sudah punya akun. Reset di halaman Murid.` });
                                  }
                                }
                              } catch {
                                setNotif({ type: "error", message: "Gagal membuat akun. Coba refresh." });
                              }
                            }}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Buat Akun"
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        )}
                        {/* Hapus */}
                        <button
                          onClick={() => deleteData(row.id, row.full_name)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
          {/* Pagination */}
          <div className="p-3 border-t border-gray-50 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-text-light">
              Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              -
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}
              dari {filteredData.length} data
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ‹
                </button>
                {pageButtons.map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                      p === currentPage
                        ? "bg-accent text-white"
                        : "border border-gray-200 hover:bg-gray-50 text-text-light"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Template WA — muncul di bawah tabel pas diklik */}
      {selectedWA && (() => {
        const row = data.find((r) => r.id === selectedWA);
        if (!row) return null;
        return (
          <div className="mt-4 space-y-3 animate-fade-in">
            <WATemplate data={row} type="dikontak" />
            <WATemplate data={row} type="aktif" />
            {invoiceMap[row.id] && (
              <WATemplate data={row} invoice={invoiceMap[row.id]} type="invoice" />
            )}
          </div>
        );
      })()}

      {/* ✏️ Modal Edit Data */}
      {editRow && (() => {
        const row = data.find((r) => r.id === editRow);
        if (!row) return null;
        return (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditRow(null)}>
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-primary text-lg">✏️ Edit Data</h2>
                <button onClick={() => setEditRow(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-light mb-1">Nama Lengkap</label>
                    <input type="text" value={editForm.full_name}
                      onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-light mb-1">Nama Peserta</label>
                    <input type="text" value={editForm.participant_name}
                      onChange={(e) => setEditForm({...editForm, participant_name: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-light mb-1">No. WhatsApp</label>
                    <input type="text" value={editForm.whatsapp}
                      onChange={(e) => setEditForm({...editForm, whatsapp: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-light mb-1">Email</label>
                    <input type="email" value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-light mb-1">Alamat</label>
                  <textarea value={editForm.alamat}
                    onChange={(e) => setEditForm({...editForm, alamat: e.target.value})}
                    rows="2"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none" />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-light mb-1">Usia</label>
                    <input type="number" value={editForm.age}
                      onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-light mb-1">Kelas</label>
                    <select value={editForm.class_name}
                      onChange={(e) => setEditForm({...editForm, class_name: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none bg-white">
                      <option value="">Pilih kelas...</option>
                      {kelasList.map((k) => (
                        <option key={k.id} value={k.name}>{k.name} — Investasi {k.price.toLocaleString()}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-light mb-1">Sumber</label>
                    <select value={editForm.source}
                      onChange={(e) => setEditForm({...editForm, source: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none bg-white">
                      <option value="">Pilih sumber...</option>
                      {["Instagram","Facebook","TikTok","Teman/Keluarga","Google Search","Brosur","Lainnya"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-light mb-1">Status</label>
                    <select value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none bg-white">
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>{statusLabels[opt]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-light mb-1">Catatan</label>
                  <textarea value={editForm.notes}
                    onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                    rows="2"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setEditRow(null)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-text-light hover:bg-gray-50 transition-colors text-sm font-semibold">
                    Batal
                  </button>
                  <button onClick={saveEdit} disabled={editSaving}
                    className="flex-1 bg-accent text-white font-semibold py-2.5 rounded-xl hover:bg-accent-dark transition-all disabled:opacity-60 text-sm">
                    {editSaving ? "Menyimpan..." : "💾 Simpan"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 🔔 Notifikasi Toast */}
      {notif && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className={`rounded-2xl px-5 py-4 shadow-lg border max-w-sm ${
            notif.type === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-green-50 border-green-200 text-green-800"
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-lg">{notif.type === "error" ? "❌" : "✅"}</span>
              <p className="text-sm font-medium">{notif.message}</p>
              <button onClick={() => setNotif(null)} className="shrink-0 -mr-1 -mt-1 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🎉 Modal Sukses — Auto-create Akun */}
      {akunBaru && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setAkunBaru(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-primary text-lg flex items-center gap-2">
                <span className="text-xl">🎉</span> Akun Berhasil Dibuat!
              </h2>
              <button onClick={() => setAkunBaru(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-5">
              Akun login untuk <strong>{akunBaru.nama}</strong>:
            </p>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-5">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Email</p>
                <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200">
                  <code className="text-sm font-mono text-primary">{akunBaru.email}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(akunBaru.email)}
                    className="text-xs text-accent hover:text-accent-dark font-medium ml-2 whitespace-nowrap"
                  >
                    📋 Salin
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Password</p>
                <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200">
                  <code className="text-sm font-mono text-primary font-bold tracking-wider">{akunBaru.password_plain}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(akunBaru.password_plain)}
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
              onClick={() => {
                setAkunBaru(null);
              }}
              className="w-full py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-dark transition-colors"
            >
              Mengerti, Tutup
            </button>
          </div>
        </div>
      )}

      {/* 📝 Modal Buat Akun */}
      {akunModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setAkunModal(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-primary text-lg">🔑 Buat Akun</h2>
              <button onClick={() => setAkunModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-text-light mb-4">
              Buat akun login untuk <strong>{akunModal.nama}</strong>
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text-light mb-1">Email</label>
                <input
                  type="email"
                  value={akunForm.email}
                  onChange={(e) => setAkunForm({ ...akunForm, email: e.target.value })}
                  placeholder="contoh@email.com"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-light mb-1">Password</label>
                <input
                  type="password"
                  value={akunForm.password}
                  onChange={(e) => setAkunForm({ ...akunForm, password: e.target.value })}
                  placeholder="Min. 6 karakter"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>

              {akunForm.error && (
                <div className="bg-red-50 text-red-700 px-3 py-2 rounded-xl text-sm">{akunForm.error}</div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setAkunModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-text-light hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  Batal
                </button>
                <button
                  onClick={async () => {
                    if (!akunForm.email || !akunForm.password) {
                      setAkunForm({ ...akunForm, error: "Email & password wajib diisi" });
                      return;
                    }
                    if (akunForm.password.length < 6) {
                      setAkunForm({ ...akunForm, error: "Password minimal 6 karakter" });
                      return;
                    }
                    setAkunLoading(true);
                    try {
                      const res = await fetch("/api/auth-murid/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          murid_id: akunModal.id,
                          email: akunForm.email,
                          password: akunForm.password,
                        }),
                      });
                      const json = await res.json();
                      if (json.success) {
                        alert("✅ Akun berhasil dibuat!");
                        setAkunModal(null);
                      } else {
                        setAkunForm({ ...akunForm, error: json.error });
                      }
                    } catch {
                      setAkunForm({ ...akunForm, error: "Gagal menghubungi server" });
                    }
                    setAkunLoading(false);
                  }}
                  disabled={akunLoading}
                  className="flex-1 bg-accent text-white font-semibold py-2.5 rounded-xl hover:bg-accent-dark transition-all disabled:opacity-60 text-sm"
                >
                  {akunLoading ? "Membuat..." : "Buat Akun"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
