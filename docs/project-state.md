# Project Status — Magic Pencil

> Status terkini project. Update tiap selesai kerja.

---

## Ringkasan

| Item | Status |
|------|--------|
| **Tahap Terakhir** | 28 — Leaderboard Karya Populer |
| **Versi Terdeploy** | ✅ 15 Mei 2026 — Leaderboard Karya Populer |
| **Status Server** | ✅ PM2 online |
| **DB** | SQLite — `magic-pencil.db` |
| **Repo** | GitHub: `magicpencilid/magic-pencil` |

---

## Deploy Status

| Lokasi | Status | Versi | Catatan |
|--------|--------|-------|---------|
| Lokal (laptop) | ✅ Ready | Tahap 28 | Build siap |
| Server (aaPanel) | ✅ Running | Terkini (15 Mei) | Tahap 28 — Leaderboard Karya Populer |

---

## Fitur Terdeploy

| Tahap | Fitur | Tanggal |
|-------|-------|---------|
| — | Navbar white glass + font Inter + mobile dropdown minimal | 11 Mei |
| — | *direplaced oleh Tahap 21* | —
| — | Flow daftar baru (form → syket → setuju/tidak) | 11 Mei |
| — | Standar gambar default (watermark, script, docs) + Slide #4 baru | 11 Mei |
| 16 | Upload Karya + Galeri Publik + Watermark (jimp) | 10 Mei |
| 17 | Syarat & Ketentuan + checkbox daftar | 10 Mei |
| 18a | Push Notification (register, invoice, pembayaran) | 10 Mei |
| 18b | Telegram Bot (@magicpencil_notif_bot) | 10 Mei |
| 18c | WhatsApp Floating Button (wa.me/628111150563) | 10 Mei |
| 19 | Testimoni (simplified: no foto, no bintang) | 12 Mei |
| 20 | Share ke Medsos (ShareModal + Native Share) | 15 Mei |
| 21 | Vertical Feed Lightbox (Instagram-style) | 15 Mei |
| 22 | Like + Reaction (gallery_photos, fingerprint-based) | 15 Mei |
| 23 | Auto Akun Murid (auto-create pas daftar, kredensial stlh bayar) | 15 Mei |
| 24 | Online Store (katalog /store, admin CRUD, upload gambar, proxy API) | 15 Mei |
| 25 | Navbar Toko + Beli Merch button + Rename /gallery→/koleksi | 15 Mei |
| 26 | Kompres Gambar Store (1.3MB→27KB, 2MB→36KB, auto-kompres upload) | 15 Mei |
| 27 | Like System Karya Murid (tabel karya_likes, count ❤️ selalu tampil) | 15 Mei |
| 28 | Leaderboard Karya Populer (top 10, badge peringkat #1🏆) | 15 Mei |

---

## Data Server *(15 Mei 2026)*

| Item | Jumlah |
|------|--------|
| Kelas | 6 |
| Pendaftar | 0 (fresh 15 Mei) |
| Aktif | 0 |
| Karya | 0 |
| Absensi | 0 |
| Invoice | 0 |
| Jadwal | 0 |
| Uploads | 68KB (kompres) |

---

## Known Issues / Pending

| # | Issue | Prioritas | Status |
|---|-------|-----------|--------|
| 1 | Upgrade Store — Multi Gambar + Slider | Tinggi | 🟡 Next Plan |
| 2 | Bundle "Kelas + Merch" pas daftar | Sedang | 🔵 Rencana |
| 3 | Komentar per Karya Murid | Rendah | 🔵 Rencana |

---

## Info Penting

| Item | Detail |
|------|--------|
| **No.Rek BLU BY BCA** | 001662116182 (14 Mei 2026) |
| **ShareModal** | Modal share IG, TikTok, FB, WA, Twitter/X, Copy Link |
| **Vertical Feed** | Lightbox scroll vertikal kayak IG — judul overlay kiri atas + action bar bawah |
| **Like System** | 2 tabel: `gallery_likes` (foto studio) + `karya_likes` (karya murid), fingerprint-based |
| **Leaderboard** | Top 10 karya murid terpopuler di halaman depan |
| **Store Images** | Auto-kompres JPEG quality 80, resize 800px di upload API |

---

## Riwayat Update Terakhir

| Tanggal | Yang Diubah |
|---------|-------------|
| 2026-05-15 | Tahap 20-28 — ShareModal, Lightbox vertikal, Like, Auto Akun, Store, Leaderboard |
| 2026-05-14 | No.Rek BLU BY BCA (001662116182) — 3 file component + docs + deploy
| 2026-05-11 | Navbar glass + font Inter, Gallery lightbox, Flow daftar baru, Standar gambar + Slide #4, Galeri Foto + Watermark + Upload Fixes, Testimoni + Optimasi |
| 2026-05-10 | Tahap 18a/b/c — Push, Telegram, WA Button, Mobile Menu |
| 2026-05-10 | Tahap 17 — Syarat & Ketentuan |
| 2026-05-10 | Tahap 16 — Deploy + Watermark + Galeri |
| 2026-05-10 | WP Config & Cheat Sheet + State |
| 2026-05-09 | Backup Restruktur |
| 2026-05-08 | Setup Git + Docs |
