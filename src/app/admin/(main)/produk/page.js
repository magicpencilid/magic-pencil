/* =============================================
   Admin: Produk — Kelola Merch Online Store
   Monochrome gray style
   ============================================= */

"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Package, X, Upload, Loader2 } from "lucide-react";
import { useRef } from "react";

const KATEGORI_OPTIONS = ["totebag", "kaos", "mug", "lainnya"];

const emptyForm = {
  nama: "",
  deskripsi: "",
  harga: "",
  kategori: "lainnya",
  ukuran_tersedia: [],
  warna_tersedia: [],
};

export default function AdminProdukPage() {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [ukuranInput, setUkuranInput] = useState("");
  const [warnaInput, setWarnaInput] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const res = await fetch("/api/produk?admin=1");
    const json = await res.json();
    if (json.success) setProduk(json.data);
    setLoading(false);
  }

  function resetForm() {
    setForm({ ...emptyForm });
    setUkuranInput("");
    setWarnaInput("");
    setEditingId(null);
    setFile(null);
    setPreview(null);
  }

  function openAdd() {
    resetForm();
    setShowForm(true);
  }

  function openEdit(p) {
    setForm({
      nama: p.nama,
      deskripsi: p.deskripsi || "",
      harga: String(p.harga),
      kategori: p.kategori,
      ukuran_tersedia: p.ukuran_tersedia || [],
      warna_tersedia: p.warna_tersedia || [],
    });
    setUkuranInput("");
    setWarnaInput("");
    setFile(null);
    setPreview(null);
    setEditingId(p.id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    resetForm();
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  }

  async function uploadGambar(produkId) {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("produk_id", produkId);
    formData.append("file", file);
    try {
      await fetch("/api/produk/upload", { method: "POST", body: formData });
    } catch {}
    setUploading(false);
  }

  function addUkuran() {
    const u = ukuranInput.trim().toUpperCase();
    if (!u || form.ukuran_tersedia.includes(u)) return;
    setForm({ ...form, ukuran_tersedia: [...form.ukuran_tersedia, u] });
    setUkuranInput("");
  }

  function removeUkuran(u) {
    setForm({
      ...form,
      ukuran_tersedia: form.ukuran_tersedia.filter((x) => x !== u),
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nama.trim() || !form.harga) return;

    const url = editingId
      ? `/api/produk/${editingId}`
      : "/api/produk";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama: form.nama.trim(),
        deskripsi: form.deskripsi.trim() || null,
        harga: Number(form.harga),
        kategori: form.kategori,
        ukuran_tersedia: form.ukuran_tersedia,
        warna_tersedia: form.warna_tersedia,
      }),
    });
    const json = await res.json();

    if (json.success) {
      const newId = editingId || json.data?.id;
      if (file && newId) {
        await uploadGambar(newId);
      }
      setMsg(editingId ? "Produk berhasil diupdate" : "Produk berhasil ditambahkan");
      closeForm();
      fetchData();
    } else {
      setMsg(json.errors?.[0] || "Gagal");
    }
    setTimeout(() => setMsg(""), 3000);
  }

  async function handleDelete(id, nama) {
    if (!confirm(`Hapus produk "${nama}"?`)) return;
    const res = await fetch(`/api/produk/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      setMsg("Produk berhasil dihapus");
      fetchData();
      setTimeout(() => setMsg(""), 3000);
    }
  }

  async function toggleStatus(p) {
    const newStatus = p.status === "aktif" ? "nonaktif" : "aktif";
    const res = await fetch(`/api/produk/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    const json = await res.json();
    if (json.success) fetchData();
  }

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Package className="w-8 h-8 text-[var(--color-accent)] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-[var(--font-display)] text-[var(--color-primary)]">
            Produk
          </h1>
          <p className="text-xs text-[var(--color-text-light)] mt-0.5">
            Kelola merchandise online store
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-[var(--color-primary)] text-white text-sm rounded-lg hover:bg-[var(--color-primary-light)] transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah Produk
        </button>
      </div>

      {/* ─── Toast ─── */}
      {msg && (
        <div className="mb-4 px-4 py-2 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-primary)]">
          {msg}
        </div>
      )}

      {/* ─── Form Modal ─── */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={closeForm}
        >
          <div
            className="bg-white rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-[var(--font-display)] text-[var(--color-primary)]">
                {editingId ? "Edit Produk" : "Tambah Produk"}
              </h2>
              <button onClick={closeForm} className="text-[var(--color-text-light)] hover:text-[var(--color-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama */}
              <div>
                <label className="block text-xs text-[var(--color-text-light)] uppercase tracking-wider mb-1">
                  Nama Produk
                </label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                  placeholder="Totebag Pelangi"
                  required
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs text-[var(--color-text-light)] uppercase tracking-wider mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] min-h-[80px] resize-y"
                  placeholder="Deskripsi produk..."
                />
              </div>

              {/* Harga + Kategori */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[var(--color-text-light)] uppercase tracking-wider mb-1">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    value={form.harga}
                    onChange={(e) => setForm({ ...form, harga: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                    placeholder="35000"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--color-text-light)] uppercase tracking-wider mb-1">
                    Kategori
                  </label>
                  <select
                    value={form.kategori}
                    onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] bg-white"
                  >
                    {KATEGORI_OPTIONS.map((k) => (
                      <option key={k} value={k}>
                        {k.charAt(0).toUpperCase() + k.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ukuran */}
              <div>
                <label className="block text-xs text-[var(--color-text-light)] uppercase tracking-wider mb-1">
                  Ukuran Tersedia
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={ukuranInput}
                    onChange={(e) => setUkuranInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUkuran())}
                    className="flex-1 px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                    placeholder="Contoh: S"
                  />
                  <button
                    type="button"
                    onClick={addUkuran}
                    className="px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors"
                  >
                    + Tambah
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.ukuran_tersedia.map((u) => (
                    <span
                      key={u}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-full"
                    >
                      {u}
                      <button
                        type="button"
                        onClick={() => removeUkuran(u)}
                        className="text-[var(--color-text-light)] hover:text-[var(--color-error)]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Warna */}
              <div>
                <label className="block text-xs text-[var(--color-text-light)] uppercase tracking-wider mb-1">
                  Warna Tersedia
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={warnaInput}
                    onChange={(e) => setWarnaInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), setForm({ ...form, warna_tersedia: [...form.warna_tersedia, warnaInput.trim()] }), setWarnaInput(""))}
                    className="flex-1 px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                    placeholder="Contoh: Hitam"
                  />
                  <button
                    type="button"
                    onClick={() => { if (warnaInput.trim()) { setForm({ ...form, warna_tersedia: [...form.warna_tersedia, warnaInput.trim()] }); setWarnaInput(""); } }}
                    className="px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors"
                  >
                    + Tambah
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.warna_tersedia.map((w, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-full"
                    >
                      {w}
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, warna_tersedia: form.warna_tersedia.filter((_, j) => j !== i) })}
                        className="text-[var(--color-text-light)] hover:text-[var(--color-error)]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Gambar */}
              <div>
                <label className="block text-xs text-[var(--color-text-light)] uppercase tracking-wider mb-1">
                  Foto Produk
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {preview ? (
                  <div className="relative inline-block">
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-32 rounded-lg object-cover border border-[var(--color-border)]"
                    />
                    <button
                      type="button"
                      onClick={() => { setFile(null); setPreview(null); }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--color-error)] text-white flex items-center justify-center text-xs hover:opacity-80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-[var(--color-border)] text-[var(--color-text-light)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors text-sm"
                  >
                    <Upload className="w-4 h-4" /> Pilih Gambar
                  </button>
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-3 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-light)] transition-colors"
                >
                  {editingId ? "Simpan" : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Tabel Produk ─── */}
      {produk.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-text-light)]">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Belum ada produk. Tambah produk pertama!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-3 px-3 text-xs text-[var(--color-text-light)] uppercase tracking-wider font-medium">
                  Produk
                </th>
                <th className="text-left py-3 px-3 text-xs text-[var(--color-text-light)] uppercase tracking-wider font-medium">
                  Kategori
                </th>
                <th className="text-right py-3 px-3 text-xs text-[var(--color-text-light)] uppercase tracking-wider font-medium">
                  Harga
                </th>
                <th className="text-center py-3 px-3 text-xs text-[var(--color-text-light)] uppercase tracking-wider font-medium">
                  Status
                </th>
                <th className="text-right py-3 px-3 text-xs text-[var(--color-text-light)] uppercase tracking-wider font-medium">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {produk.map((p) => (
                <tr key={p.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-alt)] border border-[var(--color-border)] flex items-center justify-center text-sm flex-shrink-0 overflow-hidden">
                        {p.gambar ? (
                          <img src={p.gambar} alt={p.nama} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-4 h-4 text-[var(--color-text-light)]" />
                        )}
                      </div>
                      <span className="font-medium text-[var(--color-primary)]">
                        {p.nama}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[var(--color-text-light)] capitalize">
                    {p.kategori}
                  </td>
                  <td className="py-3 px-3 text-right text-[var(--color-accent)]">
                    Rp {p.harga.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => toggleStatus(p)}
                      className={`inline-flex items-center px-2.5 py-1 text-xs rounded-full border transition-colors ${
                        p.status === "aktif"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-[var(--color-surface-alt)] text-[var(--color-text-light)] border-[var(--color-border)]"
                      }`}
                    >
                      {p.status === "aktif" ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {!p.gambar && (
                        <button
                          onClick={() => { openEdit(p); }}
                          className="p-2 rounded-lg hover:bg-[var(--color-surface-alt)] text-[var(--color-text-light)] hover:text-[var(--color-accent)] transition-colors"
                          title="Upload Gambar"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 rounded-lg hover:bg-[var(--color-surface-alt)] text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.nama)}
                        className="p-2 rounded-lg hover:bg-red-50 text-[var(--color-text-light)] hover:text-[var(--color-error)] transition-colors"
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
  );
}
