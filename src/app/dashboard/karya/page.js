/* =============================================
   KARYA SAYA — Halaman Galeri Pribadi Murid
   
   Lihat semua karya yang sudah diupload.
   Tombol upload, detail, share.
   ============================================= */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Eye, Share2, Trash2, Loader2, ImageIcon } from "lucide-react";
import { STATUS_LABEL, STATUS_COLOR } from "@/lib/karya-constants";

export default function KaryaPage() {
  const router = useRouter();
  const [murid, setMurid] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKarya = () => {
    if (!murid) return;
    fetch(`/api/karya?murid_id=${murid.murid_id}`)
      .then((r) => r.json())
      .then((res) => { if (res.success) setData(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/auth-murid/me")
      .then((r) => r.json())
      .then((res) => {
        if (!res.success) { router.push("/login"); return; }
        setMurid(res.data);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  useEffect(() => { if (murid) fetchKarya(); }, [murid]);

  const handleDelete = async (id) => {
    if (!confirm("Hapus karya ini?")) return;
    const res = await fetch(`/api/karya/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) fetchKarya();
  };

  const handleShare = async (karya) => {
    const text = `Karya "${karya.judul}" — Magic Pencil\nLihat di: ${window.location.origin}/galeri/${karya.id}`;
    if (navigator.share) {
      navigator.share({ title: karya.judul, text, url: `/galeri/${karya.id}` }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text);
      alert("Link karya sudah dicopy!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-primary">Karya Saya</h1>
          </div>
          <Link
            href="/dashboard/karya/upload"
            className="inline-flex items-center gap-1.5 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors"
          >
            <Plus className="w-4 h-4" /> Upload
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {data.length === 0 ? (
          <div className="text-center py-16 text-text-light">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">Belum ada karya</p>
            <p className="text-sm mb-6">Upload hasil karya pertamamu!</p>
            <Link
              href="/dashboard/karya/upload"
              className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition-colors"
            >
              <Plus className="w-4 h-4" /> Upload Karya
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((karya) => (
              <div key={karya.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {karya.image_path ? (
                    <img
                      src={karya.image_path}
                      alt={karya.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-primary text-sm truncate">{karya.judul}</h3>
                  <p className="text-xs text-text-light mt-0.5 truncate">{karya.deskripsi || "—"}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[karya.status] || "bg-gray-100 text-gray-600"}`}>
                      {STATUS_LABEL[karya.status] || karya.status}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleShare(karya)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Share"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(karya.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
