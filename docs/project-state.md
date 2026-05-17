# Project Status — Magic Pencil

> Status terkini project. Update tiap selesai kerja.

---

## Ringkasan

| Item | Status |
|------|--------|
| **Tahap Terakhir** | 31 — Floating WA di Admin + Aturan Baru |
| **Versi Terdeploy** | ✅ 17 Mei 2026 — Floating WA Admin (PM2 ↺ 77) |
| **Status Server** | ✅ PM2 online |
| **DB** | SQLite — `magic-pencil.db` (fresh, 0 pendaftar, 2 produk) |
| **Repo** | GitHub: `magicpencilid/magic-pencil` |

---

## Deploy Status

| Lokasi | Status | Catatan |
|--------|--------|---------|
| Lokal (laptop) | ✅ Ready | Build siap |
| Server (aaPanel) | ✅ Running | Terkini (17 Mei) — commit `491b5fa`, PM2 ↺ 77 |

---

## Fitur Terdeploy

| Tahap | Fitur | Tanggal |
|-------|-------|---------|
| 16 | Upload Karya + Galeri Publik + Watermark (jimp) | 10 Mei |
| 17 | Syarat & Ketentuan + checkbox daftar | 10 Mei |
| 18a | Push Notification (register, invoice, pembayaran) | 10 Mei |
| 18b | Telegram Bot (@magicpencil_notif_bot) | 10 Mei |
| 18c | WhatsApp Floating Button (wa.me/628111150563) | 10 Mei |
| 19 | Testimoni (simplified: no foto, no bintang) | 12 Mei |
| 20 | Share ke Medsos (ShareModal + Native Share) + Istilah Investasi | 15 Mei |
| 21 | Vertical Feed Lightbox (Instagram-style) | 15 Mei |
| 22 | Like + Reaction (2 tabel: gallery_likes + karya_likes, fingerprint) | 15 Mei |
| 23 | Auto Akun Murid (create pas daftar, kredensial setelah bayar, password di kartu murid) | 15 Mei |
| 24 | Online Store (katalog /store, order WA, admin CRUD, upload gambar, beli merch) | 15 Mei |
| 25 | Navbar + Gallery UX Fixes (link Toko, Beli Merch, rename galeri) | 15 Mei |
| 26 | Kompres Gambar Store (Jimp resize 800px, JPEG quality 80) | 15 Mei |
| 27 | Like System Karya Murid (tabel karya_likes, API terpisah) | 15 Mei |
| 28 | Leaderboard (top 10 approved + badge peringkat) | 15 Mei |
| 29 | Auto-generate Jadwal (monthly=4x, single=1x, meeting_number, tanggal real) | 16 Mei |
| 30 | Minat Gambar + Design System (dropdown minat, monochrome gray rules) | 16 Mei |
| -- | Hapus box WA redudan di halaman daftar + fix design system icon | 16 Mei |
| -- | Fix floating WA nutup tombol WA di modal store (HP) | 16 Mei |
| -- | Admin jadwal: hapus +Tambah, filter kelas, filter jadwal lewat | 16 Mei |
| -- | API default-location (skip UI, nunggu WA API) | 16 Mei |
| -- | Floating WA sembunyi di halaman admin (CSS :has selector) | 17 Mei |
| -- | Aturan baru: panggilan wil, larangan lo/gua, larangan agama, workflow step | 17 Mei |
| -- | Startup script CMD dihapus dari Windows startup | 17 Mei |

### Fitur Kecil (tanpa nomor tahap)
| Fitur | Tanggal |
|-------|---------|
| Navbar white glass + font Inter + mobile dropdown | 11 Mei |
| Gallery lightbox (click-to-zoom) | 11 Mei |
| Flow daftar baru (form syket setuju/tidak) | 11 Mei |
| Standar gambar default (watermark, script, docs) | 11 Mei |
| No.Rek BLU BY BCA DIGITAL (001662116182) | 14 Mei |

---

## Data Server *(per 17 Mei 2026 — DB fresh)*

