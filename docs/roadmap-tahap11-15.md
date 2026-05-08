# Roadmap Tahap 11–15 — Magic Pencil Next Features

---

## 🚀 TAHAP 11: Login Murid + Database + Dashboard
*Prioritas: Tertinggi — dasar dari semua fitur berikutnya*

### Bagian 1 — Database
- [ ] Buat tabel baru di `magic-pencil.db`:
  - `akun_murid` (id, murid_id, email, password_hash, created_at)
  - `absensi` (id, murid_id, jadwal_id, check_in, check_out, status, tanggal)
- [ ] Update `src/lib/database.js` dengan semua skema baru
- [ ] Seed data test (beberapa murid sample)

### Bagian 2 — API Auth Murid
- [ ] POST `/api/auth/register` — daftar akun murid (setelah diverif admin)
- [ ] POST `/api/auth/login` — login pake email/WA + password
- [ ] POST `/api/auth/logout`
- [ ] GET `/api/auth/me` — cek session

### Bagian 3 — Halaman Login Murid
- [ ] `/login` — form login murid (email + password)
- [ ] Styling monochrome grey (sama kaya admin)
- [ ] Session management (cookies/JWT)

### Bagian 4 — Dashboard Murid
- [ ] `/dashboard` — halaman utama murid setelah login
- [ ] Tampilan: salam, kelas terdaftar, jadwal hari ini, status tagihan
- [ ] Navbar khusus murid (sederhana)
- [ ] Styling monochrome grey

---

## 🚀 TAHAP 12: Absensi Check-in/Check-out
*Prioritas: Tinggi*

### Bagian 1 — API Absensi
- [ ] GET `/api/absensi?murid_id=...` — riwayat absensi
- [ ] POST `/api/absensi/checkin` — check-in
- [ ] POST `/api/absensi/checkout` — check-out
- [ ] GET `/api/absensi/hari-ini` — status absensi hari ini

### Bagian 2 — Halaman Absensi
- [ ] Tombol "Check-in" di dashboard murid
- [ ] Tombol "Check-out" (aktif setelah check-in)
- [ ] Status badge: ✅ Hadir / ⏳ Belum Check-in / ❌ Tidak Hadir
- [ ] Riwayat absensi (kalender/simple list)

### Bagian 3 — Admin: Lihat Absensi
- [ ] Tambah tab "Absensi" di sidebar admin
- [ ] Tabel absensi per murid + filter tanggal
- [ ] Recap kehadiran (berapa kali hadir, alpha, telat)

### Bagian 4 — QR Code (Optional)
- [ ] Generate QR code unik per sesi kelas
- [ ] Scan QR → auto check-in

---

## 🚀 TAHAP 13: Jadwal Kelas untuk Murid
*Prioritas: Sedang*

### Bagian 1 — API Jadwal Murid
- [ ] GET `/api/jadwal-murid?murid_id=...` — jadwal pribadi murid
- [ ] Filter: jadwal hari ini, minggu ini, bulan ini

### Bagian 2 — Halaman Jadwal Murid
- [ ] `/dashboard/jadwal` — tampilan jadwal (list/kalender)
- [ ] Info: nama kelas, tanggal, jam, lokasi
- [ ] Status: sudah lewat / hari ini / akan datang

### Bagian 3 — Riwayat Kelas
- [ ] `/dashboard/riwayat` — kelas yang sudah diikuti
- [ ] Link ke absensi masing-masing sesi

---

## 🚀 TAHAP 14: PWA + Notifikasi Push
*Prioritas: Sedang-Rendah*

### Bagian 1 — Setup PWA
- [ ] `manifest.json` — icon, nama, theme color
- [ ] Service worker — cache static assets
- [ ] `/sw.js` — service worker file
- [ ] Icon PWA (monochrome grey)

### Bagian 2 — Push Notification (Backend)
- [ ] Setup VAPID keys (Web Push protocol)
- [ ] POST `/api/notifikasi/subscribe` — simpan subscription
- [ ] POST `/api/notifikasi/send` — kirim push
- [ ] Integrasi: pendaftar baru → push admin
- [ ] Integrasi: pembayaran masuk → push admin

### Bagian 3 — Push Notification (Frontend)
- [ ] Notif permission request (saat login)
- [ ] Tombol "Aktifkan Notifikasi" di dashboard
- [ ] Notif test (kirim ke diri sendiri)

---

## 🚀 TAHAP 15: Finalisasi + Deployment
*Prioritas: Terakhir*

### Bagian 1 — Polish & Testing
- [ ] Testing semua flow: daftar → login → absen → bayar
- [ ] Testing di HP (mobile view)
- [ ] Fix bug & styling
- [ ] Monochrome consistency check

### Bagian 2 — Deployment
- [ ] Build ulang
- [ ] Deploy ke server (SCP + PM2)
- [ ] Test live di `magicpencil.my.id`
- [ ] Clear cache + restart

### Bagian 3 — Backup
- [ ] Backup database (magic-pencil.db)
- [ ] Backup source code
- [ ] Catat perubahan di MEMORY.md + Obsidian

---

## 📊 Timeline Estimasi

| Tahap | Fitur | Estimasi |
|-------|-------|----------|
| **11** | Login + DB + Dashboard | ⏳ **Sekarang** |
| **12** | Absensi Check-in/out | ⏳ **Lanjutan** |
| **13** | Jadwal Murid | ⏳ |
| **14** | PWA + Notifikasi | ⏳ |
| **15** | Final + Deploy | ⏳ |

---

**Setuju willy?** Kalo oke, kita **gas Tahap 11 dulu** — Login Murid + Database + Dashboard! 🚀
