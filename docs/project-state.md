# Project Status — Magic Pencil

> Status terkini project. Update tiap selesai kerja.

---

## Ringkasan

| Item | Status |
|------|--------|
| **Tahap Terakhir** | 18c + Galeri Foto + Watermark + Testimoni + Optimasi |
| **Versi Terdeploy** | ✅ 11 Mei 2026 — 60 routes, 11 pages |
| **Status Server** | ✅ PM2 online |
| **DB** | SQLite — `magic-pencil.db` |
| **Repo** | GitHub: `magicpencilid/magic-pencil` |

---

## Backup Infrastructure (10 Mei 2026)

| Layer | Alat | Jadwal |
|-------|------|--------|
| 🔄 **Real-time sync** | Watcher (PowerShell) | Tiap file berubah |
| 🔐 **DB backup** | `scripts/backup-db.js` | Tiap 6 jam + akhir sesi |
| 📸 **Snapshot mingguan** | `scripts/snapshot-backup.ps1` | Minggu 12:00 (retensi 4 minggu) |
| 🐙 **Git (GitHub)** | Remote: magicpencilid/magic-pencil | Tiap selesai fitur |

**Struktur backup:**
```
E:\backup_mamat\
├── obsidian/
├── magic_pencil/
│   ├── openclaw/
│   ├── webui/
│   ├── db/               ← DB backup timestamped (retensi 30 hari)
│   └── snapshot/         ← Snapshot folder (retensi 4 minggu)
I:\My Drive\backup_mamat\
└── (struktur sama)
```

---

## Deploy Status

| Lokasi | Status | Versi | Catatan |
|--------|--------|-------|---------|
| Lokal (laptop) | ✅ Ready | Tahap 18 | Build siap |
| Server (aaPanel) | ✅ Running | Tahap 18 (10 Mei 2026) | 53 routes, 9 pages |

---

## Fitur Terdeploy

| Tahap | Fitur | Tanggal |
|-------|-------|---------|
| — | Navbar white glass + font Inter + mobile dropdown minimal | 11 Mei |
| — | Gallery lightbox (click-to-zoom) | 11 Mei |
| — | Flow daftar baru (form → syket → setuju/tidak) | 11 Mei |
| — | Standar gambar default (watermark, script, docs) + Slide #4 baru | 11 Mei |
| 16 | Upload Karya + Galeri Publik + Watermark (jimp) | 10 Mei |
| 17 | Syarat & Ketentuan + checkbox daftar | 10 Mei |
| 18a | Push Notification (register, invoice, pembayaran) | 10 Mei |
| 18b | Telegram Bot (@magicpencil_notif_bot) | 10 Mei |
| 18c | WhatsApp Floating Button (wa.me/628111150563) | 10 Mei |

---

## Data Server

| Item | Jumlah |
|------|--------|
| Kelas | 6 |
| Pendaftar | 11 |
| Aktif | 3 |
| Karya | 1 |
| Absensi | 1 |
| Invoice | 11 |
| Jadwal | 7 |
| Uploads | 2.2MB |

---

## Known Issues / Pending

| # | Issue | Prioritas | Status |
|---|-------|-----------|--------|
| 1 | Tahap 18d — Mobile Class Events | Sedang | ⏸️ Hold (nunggu WA) |
| 2 | Tahap 19 — Testimoni Landing | Sedang | 🔵 Planning (hold karena navbar/gallery/flow) |
| 3 | Tahap 20 — Payment Gateway | Sedang | ⚪ Ide |
| 4 | Tahap 21 — Progress Dashboard | Rendah | ⚪ Ide |

---

## Riwayat Update Terakhir

| Tanggal | Yang Diubah |
|---------|-------------|
| 2026-05-12 | Testimoni simplified (no foto, no bintang), force-dynamic, auto akun rencana |
| 2026-05-11 | Navbar glass + font Inter, Gallery lightbox, Flow daftar baru, Standar gambar + Slide #4, Galeri Foto + Watermark + Upload Fixes, Testimoni + Optimasi |
| 2026-05-10 | Tahap 18a/b/c — Push, Telegram, WA Button, Mobile Menu |
| 2026-05-10 | Tahap 17 — Syarat & Ketentuan |
| 2026-05-10 | Tahap 16 — Deploy + Watermark + Galeri |
| 2026-05-10 | WP Config & Cheat Sheet + State |
| 2026-05-09 | Backup Restruktur + Watcher |
| 2026-05-08 | Setup Git + Docs |
