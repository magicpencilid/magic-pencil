# Project Status — Magic Pencil

> Status terkini project. Update tiap selesai kerja.

---

## Ringkasan

| Item | Status |
|------|--------|
| **Tahap Terakhir** | 30 — Minat Gambar + Design System ✅ |
| **Versi Terdeploy** | ✅ 16 Mei 2026 — Minat Gambar (PM2 ↺ 69) |
| **Status Server** | ✅ PM2 online |
| **DB** | SQLite — `magic-pencil.db` (fresh, 0 pendaftar, 2 produk) |
| **Repo** | GitHub: `magicpencilid/magic-pencil` |

---

## Deploy Status

| Lokasi | Status | Catatan |
|--------|--------|---------|
| Lokal (laptop) | ✅ Ready | Build siap |
| Server (aaPanel) | ✅ Running | Terkini (16 Mei) — 28+ commit, PM2 ↺ 69 |

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
| 22 | Like + Reaction (❤️, gallery_likes, fingerprint) | 15 Mei |
| 23 | Auto Akun Murid (create pas daftar, kredensial setelah bayar, password di kartu murid) | 15 Mei |
| **24** | **Online Store** (katalog `/store`, order WA, admin CRUD, upload gambar, beli merch di gallery) | **15 Mei** |
| **29** | **Auto-generate Jadwal** (monthly=4x, single=1x, meeting_number, tanggal real) | **16 Mei** |

### Fitur Kecil (tanpa nomor tahap)
| Fitur | Tanggal |
|-------|---------|
| Navbar white glass + font Inter + mobile dropdown | 11 Mei |
| Gallery lightbox (click-to-zoom) | 11 Mei |
| Flow daftar baru (form → syket → setuju/tidak) | 11 Mei |
| Standar gambar default (watermark, script, docs) | 11 Mei |
| No.Rek BLU BY BCA DIGITAL (001662116182) | 14 Mei |

---

## Data Server *(per 15 Mei 2026 — DB fresh)*

| Item | Jumlah |
|------|--------|
| Kelas | 7 |
| Pendaftar | **0** (fresh start setelah Tahap 23) |
| Aktif | 0 |
| Karya | 0 |
| Absensi | 0 |
| Invoice | 0 |
| Uploads | 3.3MB (gambar background, watermark, 2 foto produk) |

---

## Progress Tahap

| Tahap | Fitur | Status |
|-------|-------|--------|
| 23 | Auto Akun Murid | ✅ Selesai, deployed |
| **24** | **Online Store** (katalog, order WA, admin CRUD, upload + proxy image) | **✅ Selesai, deployed** |
| **29** | **Auto-generate Jadwal** (monthly=4x, single=1x, meeting_number, tanggal real) | **✅ Selesai, deployed (16 Mei)** |
| **30** | **Minat Gambar + Design System** (monochrome gray, footer admin, minat dropdown) | **✅ Selesai, deployed (16 Mei)** |
| ~~25-27~~ | ~~Testimoni Full, Events, Payment, Dashboard~~ | ⏸️ Skip — nunggu WA API |

---

## Info Penting

| Item | Detail |
|------|--------|
| **No.Rek BLU BY BCA** | 001662116182 (14 Mei 2026) |
| **ShareModal** | Modal share IG, TikTok, FB, WA, Twitter/X, Copy Link |
| **Vertical Feed** | Lightbox scroll vertikal kayak IG — judul kiri, bagikan kanan |
| **Auto Akun** | Akun auto-create pas daftar, kredensial muncul setelah "Ya, Saya Sudah Transfer" |
| **MuridCards** | User ID + Password langsung tampil di kartu (gak ada tombol reset) |
| **password_plain** | Disimpan di DB (hash + plain) buat display admin & user |
| **Store** | Katalog `/store` — grid produk, filter, modal detail, pilih ukuran/warna, WA order |
| **Proxy Image** | `/api/produk/image/[...segments]` — anti cache issue, gak perlu restart PM2 |
| **Beli Merch** | Tombol 🛍️ di Gallery lightbox → WA langsung |

---

## Riwayat Update Terakhir

| Tanggal | Yang Diubah |
|---------|-------------|
| 2026-05-16 | **Tahap 29-30** — Auto-generate Jadwal ✅, Check-in validasi ✅, Investasi card ✅, Riwayat investasi ✅, Monochrome gray all pages ✅, Minat Gambar dropdown ✅, Design System rules ✅. PM2 ↺ 69. 28+ commit. |
| 2026-05-15 | **Tahap 24** — Online Store (katalog, order WA, admin CRUD, upload gambar, proxy API, beli merch, fitur warna). PM2 ↺ 47. |
| 2026-05-15 | **Tahap 23** — Auto Akun Murid (8 commit, ↺ 39). DB fresh (0 pendaftar). |
| 2026-05-15 | **Tahap 22** — Like + Reaction (gallery_likes, fingerprint) |
| 2026-05-15 | Tahap 21 — Vertical Feed Lightbox (scroll feed, layout judul+bagikan) |
| 2026-05-15 | Tahap 20 — ShareModal + Native Share fallback + Istilah Investasi |
| 2026-05-14 | No.Rek BLU BY BCA (001662116182) — 3 file component + docs + deploy |
| 2026-05-11 | Navbar glass, Gallery lightbox, Flow daftar baru, Standar gambar, Testimoni + Optimasi |
| 2026-05-10 | Tahap 18a/b/c — Push, Telegram, WA Button |
| 2026-05-10 | Tahap 17 — Syarat & Ketentuan |
| 2026-05-10 | Tahap 16 — Deploy + Watermark + Galeri |
