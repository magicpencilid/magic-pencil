// Admin: Testimoni — upload + list + delete (monochrome gray style)

"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus } from "lucide-react";

export default function AdminTestimoniPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [nama, setNama] = useState("");
  const [teks, setTeks] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const res = await fetch("/api/testimonials");
    const json = await res.json();
    if (json.success) setTestimonials(json.data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nama.trim() || !teks.trim()) return;
    setLoading(true);
    setMsg("");

    const res = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama: nama.trim(), teks: teks.trim() }),
    });
    const json = await res.json();

    setLoading(false);
    if (json.success) {
      setMsg("Testimoni berhasil ditambahkan");
      setNama("");
      setTeks("");
      fetchData();
    } else {
      setMsg(json.errors?.[0] || "Gagal menambahkan");
    }

    setTimeout(() => setMsg(""), 3000);
  }

  async function handleDelete(id) {
    if (!confirm("Hapus testimoni ini?")) return;
    const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      setMsg("Testimoni berhasil dihapus");
      fetchData();
      setTimeout(() => setMsg(""), 3000);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Kelola Testimoni</h1>

      {msg && (
        <div className="mb-4 p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 text-sm">
          {msg}
        </div>
      )}

      {/* Form tambah */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5 mb-8 space-y-4">
        <h2 className="font-semibold text-gray-700 text-lg">Tambah Testimoni</h2>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Nama</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-gray-400"
            placeholder="Ibu Anita"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Teks Testimoni</label>
          <textarea
            value={teks}
            onChange={(e) => setTeks(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-gray-400"
            rows={3}
            placeholder="Anak saya jadi suka gambar setelah les di sini..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          <Plus className="w-4 h-4" /> {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>

      {/* List testimoni */}
      <div className="space-y-3">
        <h2 className="font-semibold text-gray-700 text-lg">Daftar Testimoni</h2>
        {testimonials.length === 0 && (
          <p className="text-gray-400 text-sm">Belum ada testimoni.</p>
        )}
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-gray-700 text-sm block mb-1">{t.nama}</span>
              <p className="text-gray-500 text-sm italic">&ldquo;{t.teks}&rdquo;</p>
            </div>
            <button
              onClick={() => handleDelete(t.id)}
              className="text-gray-300 hover:text-gray-500 p-1 flex-shrink-0 transition-colors"
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
