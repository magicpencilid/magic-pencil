/* =============================================
   FAQ — Pertanyaan yang Sering Diajukan
   
   Accordion interaktif, rapi, dan mudah dibaca.
   ============================================= */

"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Apa itu Magic Pencil?",
    a: "Magic Pencil adalah penyedia kelas menggambar yang fokus pada pengembangan kemampuan seni menggunakan media pensil dan cat akrilik. Kami melayani peserta dari pemula hingga tingkat lanjutan, untuk semua umur.",
  },
  {
    q: "Siapa saja yang bisa mengikuti kelas?",
    a: "Semua kalangan bisa mengikuti kelas Magic Pencil, dari anak-anak hingga dewasa. Program kami dirancang untuk menyesuaikan dengan tingkat kemampuan masing-masing peserta.",
  },
  {
    q: "Di mana lokasi kelas dilaksanakan?",
    a: "Kelas dilaksanakan secara offline di area Bogor dan Jakarta. Venue kelas ditentukan setiap minggunya dan akan diinformasikan melalui aplikasi dan WhatsApp grup kelas.",
  },
  {
    q: "Berapa biaya kelas?",
    a: "Biaya kelas bervariasi tergantung program yang dipilih. Informasi lengkap mengenai biaya dapat dilihat di halaman pendaftaran atau dengan menghubungi kami melalui WhatsApp.",
  },
  {
    q: "Apa saja yang perlu dibawa?",
    a: "Untuk kelas bulanan, peserta wajib membawa peralatan dasar pribadi seperti buku sketsa, pensil, pengserut, dan penghapus. Untuk kelas harian, semua keperluan gambar sudah disediakan.",
  },
  {
    q: "Bagaimana cara mendaftar?",
    a: "Pendaftaran dilakukan melalui website Magic Pencil. Isi formulir pendaftaran, baca dan setujui Syarat & Ketentuan, lalu lakukan pembayaran sesuai instruksi yang diberikan.",
  },
  {
    q: "Kapan jadwal kelas?",
    a: "Kelas tersedia dalam 3 sesi: 10.00-12.00, 13.00-15.00, dan 15.00-17.00. Jadwal setiap minggunya akan diinformasikan melalui aplikasi dan WhatsApp.",
  },
  {
    q: "Bagaimana sistem pembayarannya?",
    a: "Pembayaran dapat dilakukan melalui Virtual Account, QRIS, atau transfer bank. Pembayaran dilakukan setiap bulan atau per sesi, dan tidak dapat dicicil.",
  },
  {
    q: "Apakah biaya kelas bisa dikembalikan?",
    a: "Biaya yang sudah dibayarkan tidak dapat ditarik kembali (non-refundable), namun bisa dipindahtangankan kepada orang lain dengan konfirmasi terlebih dahulu.",
  },
  {
    q: "Bagaimana jika berhalangan hadir?",
    a: "Jika berhalangan hadir, silakan lakukan perubahan jadwal sehari sebelum kelas dimulai. Sesi pengganti akan diberikan perpanjangan waktu 1 jam pada minggu berikutnya sesuai jadwal kelas yang bersangkutan.",
  },
  {
    q: "Apakah hasil karya murid akan dipublikasikan?",
    a: "Karya murid akan ditampilkan di website Magic Pencil sebagai portofolio. Hak cipta tetap milik murid. Jika tidak ingin dipublikasikan, silakan sampaikan kepada kami.",
  },
  {
    q: "Bagaimana cara menghubungi Magic Pencil?",
    a: "Kami bisa dihubungi melalui WhatsApp di +62 811 1199 059 atau email ke admin@magicpencil.my.id. Informasi lebih lengkap ada di halaman Kontak.",
  },
];

function AccordionItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-4 py-5 text-left group"
      >
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-gray-200 transition-colors">
          <HelpCircle className="w-4 h-4 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-semibold text-primary">
              {faq.q}
            </h3>
            <ChevronDown
              className={`w-4 h-4 text-text-light shrink-0 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              isOpen ? "max-h-96 mt-3" : "max-h-0"
            }`}
          >
            <p className="text-text-light leading-relaxed text-sm">
              {faq.a}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-surface-alt">
      {/* ===== HEADER ===== */}
      <div className="gradient-hero py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">
            FAQ
          </h1>
          <p className="text-text-light mt-3 max-w-2xl mx-auto">
            Pertanyaan yang sering diajukan seputar kelas dan layanan Magic Pencil.
          </p>
        </div>
      </div>

      {/* ===== KONTEN ===== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
