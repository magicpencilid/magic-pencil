# Magic Pencil — Project Cheat Sheet

> Satu halaman untuk lihat sekilas. Update tiap kali ada perubahan.

---

## 🖥️ APP

**Nama:** Magic Pencil
**Tujuan:** Web landing + pendaftaran + galeri karya lukis

---

## 🏗️ STACK

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | Next.js 14 (React) + Tailwind CSS |
| **Backend** | Next.js API Routes (server-side) |
| **DB** | SQLite (better-sqlite3) — `magic-pencil.db` |

---

## 🗂️ STRUKTUR

```
magic-pencil-app/
├── src/
│   ├── app/              ← Pages + API routes
│   ├── components/       ← UI components
│   └── lib/              ← DB, auth, helpers
├── public/
│   └── uploads/          ← User uploads (skip git)
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
| **Auth admin** | ✅ |
| **Auth murid** | ✅ |
| **Dashboard murid** | ✅ |
| **Pendaftaran** | ✅ |
| **Invoice + pembayaran** | ✅ |
| **Jadwal kelas** | ✅ |
| **Absensi** | ✅ |
| **Galeri karya murid** | ⏳ Siap deploy |
| **PWA + notifikasi push** | ✅ |

---

## 🔄 FLOW

```
User → Landing → Daftar → Invoice → Bayar
                          ↓
              Cek status / Konfirmasi bayar
                          ↓
              Login murid → Dashboard
                          ↓
              Jadwal | Absensi | Upload Karya

Admin → /admin/login → Dashboard
                     ↓
       Pendaftar | Murid | Pembayaran | Jadwal | Karya
```

---

## 🌐 DEPLOY (aaPanel)

| Item | Detail |
|------|--------|
| **Server IP** | `192.168.110.105` |
| **SSH** | `root@192.168.110.105` (key: `id_ed25519`) |
| **App path** | `/www/wwwroot/magic-pencil/` |
| **Panel** | aaPanel (user: ???, pass: ???) |
| **PM2** | `magic-pencil` → port 3000 → systemd auto-start |
| **Nginx** | Port 1051 → reverse proxy `127.0.0.1:3000` |
| **Domain** | `magicpencil.my.id` → Cloudflare Tunnel → port 1051 |
| **Cache Nginx** | `/www/server/nginx/proxy_cache_dir/` → **wajib clear tiap deploy** |

### Deploy steps
1. `npm run build` di lokal
2. SCP file ke server
3. `npm install` + `npm run build` di server
4. `pm2 restart magic-pencil`
5. `rm -rf /www/server/nginx/proxy_cache_dir/*`

---

## 💾 BACKUP

| Layer | Alat | Jadwal | Tujuan |
|-------|------|--------|--------|
| 🔄 Real-time | Watcher (PowerShell) | Tiap file berubah | E:\ + I:\ |
| 🔐 DB backup | `scripts/backup-db.js` | Tiap 6 jam + akhir sesi | E:\db + I:\db |
| 📸 Snapshot | `scripts/snapshot-backup.ps1` | Minggu 12:00 | E:\snapshot (4 minggu) |
| 🐙 Git | GitHub: magicpencilid/magic-pencil | Tiap selesai fitur | Cloud |

---

## 📝 NOTES

- Landing WA: `628111150563`
- Transfer: BLU BY BCA DIGITAL a.n D Willy Ardhany
- Font: Inter (body), Playfair Display (heading), Muli (navbar)
- Warna: Monochrome grey — hitam, putih, abu-abu

---

## 🎯 NEXT

- [ ] Deploy Tahap 16 (Galeri Karya) ke server
- [ ] Test galeri: upload → approve → publik
