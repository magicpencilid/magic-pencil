/* =============================================
   PEMBAYARAN TABLE — Admin Panel
   
   Admin liat daftar konfirmasi pembayaran,
   bisa verifikasi (terima/tolak) dan liat bukti transfer.
   ============================================= */

"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  RefreshCw,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";

export default function PembayaranTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchData = () => {
    setLoading(true);
    fetch("/api/pembayaran")
      .then((r) => r.json())
      .then((res) => { if (res.success) setData(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const verifyPayment = async (id, status) => {
    await fetch("/api/pembayaran", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchData();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Pembayaran</h1>
        <button onClick={fetchData}
          className="flex items-center gap-1 text-sm text-text-light hover:text-primary transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left p-3 font-semibold text-text-light">No</th>
                  <th className="text-left p-3 font-semibold text-text-light">Nama</th>
                  <th className="text-left p-3 font-semibold text-text-light">Invoice</th>
                  <th className="text-left p-3 font-semibold text-text-light">Jumlah</th>
                  <th className="text-left p-3 font-semibold text-text-light">Tgl Upload</th>
                  <th className="text-left p-3 font-semibold text-text-light">Bukti</th>
                  <th className="text-center p-3 font-semibold text-text-light">Status</th>
                  <th className="text-center p-3 font-semibold text-text-light">Verifikasi</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-12 text-text-light">
                      <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      Belum ada pembayaran
                    </td>
                  </tr>
                )}
                {data.map((row, i) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 text-text-light">{i + 1}</td>
                    <td className="p-3 font-medium text-primary">{row.full_name || "-"}</td>
                    <td className="p-3 text-text-light">{row.invoice_number || "-"}</td>
                    <td className="p-3 text-text-light font-semibold text-center">
                      {row.amount ? `Investasi ${Number(row.amount).toLocaleString("id-ID")}` : "-"}
                    </td>
                    <td className="p-3 text-text-light text-xs">{row.uploaded_at}</td>
                    <td className="p-3">
                      {row.file_url ? (
                        <button
                          onClick={() => setPreviewUrl(row.file_url)}
                          className="flex items-center gap-1 text-xs text-accent hover:underline"
                        >
                          <ImageIcon className="w-4 h-4" />
                          Lihat
                        </button>
                      ) : (
                        <span className="text-xs text-gray-300">-</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        row.status === "verified" ? "bg-gray-200 text-gray-700" :
                        row.status === "rejected" ? "bg-gray-100 text-gray-500" :
                        "bg-gray-100 text-gray-500"
                      }`}>{row.status}</span>
                    </td>
                    <td className="p-3 text-center">
                      {row.status === "pending" && (
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => verifyPayment(row.id, "verified")}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg" title="Terima">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => verifyPayment(row.id, "rejected")}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg" title="Tolak">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 text-xs text-text-light border-t border-gray-50">
            Total: {data.length} pembayaran
          </div>
        </div>
      )}

      {/* Lightbox preview */}
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewUrl}
              alt="Bukti transfer"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="flex justify-center gap-2 mt-3">
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs bg-white/20 text-white px-3 py-1.5 rounded-full hover:bg-white/30"
              >
                <ExternalLink className="w-3 h-3" />
                Buka di tab baru
              </a>
              <button
                onClick={() => setPreviewUrl(null)}
                className="text-xs bg-white/20 text-white px-3 py-1.5 rounded-full hover:bg-white/30"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
