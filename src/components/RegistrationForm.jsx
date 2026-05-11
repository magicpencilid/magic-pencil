/* =============================================
   📝 REGISTRATION FORM — Form Pendaftaran
   
   Fungsi: Menerima data pendaftar baru.
   - Validasi input (required, format WA, email)
   - State management pake useState
   - Submit pake handleSubmit (masih console.log dulu)
   
   "use client" karena pake state + event handler.
   
   Data yang dikumpulin sesuai schema:
   - full_name, participant_name, whatsapp, email
   - age, class_name, source, notes
   ============================================= */

"use client";

import { useState, useEffect } from "react";
import { Send, AlertCircle, User, Phone, Mail, Calendar, BookOpen, MessageSquare } from "lucide-react";

/* 📝 Data kelas & investasi — diambil dari API pas form dimuat */

/* 📝 Data sumber informasi */
const sourceOptions = [
  "Instagram",
  "Facebook",
  "TikTok",
  "Teman/Keluarga",
  "Google Search",
  "Brosur",
  "Lainnya",
];

/* =============================================
   State awal form — semua field kosong
   ============================================= */
const initialForm = {
  fullName: "",
  participantName: "",
  whatsapp: "",
  email: "",
  age: "",
  alamat: "",
  className: "",
  source: "",
  notes: "",
  pilihHari: "",
  pilihJam: "",
};

export default function RegistrationForm() {
  const [form, setForm] = useState(initialForm);        // data form
  const [errors, setErrors] = useState({});              // error validasi
  const [kelasList, setKelasList] = useState([]);        // daftar kelas & investasi
  const [hariList, setHariList] = useState([]);          // daftar hari
  const [jamList, setJamList] = useState([]);            // daftar jam

  // Ambil data dari API
  useEffect(() => {
    Promise.all([
      fetch("/api/kelas").then(r => r.json()),
      fetch("/api/schedule-config").then(r => r.json()),
    ]).then(([kelasRes, schedRes]) => {
      if (kelasRes.success) setKelasList(kelasRes.data);
      if (schedRes.success) {
        setHariList(schedRes.data.hari);
        setJamList(schedRes.data.jam);
      }
    }).catch(console.error);
  }, []);

  /* =============================================
     Handle perubahan input
     ============================================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Hapus error field yang lagi diedit
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /* =============================================
     Validasi sebelum submit
     ============================================= */
  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Nama lengkap wajib diisi";
    if (!form.participantName.trim()) newErrors.participantName = "Nama peserta wajib diisi";
    if (!form.whatsapp.trim()) {
      newErrors.whatsapp = "Nomor WA wajib diisi";
    } else if (!/^(\+62|62|0)\d{8,12}$/.test(form.whatsapp.replace(/\s/g, ""))) {
      newErrors.whatsapp = "Format nomor WA tidak valid (contoh: 0812xxxx)";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!form.age || form.age < 3 || form.age > 99) {
      newErrors.age = "Usia harus antara 3-99 tahun";
    }
    if (!form.className) newErrors.className = "Pilih kelas yang diinginkan";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* =============================================
     Handle submit form
     ============================================= */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Simpan data ke sessionStorage, redirect ke syarat-ketentuan
    sessionStorage.setItem("pendaftaran_data", JSON.stringify(form));
    window.location.href = "/syarat-ketentuan?from=daftar";
  };

  /* =============================================
     Tampilan form
     ============================================= */

  // Form utama — langsung tampilin form, gak ada success view lagi
  // (success view pindah ke halaman syarat-ketentuan)
  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      
      {/* ===== BARIS 1: Nama Lengkap + Nama Peserta ===== */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Nama Lengkap */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-1.5">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Nama orang tua/wali"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                errors.fullName ? "border-red-400 bg-red-50" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors`}
            />
          </div>
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
        </div>

        {/* Nama Peserta */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-1.5">
            Nama Peserta <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="participantName"
              value={form.participantName}
              onChange={handleChange}
              placeholder="Nama anak/peserta"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                errors.participantName ? "border-red-400 bg-red-50" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors`}
            />
          </div>
          {errors.participantName && <p className="text-red-500 text-xs mt-1">{errors.participantName}</p>}
        </div>
      </div>

      {/* ===== BARIS 2: WA + Email ===== */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-1.5">
            No. WhatsApp <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="0812xxxx"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                errors.whatsapp ? "border-red-400 bg-red-50" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors`}
            />
          </div>
          {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@contoh.com"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                errors.email ? "border-red-400 bg-red-50" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* ===== ALAMAT ===== */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-1.5">
          Alamat
        </label>
        <textarea
          name="alamat"
          value={form.alamat}
          onChange={handleChange}
          placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan, Kota"
          rows="2"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-none"
        />
      </div>

      {/* ===== PILIH JADWAL ===== */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Hari */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-1.5">
            Pilih Hari
          </label>
          <select
            name="pilihHari"
            value={form.pilihHari}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors appearance-none bg-white"
          >
            <option value="">Pilih hari...</option>
            {hariList.map((h) => (
              <option key={h.id} value={h.value}>{h.value}</option>
            ))}
          </select>
        </div>

        {/* Jam */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-1.5">
            Pilih Jam
          </label>
          <select
            name="pilihJam"
            value={form.pilihJam}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors appearance-none bg-white"
          >
            <option value="">Pilih jam...</option>
            {jamList.map((j) => (
              <option key={j.id} value={j.value}>{j.value}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== BARIS 3: Usia + Kelas ===== */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Usia */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-1.5">
            Usia Peserta <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              min="3"
              max="99"
              placeholder="Contoh: 7"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                errors.age ? "border-red-400 bg-red-50" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors`}
            />
          </div>
          {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
        </div>

        {/* Kelas */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-1.5">
            Kelas Pilihan <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
            <select
              name="className"
              value={form.className}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border appearance-none bg-white ${
                errors.className ? "border-red-400 bg-red-50" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors`}
            >
              <option value="">Pilih kelas...</option>
              {kelasList.map((k) => (
                <option key={k.id} value={k.name}>
                  {k.name}{k.price ? ` — Investasi ${Number(k.price).toLocaleString("id-ID")}` : " — Hubungi Admin"}
                </option>
              ))}
            </select>
          </div>
          {errors.className && <p className="text-red-500 text-xs mt-1">{errors.className}</p>}
        </div>
      </div>

      {/* ===== BARIS 4: Sumber Info ===== */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-1.5">
          Tau Magic Pencil dari mana?
        </label>
        <select
          name="source"
          value={form.source}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors appearance-none bg-white"
        >
          <option value="">Pilih sumber...</option>
          {sourceOptions.map((src) => (
            <option key={src} value={src}>
              {src}
            </option>
          ))}
        </select>
      </div>

      {/* ===== BARIS 5: Catatan ===== */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-1.5">
          Catatan Tambahan
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Ada yang ingin ditanyakan? (opsional)"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-none"
          />
        </div>
      </div>

      {/* ===== PESAN ERROR ===== */}
      {errors.api && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errors.api}
        </div>
      )}



      {/* ===== TOMBOL SUBMIT ===== */}
      <button
        type="submit"
        className="w-full bg-accent text-white font-bold py-3.5 rounded-xl hover:bg-accent-dark transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
      >
        <Send className="w-5 h-5" />
        Lanjut ke Syarat & Ketentuan
      </button>


    </form>
  );
}
