/* =============================================
   KONFIRMASI PEMBAYARAN
   
   User upload bukti transfer + konfirmasi.
   3 step: form -> confirm -> done
   
   Setelah done, tampilin akun login (email + password).
   ============================================= */

"use client";

import { useState, useRef } from "react";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Banknote,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  Key,
  Paperclip,
  X,
} from "lucide-react";

export default function KonfirmasiPembayaran({ registrant, invoice, onSuccess, akunInfo }) {
  const [step, setStep] = useState("form"); // form -> confirm -> done
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!validTypes.includes(selected.type)) {
        setError("File harus gambar (JPG/PNG/WEBP)");
        return;
      }
      if (selected.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5 MB");
        return;
      }
      setError("");
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("registration_id", registrant.id);
      formData.append("notes", notes);
      if (file) formData.append("file", file);

      const res = await fetch("/api/pembayaran/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (json.success) {
        setResult(json.data);
        setStep("done");
        if (onSuccess) onSuccess();
      } else {
        setError(json.errors?.[0] || "Gagal konfirmasi");
      }
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  // STEP: DONE (show credentials setelah bayar)
  if (step === "done" && result) {
    return (
      <div className="bg-white rounded-2xl border border-green-200 p-6 shadow-sm animate-fade-in">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-primary mb-2">Konfirmasi Terkirim!</h3>
          <p className="text-sm text-text-light mb-4">{result.message}</p>

          {/* AKUN LOGIN — muncul setelah konfirmasi bayar */}
          {akunInfo && (
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 text-left text-sm mb-4">
              <p className="font-semibold text-primary mb-2 flex items-center gap-2"><Key className="w-4 h-4" /> Akun Login Kamu</p>
              <div className="space-y-1 text-text-light">
                <p>User ID: <strong className="text-primary font-mono">{akunInfo.email}</strong></p>
                <p>Password: <strong className="text-primary font-mono">{akunInfo.password_plain}</strong></p>
              </div>
              <div className="mt-3 pt-3 border-t border-accent/20 text-xs text-amber-600 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Simpan password ini! Kalo lupa, hubungi admin.
              </div>
              <a
                href="/login"
                className="mt-3 inline-flex items-center justify-center bg-accent text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-accent-dark transition-colors"
              >
                Login Sekarang <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}

          <div className="bg-green-50 rounded-xl p-4 text-sm text-green-800">
            <p>Invoice: <strong>{result.invoice_number}</strong></p>
            <p>Total: <strong>Investasi {Number(result.amount).toLocaleString("id-ID")}</strong></p>
            {result.file_url && (
              <p className="mt-1 text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Bukti transfer terlampir</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // STEP: CONFIRM
  if (step === "confirm") {
    return (
      <div className="bg-white rounded-2xl border border-yellow-200 p-6 shadow-sm animate-fade-in">
        <h3 className="font-bold text-primary mb-3">Konfirmasi Pembayaran</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm mb-4">
          <p className="font-semibold text-gray-700 mb-2">Pastikan data sudah benar:</p>
          <div className="space-y-1 text-gray-600">
            <p>Invoice: <strong>{invoice?.invoice_number}</strong></p>
            <p>Total: <strong>Investasi {Number(invoice?.amount).toLocaleString("id-ID")}</strong></p>
            <p>Transfer ke <strong>BLU BY BCA DIGITAL</strong>
            Atas nama <strong>D Willy Ardhany</strong>
            No.Rek <strong>001662116182</strong></p>
            {notes && <p className="mt-2">Catatan: <em>{notes}</em></p>}
            {preview && (
              <div className="mt-2">
                <p className="text-xs mb-1 flex items-center gap-1"><Paperclip className="w-3 h-3" /> Bukti transfer:</p>
                <img
                  src={preview}
                  alt="Bukti transfer"
                  className="w-32 h-32 object-cover rounded-lg border border-yellow-300"
                />
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => setStep("form")}
            className="flex items-center gap-1 px-4 py-3 rounded-xl border border-gray-200 text-text-light hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="flex-1 bg-accent text-white font-bold py-3 rounded-xl hover:bg-accent-dark transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Ya, Saya Sudah Transfer
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // STEP: FORM (default)
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
          <Banknote className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-bold text-primary">Konfirmasi Pembayaran</h3>
          <p className="text-sm text-text-light">Upload bukti transfer lalu klik tombol di bawah</p>
        </div>
      </div>

      {/* Info transfer */}
      {invoice && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm mb-4">
          <p className="font-semibold text-gray-700 mb-2">Detail Pembayaran</p>
          <div className="space-y-1 text-gray-600">
            <p>Invoice: <strong>{invoice.invoice_number}</strong></p>
            <p>Total: <strong>Investasi {Number(invoice.amount).toLocaleString("id-ID")}</strong></p>
            <p className="mt-2">Transfer ke <strong>BLU BY BCA DIGITAL</strong></p>
            <p className="mt-1">Atas nama <strong>D Willy Ardhany</strong></p>
            <p className="mt-1">No.Rek <strong>001662116182</strong></p>
          </div>
        </div>
      )}

      {/* Upload bukti */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-primary mb-1.5">
          Upload Bukti Transfer
        </label>
        {!preview ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all"
          >
            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-text-light">Klik untuk upload screenshot</p>
            <p className="text-xs text-gray-300 mt-1">JPG/PNG/WEBP, maks 5 MB</p>
          </div>
        ) : (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-48 object-contain rounded-xl border border-gray-200"
            />
            <button
              onClick={removeFile}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Catatan */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Catatan tambahan (opsional) — misal: nama pengirim transfer"
        rows="2"
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={() => setStep("confirm")}
        className="w-full bg-accent text-white font-bold py-3 rounded-xl hover:bg-accent-dark transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
      >
        <CheckCircle className="w-5 h-5" />
        Saya Sudah Transfer
      </button>

      <p className="text-xs text-text-light text-center mt-3">
        Admin akan memverifikasi pembayaran dalam 1x24 jam
      </p>
    </div>
  );
}
