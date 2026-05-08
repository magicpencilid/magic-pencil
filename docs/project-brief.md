# 📘 Project Brief — Magic Pencil

> File ini pegangan utama mamat. Update tiap kali ada perubahan besar.
> Dibuat: 2026-05-08

---

## 1. Identitas Project

| Item | Detail |
|------|--------|
| **Nama** | Magic Pencil |
| **Domain** | `magicpencil.my.id` |
| **Tema** | Monochrome modern grey — hitam, putih, abu-abu |
| **Font** | Inter (body), Playfair Display (heading), Muli (navbar) |
| **Warna** | `--color-primary: #1a1a1a`, `--color-accent: #666`, `--color-accent-dark: #444` |
| **Mata uang** | "Investasi" (bukan "Rp") |
| **WA nomor** | `628111150563` |
| **Transfer** | BLU BY BCA DIGITAL a.n D Willy Ardhany |

---

## 2. Lokasi File

### Lokal (laptop Willy)
```
C:\Users\willy\DW Works\Magicpencil\Pencil Web\magic-pencil-app\
├── src/
│   ├── app/              ← Semua halaman & API routes
│   ├── components/       ← UI komponen
│   └── lib/              ← Database, auth, helper
├── public/               ← Gambar, logo, favicon
├── magic-pencil.db       ← Database SQLite
├── docs/                 ← Roadmap, workflow, checklist
├── scripts/              ← Compress/watermark utility
├── package.json
└── .env.local            ← Admin password, VAPID keys
```

