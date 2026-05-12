# 📘 Project Brief — Magic Pencil

> File ini pegangan utama mamat. Update tiap kali ada perubahan besar.
> Dibuat: 2026-05-08 | Update terakhir: 2026-05-11

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
| **Transfer** | BLU BY BCA DIGITAL a.n D Willy Ardhany |
| **Telegram** | @magicpencil_notif_bot |

---

## 2. Lokasi File

### Lokal (laptop Willy)
```
C:\Users\willy\DW Works\Magicpencil\Pencil Web\magic-pencil-app\
├── src/
│   ├── app/              ← 9 pages + 34 API routes
│   ├── components/       ← 25 komponen UI
│   └── lib/              ← Database, auth, helpers (12 files)
├── public/uploads/       ← bukti-bayar/ + karya/
├── docs/                 ← Dokumentasi
├── scripts/              ← Backup utilities
├── magic-pencil.db       ← Database SQLite
├── package.json
└── .env.local
```

### Server (192.168.110.105)
```
/www/wwwroot/magic-pencil/
├── .next/                ← Build output
├── public/uploads/       ← Uploaded files (2.2MB)
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
| `akun_murid` | Akun login murid |
| `absensi` | Check-in/out per murid |
| `push_subscriptions` | Subscriber PWA |
| `karya_murid` | Upload karya (watermark otomatis) |

### Data (per 11 Mei)
- Kelas: 7 | Pendaftar: 11 | Aktif: 3
- Karya: 1 | Absen: 1 | Invoice: 11 | Jadwal: 7

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
| Admin panel | ✅ | 9 sub-halaman |
| Watermark otomatis | ✅ | jimp (resize 1000px + JPEG 65% + multiply blend) |
| Galeri publik | ✅ | Lightbox + keyboard nav |
| Galeri Foto Owner | ✅ | Instagram grid + admin upload + proxy image |
| Testimoni | ✅ | Admin upload + foto B&W + section beranda |
| PWA + Push notif | ✅ | VAPID keys |
| Telegram Bot | ✅ | @magicpencil_notif_bot |
| WA floating button | ✅ | wa.me/628111150563 |

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
| 18d | Mobile Class Events | ⏸️ Hold (nunggu WA) |
| 19 | Testimoni | ✅ Selesai, deployed (simplified: no foto, no bintang) |
| 19a | Galeri Foto + Watermark Multiply | ✅ Selesai, deployed |
| — | Auto Akun Murid | 🔵 Rencana (email + mpXXXX) |
| 20 | Payment Gateway | ⚪ Ide |
| 21 | Progress Dashboard | ⚪ Ide |
| Store | Merch Karya Murid | ⚪ Ide |

---

## 8. Catatan Penting

- **Backup otomatis** — Watcher + mamat backup momen penting
- **Auto update doc** — mamat update docs tiap selesai kerja signifikan + lapor
- **New chat threshold** — 70% context
- **Tanya dulu** sebelum edit/delete/add/rename file
- **Server CPU KVM** tua — gak support sharp, pake jimp
- **Next.js 16** — route handler params wajib di-await
