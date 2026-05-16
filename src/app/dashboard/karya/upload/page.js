/* =============================================
   📤 UPLOAD KARYA — Form Upload Foto & Metadata
   ============================================= */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Loader2, X } from "lucide-react";

export default function UploadKaryaPage() {
  const router = useRouter();
  const [murid, setMurid] = useState(null);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kelas, setKelas] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth-murid/me")
      .then((r) => r.json())
      .then((res) => {
        if (!res.success) { router.push("/login"); return; }
        setMurid(res.data);
        setKelas(res.data.class_name || "");
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const valid = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!valid.includes(f.type)) { setError("Format file harus JPG/PNG/WEBP"); return; }
    if (f.size > 10 * 1024 * 1024) { setError("Ukuran file maksimal 10 MB"); return; }
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!judul.trim()) { setError("Judul wajib diisi"); return; }
    if (!file) { setError("File gambar wajib diupload"); return; }

    setLoading(true);
    const form = new FormData();
    form.append("murid_id", murid.murid_id);
    form.append("judul", judul);
    form.append("deskripsi", deskripsi);
    form.append("kelas", kelas);
    form.append("is_public", isPublic ? "true" : "false");
    form.append("file", file);

    try {
      const res = await fetch("/api/karya", { method: "POST", body: form });
      const json = await res.json();
      if (json.success) {
        router.push("/dashboard/karya");
      } else {
        setError(json.errors?.join(", ") || "Gagal upload");
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  if (!murid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/dashboard/karya" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-primary">Upload Karya</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preview / Upload Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <label className="block">
              <div className="aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-400 transition-colors cursor-pointer flex items-center justify-center overflow-hidden relative">
                {preview ? (
                  <>
                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => { setFile(null); setPreview(null); }}
                      className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Upload className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-text-light">Klik untuk upload foto karya</p>
                    <p className="text-xs text-gray-300 mt-1">JPG/PNG/WEBP • Maks 10 MB</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileSelect} className="hidden" />
            </label>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">Judul Karya *</label>
              <input
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Pemandangan Gunung"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-1">Deskripsi</label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Cerita singkat tentang karya ini..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 resize-none"
                maxLength={500}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-1">Kelas</label>
              <input
                type="text"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                placeholder="Contoh: Melukis Akrilik"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-gray-700 focus:ring-gray-300"
              />
              <div>
                <span className="text-sm font-semibold text-primary">Tampilkan di galeri publik</span>
                <p className="text-xs text-text-light">Perlu persetujuan admin sebelum tampil</p>
              </div>
            </label>
          </div>

          {error && (
            <div className="bg-gray-100 border border-gray-200 text-gray-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {loading ? "Mengupload..." : "Upload Karya"}
          </button>
        </form>
      </main>
    </div>
  );
}
