# Magic Pencil - Project Cheat Sheet

> Satu halaman untuk lihat sekilas. Update tiap kali ada perubahan.

---

## 🖥️ APP

**Nama:** Magic Pencil
**Tujuan:** Web landing + pendaftaran + galeri karya murid + online store
**URL:** https://magicpencil.my.id

---

## 🏗️ STACK

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | Next.js 16.2.4 + React 19 + Tailwind CSS 4 |
| **Backend** | Next.js API Routes (server-side, 49 routes) |
| **DB** | SQLite (better-sqlite3) - `magic-pencil.db` |
| **Font** | Playfair Display (heading), Inter (body), Italiana |
| **Warna** | Monochrome grey - `--color-primary: #1a1a1a` |
| **Mata uang** | Rp (default) / "Investasi" di dashboard murid |

---

## 🗂️ STRUKTUR

```
magic-pencil-app/
├── src/
│   ├── app/              ← 26 pages + 49 API routes
│   ├── components/       ← 28 UI components
│   └── lib/              ← DB, auth, helpers
├── public/
│   └── uploads/          ← gallery/ + karya/ + pembayaran/ + produk/
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
| **Galeri Foto Owner (/koleksi)** | ✅ (Instagram grid, proxy API, admin upload, tab galeri+murid) |
| **Testimoni** | ✅ (no foto, no bintang, section beranda) |
| **ShareModal + Native Share** | ✅ (navigator.share HP / modal desktop) |
| **Vertical Feed Lightbox** | ✅ (scroll feed vertikal kayak IG) |
| **PWA + notifikasi push** | ✅ |
| **Telegram Bot** | ✅ (@magicpencil_notif_bot) |
| **WA floating button** | ✅ (wa.me/628111150563) |
| **Like + Reaction** | ✅ (gallery_likes + karya_likes, fingerprint-based) |
| **Auto Akun Murid** | ✅ (auto-create pas daftar, kredensial stlh bayar) |
| **Online Store** | ✅ (katalog /store, admin CRUD, upload+kompres) |
| **Leaderboard** | ✅ (top 10 karya populer di halaman depan) |
| **Dashboard murid** | ✅ (jadwal, absensi, karya) |
| **Dashboard admin** | ✅ (10 sub: Dashboard, Murid, Pendaftar, Kelas, Jadwal+Opsi, Absensi, Karya, Galeri Foto, Testimoni, Pembayaran) |

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

- [ ] Upgrade Store — Multi Gambar + Slider
- [ ] Bundle "Kelas + Merch" pas daftar
- [ ] Komentar per Karya Murid
