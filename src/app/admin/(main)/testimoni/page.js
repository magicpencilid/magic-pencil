// Admin: Testimoni — upload + list + delete

"use client";

import { useState, useEffect } from "react";
import { Trash2, Upload } from "lucide-react";

export default function AdminTestimoniPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [nama, setNama] = useState("");
  const [teks, setTeks] = useState("");
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const res = await fetch("/api/testimonials");
    const json = await res.json();
    if (json.success) setTestimonials(json.data);
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nama.trim() || !teks.trim()) return;
    setLoading(true);
    setMsg("");

    const fd = new FormData();
    fd.append("nama", nama.trim());
    fd.append("teks", teks.trim());
    if (foto) fd.append("foto", foto);

    const res = await fetch("/api/testimonials", { method: "POST", body: fd });
    const json = await res.json();

    setLoading(false);
    if (json.success) {
      setMsg("Testimoni berhasil ditambahkan ✅");
      setNama("");
      setTeks("");
      setFoto(null);
      setPreview(null);
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
      setMsg("Testimoni berhasil dihapus ✅");
      fetchData();
      setTimeout(() => setMsg(""), 3000);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">✏️ Kelola Testimoni</h1>

      {msg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {msg}
        </div>
      )}

      {/* Form tambah */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-5 mb-8 space-y-4">
        <h2 className="font-semibold text-lg">Tambah Testimoni</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Ibu Anita"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teks Testimoni</label>
          <textarea
            value={teks}
            onChange={(e) => setTeks(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            rows={3}
            placeholder="Anak saya jadi suka gambar setelah les di sini..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Foto (opsional — otomatis B&W)</label>
          <input type="file" accept="image/*" onChange={handleFile} className="text-sm" />
          {preview && (
            <img src={preview} alt="preview" className="w-16 h-16 rounded-full object-cover mt-2 border" />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          <Upload className="w-4 h-4" /> {loading ? "Menyimpan..." : "Simpan Testimoni"}
        </button>
      </form>

      {/* List testimoni */}
      <div className="space-y-3">
        <h2 className="font-semibold text-lg">Daftar Testimoni</h2>
        {testimonials.length === 0 && (
          <p className="text-gray-400 text-sm">Belum ada testimoni.</p>
        )}
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white border rounded-xl p-4 flex items-start gap-4">
            {t.photo_path ? (
              <img src={t.photo_path} alt="" className="w-12 h-12 rounded-full object-cover border flex-shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-lg font-bold flex-shrink-0">
                {t.nama.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{t.nama}</span>
                <span className="text-yellow-400 text-xs">{'★'.repeat(t.rating || 5)}</span>
              </div>
              <p className="text-gray-600 text-sm">&ldquo;{t.teks}&rdquo;</p>
            </div>
            <button
              onClick={() => handleDelete(t.id)}
              className="text-red-400 hover:text-red-600 p-1 flex-shrink-0"
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
