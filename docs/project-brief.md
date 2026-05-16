# 📘 Project Brief — Magic Pencil

> File ini pegangan utama mamat. Update tiap kali ada perubahan besar.
> Dibuat: 2026-05-08 | Update terakhir: 2026-05-15

---

## 1. Identitas Project

| Item | Detail |
|------|--------|
| **Nama** | Magic Pencil |
| **Domain** | `magicpencil.my.id` ✅ |
| **Tema** | Monochrome modern grey — hitam, putih, abu-abu |
| **Font** | Inter (body), Playfair Display (heading), Italiana |
| **Warna** | `--color-primary: #1a1a1a`, `--color-accent: #666`, `--color-accent-dark: #444` |
| **Mata uang** | "Investasi" (bukan "Rp") |
| **WA nomor** | `628111150563` |
| **Transfer** | BLU BY BCA DIGITAL a.n D Willy Ardhany (No.Rek: 001662116182) |
| **Telegram** | @magicpencil_notif_bot |

---

## 2. Lokasi File

### Lokal (laptop Willy)
```
C:\Users\willy\DW Works\Magicpencil\Pencil Web\magic-pencil-app\
├── src/
│   ├── app/              ← Pages + API routes
│   ├── components/       ← UI components
│   └── lib/              ← Database, auth, helpers
├── public/uploads/       ← bukti-bayar/ + karya/
├── docs/                 ← Dokumentasi
├── scripts/              ← Utility scripts
├── magic-pencil.db       ← Database SQLite
├── package.json
└── .env.local
```

### Server (192.168.110.105)
```
/www/wwwroot/magic-pencil/
├── .next/                ← Build output
├── public/uploads/       ← Uploaded files (3.3MB)
├── magic-pencil.db       ← Database (live)
├── package.json
└── .env.local
```

---

## 3. Server & Deployment

| Item | Detail |
|------|--------|
| **Server** | VPS Proxmox, Debian 12 |
| **IP** | `192.168.110.105` |
| **SSH** | `root@192.168.110.105` |
| **Panel** | aaPanel port 1050 |
| **Node.js** | v22.22.2 |
| **PM2** | `magic-pencil` — port 3000 — auto-start via systemd |
| **Domain** | Cloudflare Tunnel → aaPanel:1050 → localhost:3000 |
| **Admin login** | `/admin` — password: `Pencil@dmin` |

### Deploy steps
1. `npm run build` di lokal
2. `git add . && git commit -m "..." && git push`
3. Server: `git pull` + `npm install` + `npm run build`
4. `pm2 restart magic-pencil`
5. Clear aaPanel proxy cache (kalo perlu)

---

## 4. Database — SQLite (`magic-pencil.db`)

### Tabel
| Tabel | Fungsi |
|-------|--------|
| `pendaftar` | Data pendaftaran (name, WA, kelas, status, agree_terms) |
| `jadwal` | Jadwal kelas per pendaftar |
| `invoice` | Invoice auto-generated |
| `pembayaran` | Konfirmasi bayar upload |
| `kelas` | Daftar kelas + harga (7 kelas) |
| `schedule_config` | Hari & jam yang tersedia |
| `notifikasi` | Log notifikasi terkirim |
| `akun_murid` | Akun login murid + password_plain |
| `absensi` | Check-in/out per murid |
| `push_subscriptions` | Subscriber PWA |
| `karya_murid` | Upload karya (watermark otomatis) |
| `gallery_photos` | Galeri foto owner (admin upload) |
| `gallery_likes` | Like foto gallery (fingerprint-based) |
| `testimonials` | Testimoni (nama + teks) |
| `produk` | Online store merchandise |
| `karya_likes` | Like karya murid (fingerprint-based) |

### Data (per 15 Mei)
- Kelas: 7 | Pendaftar: 0 (fresh start) | Aktif: 0
- DB dibersihin setelah Tahap 23 selesai

---

## 5. Aliran Data

### Status Pendaftar
`baru` → `menunggu respon` → `terdaftar` → `selesai` / `batal`

