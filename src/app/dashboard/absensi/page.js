/* =============================================
   📋 RIWAYAT ABSENSI — Halaman Absensi Murid
   
   Lihat semua riwayat check-in/check-out.
   ============================================= */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, Loader2 } from "lucide-react";

export default function RiwayatAbsensiPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth-murid/me")
      .then((r) => r.json())
      .then((res) => {
        if (!res.success) { router.push("/login"); return; }
      })
      .catch(() => router.push("/login"));

    fetch("/api/absensi")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-primary">Riwayat Absensi</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {data.length === 0 ? (
          <div className="text-center py-16 text-text-light">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-base">Belum ada riwayat absensi</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left p-3 font-semibold text-text-light">Tanggal</th>
                    <th className="text-left p-3 font-semibold text-text-light">Check-in</th>
                    <th className="text-left p-3 font-semibold text-text-light">Check-out</th>
                    <th className="text-center p-3 font-semibold text-text-light">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((r) => (
                    <tr key={r.id} className="border-b border-gray-50">
                      <td className="p-3 font-medium text-primary">{r.tanggal}</td>
                      <td className="p-3 text-text-light">{r.check_in ? r.check_in.split(",")[1]?.trim() || r.check_in : "-"}</td>
                      <td className="p-3 text-text-light">{r.check_out ? r.check_out.split(",")[1]?.trim() || r.check_out : "-"}</td>
                      <td className="p-3 text-center">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          r.check_out ? "bg-gray-200 text-gray-700" :
                          r.check_in ? "bg-gray-100 text-gray-700" :
                          "bg-gray-50 text-gray-500"
                        }`}>
                          {r.check_out ? "Selesai" : r.check_in ? "Berlangsung" : "Tidak Hadir"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
