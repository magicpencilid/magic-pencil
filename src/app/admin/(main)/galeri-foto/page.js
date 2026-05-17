/* =============================================
   📋 ADMIN GALERI FOTO — Upload & Kelola Galeri
   
   Upload foto baru, lihat hasil upload, hapus.
   ============================================= */

"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, Loader2, ImageIcon, Upload, X, House } from "lucide-react";

export default function AdminGaleriFotoPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showHomepage, setShowHomepage] = useState(true);
  const fileRef = useRef(null);
  const homeCount = photos.filter(p => p.show_on_homepage).length;

  const fetchPhotos = () => {
    setLoading(true);
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setPhotos(res.data.willy || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPhotos(); }, []);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title.trim() || !file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("deskripsi", deskripsi.trim());
    formData.append("show_homepage", showHomepage ? "1" : "0");
    formData.append("file", file);

    try {
      const res = await fetch("/api/gallery", { method: "POST", body: formData });
      const json = await res.json();
      if (json.success) {
        setShowForm(false);
        setTitle("");
        setDeskripsi("");
        setFile(null);
        setPreview(null);
        fetchPhotos();
      } else {
        alert(json.errors?.join("\n") || "Gagal upload");
      }
    } catch {
      alert("Gagal upload");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus foto ini? Tindakan ini tidak bisa dibatalkan.")) return;
    const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) fetchPhotos();
    else alert(json.errors?.join(", ") || "Gagal hapus");
  };

  const handleToggleHomepage = async (id, current) => {
    const res = await fetch(`/api/gallery/${id}/toggle-homepage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ show_on_homepage: current ? 0 : 1 }),
    });
    const json = await res.json();
    if (json.success) fetchPhotos();
    else alert(json.errors?.join(", ") || "Gagal mengubah status");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-primary">Galeri Foto</h1>
          <p className="text-sm text-text-light mt-1">Upload & kelola foto-foto galeri</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent-dark transition-colors"
          >
            <Plus className="w-4 h-4" /> Upload Foto
          </button>
        )}
      </div>

      {/* Upload Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-primary">Upload Foto Baru</h2>
            <button
              onClick={() => { setShowForm(false); setFile(null); setPreview(null); }}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-light" />
            </button>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">Judul Foto</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Suasana Kelas Melukis"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">Deskripsi (opsional)</label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Cerita singkat tentang foto ini"
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
              />
            </div>

            {/* File */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">File Gambar</label>
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
                    className="h-40 rounded-xl object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 text-text-light hover:border-accent hover:text-accent transition-colors text-sm"
                >
                  <Upload className="w-4 h-4" /> Pilih Gambar
                </button>
              )}
            </div>

            {/* Show on Homepage */}
            <div>
              <button
                type="button"
                onClick={() => setShowHomepage(!showHomepage)}
                disabled={!showHomepage && homeCount >= 6}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  showHomepage
                    ? "bg-accent text-white hover:bg-accent-dark"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                <House className="w-3.5 h-3.5" />
                {showHomepage ? "Tampil" : homeCount >= 6 ? "Penuh" : "Jangan Tampil"}
              </button>
            </div>

            {/* Submit */}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={uploading || !title.trim() || !file}
                className="inline-flex items-center gap-1.5 bg-accent text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? "Mengupload..." : "Upload"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setFile(null); setPreview(null); }}
                className="px-4 py-2 rounded-xl text-sm text-text-light hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Photo Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-20 text-text-light">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-2">Belum ada foto</p>
          <p className="text-sm">Upload foto pertama untuk galeri!</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-400 mb-3">
            {homeCount}/6 foto ditampilkan di Beranda
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img
                  src={photo.image_path}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <h3 className="font-bold text-primary text-sm truncate">{photo.title}</h3>
                {photo.deskripsi && (
                  <p className="text-xs text-text-light mt-0.5 truncate">{photo.deskripsi}</p>
                )}
                <div className="mt-1.5">
                  <button
                    onClick={() => handleToggleHomepage(photo.id, photo.show_on_homepage)}
                    disabled={!photo.show_on_homepage && homeCount >= 6}
                    className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      photo.show_on_homepage
                        ? "bg-accent text-white hover:bg-accent-dark"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    <House className="w-3.5 h-3.5" />
                    {photo.show_on_homepage ? "Di Beranda" : homeCount >= 6 ? "Penuh" : "Beranda"}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-gray-400">
                    {new Date(photo.created_at + "Z").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>)}
    </div>
  );
}
