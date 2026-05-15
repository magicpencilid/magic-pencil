# Magic Pencil - Project Cheat Sheet

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
| **Backend** | Next.js API Routes (server-side, 46 routes) |
| **DB** | SQLite (better-sqlite3) - `magic-pencil.db` |
| **Font** | Playfair Display (heading), Inter (body), Italiana |
| **Warna** | Monochrome grey - `--color-primary: #1a1a1a` |
| **Mata uang** | "Investasi" (bukan "Rp") |

---

## 🗂️ STRUKTUR

```
magic-pencil-app/
├── src/
│   ├── app/              ← 26 pages + 46 API routes
│   ├── components/       ← 27 UI components
│   └── lib/              ← DB, auth, helpers
├── public/
│   └── uploads/          ← bukti-bayar/ + karya/
├── docs/                 ← Dokumentasi
├── scripts/              ← Utility (watermark, process image, dll)
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
| **Watermark otomatis (jimp)** | ✅ (max 1000px, 65%, multiply blend pixel-level) |
| **Galeri Foto Owner (/gallery)** | ✅ (Instagram grid, proxy API, admin upload) |
| **Testimoni** | ✅ (no foto, no bintang, section beranda) |
| **Online Store** | ✅ (katalog `/store`, order WA, admin CRUD, upload gambar, proxy API, beli merch di gallery) |
| **Auto Akun Murid** | ✅ (auto-create pas daftar, kredensial setelah bayar, password di kartu murid) |
| **ShareModal + Native Share** | ✅ (navigator.share HP / modal desktop) |
| **Vertical Feed Lightbox** | ✅ (scroll feed kayak IG, ganti prev/next) |
| **Like + Reaction** | ✅ (❤️ gallery_likes, fingerprint-based) |
| **PWA + notifikasi push** | ✅ |
| **Telegram Bot** | ✅ (@magicpencil_notif_bot) |
| **WA floating button** | ✅ (wa.me/628111150563) |
| **Dashboard murid** | ✅ (jadwal, absensi, karya) |
| **Dashboard admin** | ✅ (11 sub: Dashboard, Murid, Pendaftar, Kelas, Hari&Jam, Jadwal, Absensi, Karya, Galeri Foto, **Produk**, Testimoni, Pembayaran) |

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
  Pendaftar | Murid | Kelas | Jadwal | Absensi | Pembayaran | Karya | Produk

Pelanggan → `/store` → Lihat produk → Pilih ukuran/warna/jumlah →
             Isi form (nama, WA) → Klik Pesan WA → wa.me/628111150563
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

### Deploy normal (GitHub jalan)
1. `npm run build` di lokal
2. Git commit + push
3. Server: `git pull` + `npm install` + `npm run build`
4. `pm2 restart magic-pencil`

### Deploy fallback (GitHub 503)
1. `npm run build` di lokal
2. `tar czf - .next/ | ssh root@192.168.110.105 "tar xzf - -C /www/wwwroot/magic-pencil/"`
3. `npm install` (kalo ada package baru)
4. `pm2 restart magic-pencil`

> Server CPU KVM tua: build di lokal, kirim `.next/` aja ke server

---

## 💾 BACKUP (Manual via update mat)

| Step | Perintah | Tujuan |
|------|----------|--------|
| 1. Git | `git push` | GitHub: magicpencilid/magic-pencil |
| 2. Docs | Sync 2 path | workspace + Pencil Web/docs |
| 3. DB | Copy file | `E:\backup_manual\db_manual\` |

---

## 📝 NOTES

- **Transfer:** BLU BY BCA DIGITAL a.n D Willy Ardhany (No.Rek: 001662116182)
- **Telegram Bot:** @magicpencil_notif_bot
- **Admin password:** `Pencil@dmin`
- **Server CPU:** KVM tua - gak support `sharp`, pake `jimp`
- **Next.js 16:** route handler `params` wajib di-await

---

## 🎯 NEXT

- [x] Tahap 22 - Like + Reaction
- [x] Tahap 23 - Auto Akun Murid
- [x] **Tahap 24 - Online Store** (katalog, order WA, admin CRUD, upload + proxy image) ✅
- [ ] ~~Testimoni Full, Events, Payment, Dashboard~~ — skip, nunggu WA API
