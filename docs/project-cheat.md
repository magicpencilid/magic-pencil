# Magic Pencil — Project Cheat Sheet

> Satu halaman untuk lihat sekilas. Update tiap kali ada perubahan.

---

## 🖥️ APP

**Nama:** Magic Pencil
**Tujuan:** Web landing + pendaftaran + galeri karya lukis
**URL:** https://magicpencil.my.id

---

## 🏗️ STACK

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | Next.js 16.2.4 + React 19 + Tailwind CSS 4 |
| **Backend** | Next.js API Routes (server-side, 34 routes) |
| **DB** | SQLite (better-sqlite3) — `magic-pencil.db` |
| **Font** | Playfair Display (heading), Inter (body), Italiana |
| **Warna** | Monochrome grey — `--color-primary: #1a1a1a` |
| **Mata uang** | "Investasi" (bukan "Rp") |

---

## 🗂️ STRUKTUR

```
magic-pencil-app/
├── src/
│   ├── app/              ← 9 pages + 34 API routes
│   ├── components/       ← 25 UI components
│   └── lib/              ← DB, auth, helpers
├── public/
│   └── uploads/          ← bukti-bayar/ + karya/
├── docs/                 ← Dokumentasi
├── scripts/              ← Backup utilities
├── magic-pencil.db       ← Database
├── .env.local            ← Secrets (skip git)
├── package.json
└── .gitignore
```

---

## ✅ FEATURES

| Fitur | Status |
|-------|--------|
| **Auth admin + murid** | ✅ |
| **Pendaftaran + Syket** | ✅ |
| **Invoice + pembayaran** | ✅ |
| **Jadwal kelas** | ✅ |
| **Absensi check-in/out** | ✅ |
| **Galeri karya murid** | ✅ (upload + approve + publik) |
| **Watermark otomatis (jimp)** | ✅ (max 1000px, 65%) |
| **PWA + notifikasi push** | ✅ |
| **Telegram Bot** | ✅ (@magicpencil_notif_bot) |
| **WA floating button** | ✅ (wa.me/628111150563) |
| **Dashboard murid** | ✅ (jadwal, absensi, karya) |
| **Dashboard admin** | ✅ (9 sub-halaman) |

---

## 🔄 FLOW

```
User → Landing → Daftar + setuju Syket → Invoice → Bayar
                                             ↓
                                  Cek status / Konfirmasi
                                             ↓
                                  Login murid → Dashboard
                                             ↓
                                   Jadwal | Absensi | Upload Karya

Admin → Login → Dashboard
              ↓
  Pendaftar | Murid | Kelas | Jadwal | Absensi | Pembayaran | Karya
```

---

## 🌐 DEPLOY (aaPanel)

| Item | Detail |
|------|--------|
| **Server IP** | `192.168.110.105` |
| **SSH** | `root@192.168.110.105` |
| **App path** | `/www/wwwroot/magic-pencil/` |
| **Panel** | aaPanel port 1050 |
| **PM2** | `magic-pencil` → port 3000 → online |
| **Domain** | Cloudflare Tunnel → aaPanel:1050 → localhost:3000 |
| **Node** | v22.22.2 |

### Deploy steps
1. `npm run build` di lokal
2. Git commit + push
3. Server: `git pull` + `npm install` + `npm run build`
4. `pm2 restart magic-pencil`
5. Clear aaPanel proxy cache

---

## 💾 BACKUP

| Layer | Alat | Jadwal | Tujuan |
|-------|------|--------|--------|
| 🔄 Real-time | Watcher (PowerShell) | Tiap file berubah | E:\ + I:\ |
| 🔐 DB | `scripts/backup-db.js` | Tiap 6 jam | E:\db + I:\db |
| 📸 Snapshot | `scripts/snapshot-backup.ps1` | Minggu 12:00 | 4 minggu retensi |
| 🐙 Git | GitHub: magicpencilid/magic-pencil | Tiap fitur | Cloud |

---

## 📝 NOTES

- **Transfer:** BLU BY BCA DIGITAL a.n D Willy Ardhany
- **Telegram Bot:** @magicpencil_notif_bot
- **Admin password:** `Pencil@dmin`
- **Server CPU:** KVM tua — gak support `sharp`, pake `jimp`
- **Next.js 16:** route handler `params` wajib di-await

---

## 🎯 NEXT

- [ ] Tahap 19 — Testimoni landing page
- [ ] Tahap 20 — Payment Gateway
- [ ] Tahap 21 — Progress Dashboard
- [ ] Tahap 18d — Mobile Class Events (hold — nunggu WA)
