# Magic Pencil — Project Cheat Sheet

> Satu halaman untuk lihat sekilas. Update tiap kali ada perubahan.

---

## APP

**Nama:** Magic Pencil
**Tujuan:** Web landing + pendaftaran + galeri karya lukis + online store
**URL:** https://magicpencil.my.id

---

## STACK

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | Next.js 16.2.4 + React 19 + Tailwind CSS 4 |
| **Backend** | Next.js API Routes (server-side) |
| **DB** | SQLite (better-sqlite3) — `magic-pencil.db` |
| **Font** | Inter (body & navbar), Playfair Display (heading), Italiana (dekoratif) |
| **Warna** | Monochrome gray — `--color-primary: #1a1a1a` |
| **Design System** | Semua gray, gak pake emoji, Lucide Icons wajib |

---

## STRUKTUR

```
magic-pencil-app/
├── src/
│   ├── app/              ← pages + API routes
│   ├── components/       ← UI components
│   └── lib/              ← DB, auth, helpers
├── public/
│   └── uploads/          ← bukti-bayar/ + karya/ + produk/
├── docs/                 ← Dokumentasi
├── scripts/              ← Utility (watermark, process image, dll)
├── magic-pencil.db       ← Database
├── .env.local            ← Secrets (skip git)
├── package.json
└── .gitignore
```

---

## FEATURES

| Fitur | Status |
|-------|--------|
| Auth admin + murid | Selesai |
| Pendaftaran + Syket | Selesai |
| Invoice + pembayaran | Selesai |
| Auto-generate Jadwal (monthly=4x, single=1x) | Selesai |
| Check-in validation (cek jadwal dulu) | Selesai |
| Absensi check-in/out | Selesai |
| Galeri karya murid (upload + approve + publik) | Selesai |
| Watermark otomatis (jimp, max 1000px, 65%, multiply) | Selesai |
| Galeri Foto Owner (/koleksi) | Selesai |
| Testimoni (no foto, no bintang) | Selesai |
| ShareModal + Native Share | Selesai |
| Vertical Feed Lightbox (scroll feed kayak IG) | Selesai |
| Like + Reaction (2 tabel: gallery_likes + karya_likes, fingerprint) | Selesai |
| Auto Akun Murid (create pas daftar, kredensial setelah bayar) | Selesai |
| Online Store (katalog, order WA, admin CRUD, proxy image) | Selesai |
| Kompres Gambar Store (Jimp resize 800px, JPEG 80%) | Selesai |
| Leaderboard (top 10 approved, badge peringkat) | Selesai |
| Box Investasi klikable + Riwayat Invoice | Selesai |
| Minat Gambar dropdown (form daftar, wajib) | Selesai |
| Admin jadwal rework (filter kelas, filter lewat, hapus +Tambah) | Selesai |
| Lokasi kelas (API + auto-fill, skip UI nunggu WA API) | Selesai |
| Floating WA sembunyi di admin (CSS :has selector) | Selesai |
| Galeri Sketsa dinamis dari DB (show_on_homepage, limit 6) | Selesai |
| 1 Button Beranda Toggle (admin, dark/light state, bg-accent) | Selesai |
| Telegram Bot (@magicpencil_notif_bot) | Selesai |
| WA floating button (wa.me/628111150563) | Selesai |
| Dashboard murid (jadwal, absensi, karya, investasi) | Selesai |
| Dashboard admin (11 sub menu) | Selesai |

---

## FLOW

```
User -> Landing -> Daftar (isi form + minat gambar) -> Syket -> Invoice -> Bayar
                                                              |
                                               Cek status / Konfirmasi
                                                              |
                                               Login murid -> Dashboard (jadwal, absensi, karya, investasi)

Admin -> Login -> Dashboard
              |
  Pendaftar | Murid (lihat minat gambar) | Kelas | Hari&Jam | Jadwal | Absensi | Karya | Pembayaran | Produk | Testimoni

Pelanggan -> /store -> Pilih produk + ukuran/warna -> Isi nama & WA -> Pesan WA
```

---

## DEPLOY (aaPanel)

| Item | Detail |
|------|--------|
| **Server IP** | `192.168.110.105` |
| **SSH** | `root@192.168.110.105` |
| **App path** | `/www/wwwroot/magic-pencil/` |
| **Panel** | aaPanel port 1050 |
| **PM2** | `magic-pencil` -> port 3000 -> online |
| **Domain** | Cloudflare Tunnel -> aaPanel:1050 -> localhost:3000 |
| **Node** | v22.22.2 |

### Deploy normal (GitHub jalan)
1. `npm run build` engine: `next build` (Turbopack, ~10 detik)
2. Git commit + push
3. Server: `git pull` + `rm -rf .next` + `npm run build`
4. `pm2 restart magic-pencil`

### Deploy fallback (GitHub 503)
1. `npm run build` di lokal
2. `tar czf - .next/ | ssh root@192.168.110.105 "tar xzf - -C /www/wwwroot/magic-pencil/"`
3. `npm install` (kalo ada package baru)
4. `pm2 restart magic-pencil`

### Catatan Deploy
- **Jangan pake zip** — file .next/build/package.json bisa nimpa package.json asli
- **Kalo source code ada di server**, build langsung di server lebih reliable (hindari cross-platform native module issue)
- **Better-sqlite3**: hash native module beda antara Windows build dan Linux runtime
- **Server CPU KVM tua** — gak support `sharp`, pake `jimp`

---

## BACKUP (Manual via update mat)

| Step | Perintah | Tujuan |
|------|----------|--------|
| 1. Git | `git push` | GitHub: magicpencilid/magic-pencil |
| 2. Docs | Sync 2 path | workspace + Pencil Web/docs |
| 3. DB | Copy file | `E:\backup_manual\db_manual\` |

---

## NOTES

- **Transfer:** BLU BY BCA DIGITAL a.n D Willy Ardhany (No.Rek: 001662116182)
- **Telegram Bot:** @magicpencil_notif_bot
- **Admin password:** `Pencil@dmin`
- **Server CPU:** KVM tua — gak support `sharp`, pake `jimp`
- **Next.js 16:** route handler `params` wajib di-await
- **Design System:** monochrome gray (Inter body, Playfair Display heading, Lucide Icons, gak pake emoji)
- **Minat Gambar:** dropdown wajib di form daftar (Alam, Manusia, Hewan, Bangunan, Benda Solid)
- **Floating WA:** sembunyi otomatis di admin via `body:has(#admin-root) #wa-wrap`
- **Galeri Sketsa:** dinamis dari gallery_photos, admin 1 button Beranda toggle (dark/light state, bg-accent), limit 6, no lightbox

---

## NEXT

- [x] Tahap 22 — Like + Reaction
- [x] Tahap 23 — Auto Akun Murid
- [x] Tahap 24 — Online Store
- [x] Tahap 25-28 — Navbar UX, Kompres, Like Karya, Leaderboard
- [x] Tahap 29 — Auto-generate Jadwal
- [x] Tahap 30 — Minat Gambar + Design System
- [x] Tahap 31 — Floating WA di Admin + Aturan Baru
- [x] Tahap 32 — Galeri Sketsa Dinamis + Limit 6 Beranda
- [ ] WA API integration (notifikasi ke WA ganti web push + lokasi kelas + jadwal) — ✅ NIB jadi, Meta Business besok, nomor baru siap, domain siap