### Server (192.168.110.105)
```
/www/wwwroot/magic-pencil/
├── .next/                ← Build output
├── public/uploads/       ← Uploaded files
│   ├── bukti-bayar/
│   └── karya/
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
| **SSH** | `root@192.168.110.105` — key-based auth via `id_ed25519` |
| **Panel** | aaPanel |
| **Node.js** | v22.22.2 (via NodeSource) |
| **PM2** | Process: `magic-pencil`, port 3000, auto-start via systemd |
| **Nginx** | aaPanel managed, port **1051** → reverse proxy `127.0.0.1:3000` |
| **Domain** | Cloudflare Tunnel → `192.168.110.105:1051` |
| **Cache** | aaPanel proxy cache di `/www/server/nginx/proxy_cache_dir/` — **wajib dibersihin tiap deploy** |
| **Admin login** | `/admin` — password: `magicpencil123` |

### Deploy steps
1. `npm run build` di lokal
2. SCP file via SSH (`root@192.168.110.105`)
3. `npm install` di server
4. `pm2 restart magic-pencil`
5. `rm -rf /www/server/nginx/proxy_cache_dir/*`

### Nginx config
```nginx
# /www/server/panel/vhost/nginx/magicpencil.my.id.conf
proxy_cache off;
proxy_hide_header Cache-Control;
proxy_hide_header ETag;
add_header Cache-Control "no-cache, must-revalidate, private";
```

---

## 4. Database — SQLite (`magic-pencil.db`)

### Tabel
| Tabel | Fungsi |
|-------|--------|
| `pendaftar` | Data pendaftaran (nama, WA, kelas, status, alamat) |
| `jadwal` | Jadwal kelas per pendaftar |
| `invoice` | Invoice (auto-generated, amount, status) |
| `pembayaran` | Konfirmasi bayar (file_url, status) |
| `kelas` | Daftar kelas + harga (6 kelas) |
| `schedule_config` | Hari & jam yang tersedia |
| `notifikasi` | Log notifikasi terkirim |
| `akun_murid` | Akun login murid (email, password_hash) |
| `absensi` | Check-in/out per murid |
| `push_subscriptions` | Subscriber notifikasi PWA |
| `karya_murid` | Upload karya (status: private/pending/approved/rejected) |

### Kelas (5 fix, ngga bisa ditambah lewat UI)
| Kelas | Investasi |
|-------|-----------|
| Kelas Sketsa | IDR 1,000,000 |
| Kelas Gambar | IDR 1,000,000 |
| Sesi Lukis Anabul | IDR 350,000 |
| Sesi Sketsa | IDR 300,000 |
| Sesi Gambar | IDR 300,000 |

---

## 5. Status & Aliran Data

### Status Pendaftar
`baru` → `menunggu respon` → `terdaftar` → `selesai` / `batal`

### Status Invoice
`pending` → `lunas`

### Status Pembayaran
`pending` → `verified` / `rejected`

### Status Karya
`private` → `pending` (kalo publik) → `approved` / `rejected`

---

## 6. Routes — Halaman

| Route | Type | Fungsi |
|-------|------|--------|
| `/` | Static | Landing (Hero → Kelas → Galeri) |
| `/daftar` | Static | Form pendaftaran |
| `/status` | Static | Cek status + konfirmasi bayar |
| `/invoice` | Static | Invoice lookup |
| `/login` | Static | Login murid |
| `/galeri` | Static | Galeri publik karya murid |
| `/dashboard` | Static | Dashboard murid (login required) |
| `/dashboard/jadwal` | Static | Jadwal pribadi |
| `/dashboard/absensi` | Static | Riwayat absensi |
| `/dashboard/karya` | Static | Galeri pribadi murid |
| `/dashboard/karya/upload` | Static | Upload karya |
| `/admin` | Dynamic | Admin dashboard |
| `/admin/login` | Static | Login admin |
| `/admin/murid` | Dynamic | Data murid |
| `/admin/pendaftar` | Dynamic | Tabel pendaftar |
| `/admin/kelas` | Dynamic | Kelola kelas & harga |
| `/admin/jadwal-opsi` | Dynamic | Kelola hari & jam |
| `/admin/jadwal` | Dynamic | Jadwal kelas |
| `/admin/absensi` | Dynamic | Riwayat + rekap absensi |
| `/admin/karya` | Dynamic | Review karya murid |
| `/admin/pembayaran` | Dynamic | Konfirmasi pembayaran |

---

## 7. Status Tahap

| Tahap | Fitur | Status |
|-------|-------|--------|
| 1 | Foundation (Layout, Navbar, Footer, Hero, ClassInfo, Gallery) | ✅ Selesai |
| 2 | Form Pendaftaran | ✅ Selesai |
| 3 | Database & Backend (SQLite, API register) | ✅ Selesai |
| 4 | Admin Panel (Sidebar, Dashboard, Tabel Pendaftar) | ✅ Selesai |
| 5 | Invoice + Cek Status | ✅ Selesai |
| 6 | WA Template + Fitur Admin | ✅ Selesai |
| 7 | Admin Auth + Notifikasi | ✅ Selesai |
| 8 | Fitur Lanjutan (Kelas CRUD, Harga, Jadwal Picker, Murid) | ✅ Selesai |
| 9 | Deploy ke Server (aaPanel, PM2, Nginx, Cloudflare) | ✅ Selesai |
| 10 | Polish UI (Pencil Sketch, Monochrome Grey, Logo, Arabic) | ✅ Selesai |
| 11 | Login Murid + Database + Dashboard | ✅ Selesai |
| 12 | Absensi Check-in/out | ✅ Selesai |
| 13 | Jadwal Kelas Murid | ✅ Selesai |
| 14 | PWA + Notifikasi Push | ✅ Selesai |
| 15 | Finalisasi + Backup | ✅ Selesai |
| 15b | Polish Pagi (Kelas Private, Invoice BCA, Font Muli, dll) | ✅ Selesai |
| **16** | **Galeri Karya Murid** | **✅ Selesai (8 Mei)** |

---

## 8. Aturan Penting

- **Backup otomatis** tiap ada perubahan: `.openclaw` → lokal + Drive, `Pencil Web` → Drive
- **Tanya dulu** sebelum edit/delete/add/rename file
- **Double confirm** kalo mau hapus file/folder
- **Kalau mentok**, stop & lapor — jangan maksa
- **Mode cekatan** = gas file per file, minimal omong

---

## 9. Catatan Bug / Pending

- [ ] Watermark kecil di upload karya (opsional)
- [ ] Integrasi WA/Email notifikasi ke calon murid (butuh API pihak ketiga)
- [ ] Ada file `scripts/compress-watermark.js` — bisa dipake kapan aja

> **Last updated:** 2026-05-08 18:15 WIB