### Status Karya
`private` → `pending` (kalo publik) → `approved` / `rejected`

---

## 6. Fitur Terkini

| Fitur | Status | Catatan |
|-------|--------|---------|
| Landing page | ✅ | Hero + galeri sketsa owner |
| Pendaftaran + Syket | ✅ | Wajib setuju syarat & ketentuan |
| Invoice + Pembayaran | ✅ | Upload bukti transfer |
| Login murid + Dashboard | ✅ | Jadwal, absensi, karya |
| Admin panel | ✅ | 11 sub: Dashboard, Murid, Pendaftar, Kelas, Hari&Jam, Jadwal, Absensi, Karya, Galeri Foto, Produk, Testimoni, Pembayaran |
| Watermark otomatis | ✅ | jimp (resize 1000px + JPEG 65% + multiply blend) |
| Galeri publik | ✅ | Lightbox + keyboard nav |
| Galeri Foto Owner | ✅ | Instagram grid + admin upload + proxy image |
| Testimoni | ✅ | Admin upload + section beranda (simplified: no foto, no bintang) |
| PWA + Push notif | ✅ | VAPID keys |
| Telegram Bot | ✅ | @magicpencil_notif_bot |
| WA floating button | ✅ | wa.me/628111150563 |
| ShareModal | ✅ | Native share HP / modal desktop |
| Vertical Feed Lightbox | ✅ | Scroll feed kayak IG |
| Like + Reaction | ✅ | ❤️ gallery_likes, fingerprint-based |
| Auto Akun Murid | ✅ | Auto-create pas daftar, kredensial setelah bayar |
| Online Store | ✅ | Katalog `/store`, order WA, admin CRUD, upload + proxy image |
| Auto-generate Jadwal | ✅ | Monthly=4x pertemuan (mingguan), Single/Sesi=1x. Tanggal real, meeting_number |

---

## 7. Status Tahap

| Tahap | Fitur | Status |
|-------|-------|--------|
| 1-12 | Foundation + fitur dasar | ✅ Selesai |
| 13 | Jadwal kelas murid | ✅ Selesai |
| 14 | PWA + Push Notif | ✅ Selesai |
| 15 | Galeri Sketsa + Polish | ✅ Selesai |
| 16 | Galeri Karya Murid + Watermark | ✅ Selesai, deployed |
| 17 | Syarat & Ketentuan | ✅ Selesai, deployed |
| 18a | Push Notification | ✅ Selesai, deployed |
| 18b | Telegram Bot | ✅ Selesai, deployed |
| 18c | WA Floating Button | ✅ Selesai, deployed |
| 19 | Testimoni (Simplified) | ✅ Selesai, deployed |
| 20 | Share ke Medsos (ShareModal) | ✅ Selesai, deployed |
| 21 | Vertical Feed Lightbox (Instagram-style) | ✅ Selesai, deployed |
| 22 | Like + Reaction | ✅ Selesai, deployed |
| 23 | Auto Akun Murid | ✅ Selesai, deployed |
| 24 | Online Store — katalog + order WA + admin CRUD | ✅ Selesai, deployed |
| 29 | Auto-generate Jadwal (monthly=4x, single=1x, meeting_number, tanggal real, seed baru) | ✅ Selesai, deployed (16 Mei) |
| ~25-27~ | Testimoni Full, Events, Payment, Dashboard | ⏸️ Skip — nunggu WA API |

---

## 8. Catatan Penting

- **Backup + docs** — manual via `update mat` (git push + sync docs + backup DB)
- **New chat threshold** — 70% context
- **Tanya dulu** sebelum edit/delete/add/rename file
- **Server CPU KVM** tua — gak support sharp, pake jimp
- **Next.js 16** — route handler params wajib di-await
- **ShareModal** — native share di HP, modal platform di desktop
- **Proxy image produk** — `/api/produk/image/[...segments]` anti cache issue (gak perlu restart PM2)
- **Online Store** — semua order lewat WA (gak perlu payment gateway)
- **password_plain** — disimpan di DB buat display admin + user setelah bayar
