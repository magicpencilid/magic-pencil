# Project Status — Magic Pencil

> Status terkini project. Update tiap selesai kerja.

---

## Ringkasan

| Item | Status |
|------|--------|
| **Tahap Terakhir** | 16 — Galeri Karya Murid |
| **Versi Terdeploy** | — (belum di-deploy ke server) |
| **Status Server** | ✅ Running (Tahap 15) |
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
├── obsidian/                   ← Watcher mirror
├── magic_pencil/
│   ├── openclaw/               ← Watcher mirror
│   ├── webui/                  ← Watcher mirror (skip node_modules, .next, uploads, .env)
│   ├── db/                     ← DB backup timestamped (retensi 30 hari)
│   └── snapshot/               ← Snapshot folder (retensi 4 minggu)
└── snapshot/
    └── YYYY-MM-DD/             ← Snapshot per minggu

---

## Deploy Status

| Lokasi | Status | Versi | Catatan |
|--------|--------|-------|---------|
| Lokal (laptop) | ✅ Ready | Tahap 15b + 16 | Build siap |
| Server (aaPanel) | ✅ Running | Tahap 15 | Belum diupdate ke 16 |

---

## Known Issues / Pending

| # | Issue | Prioritas | Status |
|---|-------|-----------|--------|
| 1 | Deploy Tahap 16 ke server (Galeri) | Tinggi | ⏳ Pending |
| 2 | Testing fitur Galeri (upload → approve → tampil publik) | Tinggi | ⏳ Pending |
| 3 | Watermark kecil di upload karya (opsional) | Rendah | 📝 Catatan |
| - | Integrasi WA/Email notifikasi | Rendah | 📝 Butuh API pihak ketiga |

---

## Riwayat Update Terakhir

| Tanggal | Yang Diubah |
|---------|-------------|
| 2026-05-08 | Setup Git (init, 137 files) |
| 2026-05-08 | project-brief.md + docs selesai |
| 2026-05-08 | Restruktur backup (3 lapis) |
