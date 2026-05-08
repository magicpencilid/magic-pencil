/* =============================================
   📱 WHATSAPP TEMPLATE — Template Pesan WA
   
   Generate teks buat di-copy-paste ke WhatsApp.
   Monochrome modern grey style.
   ============================================= */

"use client";

import { MessageSquare, Copy, Check } from "lucide-react";
import { useState } from "react";

const templates = {
  dikontak: (data) =>
    `Terima kasih telah mendaftar di *Magic Pencil*.

Kami telah menerima pendaftaran untuk:
Peserta: *${data.participant_name}*
Kelas: *${data.class_name}*

Kami akan mengirimkan informasi jadwal dan biaya dalam waktu dekat. Jika ada pertanyaan, silakan hubungi kami kembali.

Selamat menggambar,
Tim Magic Pencil`,

  aktif: (data) =>
    `Pendaftaran *${data.participant_name}* di kelas *${data.class_name}* telah *AKTIF*.

Jadwal dan informasi lebih lanjut akan kami kirimkan secara terpisah.

Selamat menggambar,
Tim Magic Pencil`,

  invoice: (data, inv) =>
    `Berikut invoice pendaftaran *Magic Pencil*:

No: *${inv.invoice_number}*
Total: *Investasi ${Number(inv.amount).toLocaleString("id-ID")}*
Batas Bayar: *${inv.payment_due_date}*

Silakan transfer ke:
BLU BY BCA DIGITAL a.n. D Willy Ardhany

Konfirmasi setelah transfer. Terima kasih.

Selamat menggambar,
Tim Magic Pencil`,
};

export default function WATemplate({ data, invoice, type }) {
  const [copied, setCopied] = useState(false);
  const template = templates[type];
  if (!template || !data) return null;

  const message = invoice ? template(data, invoice) : template(data);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          <h3 className="font-semibold text-sm text-primary">Template WhatsApp</h3>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs bg-gray-100 text-text-light px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-gray-500" />
              Tersalin!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Salin
            </>
          )}
        </button>
      </div>
      <pre className="bg-gray-50 rounded-xl p-3 text-xs text-text-light whitespace-pre-wrap font-sans leading-relaxed border border-gray-100">
        {message}
      </pre>
    </div>
  );
}