| Item | Jumlah |
|------|--------|
| Kelas | 6 (3 monthly + 3 single) |
| Pendaftar | **0** (fresh start setelah Tahap 23) |
| Produk Store | 2 (Kaos polos + Kaos polo) |
| Aktif | 0 |
| Karya | 0 |
| Absensi | 0 |
| Invoice | 0 |
| Uploads | 3.3MB (gambar background, watermark, 2 foto produk) |

---

## Progress Tahap

| Tahap | Fitur | Status |
|-------|-------|--------|
| 23 | Auto Akun Murid | Selesai, deployed |
| 24 | Online Store | Selesai, deployed |
| 25 | Navbar + Gallery UX Fixes | Selesai, deployed |
| 26 | Kompres Gambar Store | Selesai, deployed |
| 27 | Like System Karya Murid | Selesai, deployed |
| 28 | Leaderboard | Selesai, deployed |
| 29 | Auto-generate Jadwal | Selesai, deployed (16 Mei) |
| 30 | Minat Gambar + Design System | Selesai, deployed (16 Mei) |
| 31 | Floating WA di Admin + Aturan Baru | Selesai, deployed (17 Mei) |

---

## Info Penting

| Item | Detail |
|------|--------|
| **No.Rek BLU BY BCA** | 001662116182 |
| **ShareModal** | Modal share IG, TikTok, FB, WA, Twitter/X, Copy Link |
| **Vertical Feed** | Lightbox scroll vertikal kayak IG — judul kiri, bagikan kanan |
| **Auto Akun** | Akun auto-create pas daftar, kredensial muncul setelah "Ya, Saya Sudah Transfer" |
| **MuridCards** | User ID + Password langsung tampil di kartu |
| **password_plain** | Disimpan di DB (hash + plain) buat display admin & user |
| **Store** | Katalog /store — grid produk, filter, modal detail, pilih ukuran/warna, WA order |
| **Proxy Image** | /api/produk/image/[...segments] — anti cache issue |
| **Design System** | Monochrome gray, Inter body+navbar, Playfair Display heading, no emoji |
| **Minat Gambar** | Dropdown wajib: Alam, Manusia, Hewan, Bangunan, Benda Solid |
| **Jadwal** | Auto-generate (monthly 4x, single 1x), filter kelas, toggle lewat |
| **Lokasi** | API default-location siap, UI skip (nunggu WA API) |
| **Floating WA** | Sembunyi otomatis di halaman admin (body:has(#admin-root)) |

---

## Riwayat Update Terakhir

| Tanggal | Yang Diubah |
|---------|-------------|
| 2026-05-17 | **Tahap 31** — Floating WA sembunyi di admin, Aturan baru (panggilan/larangan/workflow), Startup script dihapus. Commit `491b5fa`. PM2 ↺ 77. |
| 2026-05-16 | **Perbaikan Sore** — Hapus box WA daftar, Fix floating WA nutup modal store, Admin jadwal total rework, API lokasi default (skip UI), Docs audit 7 file, Cleanup 6 file sisa. PM2 ↺ 76. 37+ commit. |
| 2026-05-16 | **Tahap 29-30** — Auto-generate Jadwal, Check-in validasi, Investasi card, Monochrome gray, Minat Gambar dropdown, Design System. PM2 ↺ 69. |
| 2026-05-15 | **Tahap 24** — Online Store. PM2 ↺ 47. |
| 2026-05-15 | **Tahap 23** — Auto Akun Murid. PM2 ↺ 39. DB fresh. |
| 2026-05-15 | **Tahap 22** — Like + Reaction. |
| 2026-05-15 | Tahap 21 — Vertical Feed Lightbox. |
| 2026-05-15 | Tahap 20 — ShareModal + Native Share. |
| 2026-05-14 | No.Rek BLU BY BCA (001662116182). |
| 2026-05-11 | Navbar glass, Gallery lightbox, Flow daftar baru, Testimoni. |
| 2026-05-10 | Tahap 18a/b/c — Push, Telegram, WA Button. |
| 2026-05-10 | Tahap 17 — Syarat & Ketentuan. |
| 2026-05-10 | Tahap 16 — Deploy + Watermark + Galeri. |
