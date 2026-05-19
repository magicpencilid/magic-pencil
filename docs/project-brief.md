# Project Brief — Magic Pencil

> File ini pegangan utama mamat. Update tiap kali ada perubahan besar.
> Dibuat: 2026-05-08 | Update terakhir: 2026-05-19

---

## 1. Identitas Project

| Item | Detail |
|------|--------|
| **Nama** | Magic Pencil |
| **Domain** | `magicpencil.my.id` |
| **Tema** | Monochrome modern gray |
| **Font** | Inter (body & navbar), Playfair Display (heading), Italiana (dekoratif) |
| **Warna** | `--color-primary: #1a1a1a` (monochrome gray) |
| **Mata uang** | "Investasi" (bukan "Rp") |
| **Design System** | Lihat Section 8 untuk rules lengkap |
| **WA nomor** | `628111199059` |
| **Kontak baru** | TikTok `@magicpencil.id`, FB `facebook.com/magicpencilid` |
| **Transfer** | BLU BY BCA DIGITAL a.n D Willy Ardhany (No.Rek: 001662116182) |
| **Telegram** | @magicpencil_notif_bot |

---

## 2. Lokasi File

### Lokal (laptop Willy)
```
C:\Users\willy\DW Works\Magicpencil\Pencil Web\magic-pencil-app\
--- src/
    --- app/              Pages + API routes
    --- components/       UI components
    --- lib/              Database, auth, helpers
--- public/uploads/       bukti-bayar/ + karya/
--- docs/                 Dokumentasi
--- scripts/              Utility scripts
--- magic-pencil.db       Database SQLite
--- package.json
--- .env.local
```

### Server (192.168.110.105)
```
/www/wwwroot/magic-pencil/
--- .next/                Build output
--- public/uploads/       Uploaded files (~5.5MB)
--- magic-pencil.db       Database (live)
--- package.json
--- .env.local
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
| **Domain** | Cloudflare Tunnel -> aaPanel:1050 -> localhost:3000 |
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
| `kelas` | Daftar kelas + harga (6 kelas: 3 monthly + 3 single) |
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

### Data (per 16 Mei)
- Kelas: 6 (3 monthly + 3 single) | Pendaftar: 0 (fresh start) | Aktif: 0 | Produk Store: 2
- DB dibersihin setelah Tahap 23 selesai

---

## 5. Aliran Data

### Status Pendaftar
`baru` -> `menunggu respon` -> `terdaftar` -> `selesai` / `batal`

### Status Karya
`private` -> `pending` (kalo publik) -> `approved` / `rejected`

---

## 6. Fitur Terkini

| Fitur | Status | Catatan |
|-------|--------|---------|
| Landing page | Selesai | Hero + galeri sketsa owner |
| Pendaftaran + Syket | Selesai | Wajib setuju syarat & ketentuan + Minat Gambar dropdown |
| Invoice + Pembayaran | Selesai | Upload bukti transfer |
| Auto-generate Jadwal | Selesai | Monthly=4x, Single=1x, meeting_number, tanggal real |
| Check-in validation | Selesai | Cek jadwal dulu sebelum check-in |
| Login murid + Dashboard | Selesai | Jadwal, absensi, karya, investasi |
| Admin panel | Selesai | 11 sub menu |
| Watermark otomatis | Selesai | jimp (resize 1000px + JPEG 65% + multiply blend) |
| Galeri (gabung foto studio + karya murid) | Selesai | /koleksi dihapus, redirect ke /galeri, no tabs |
| Testimoni | Selesai | Simplified (no foto, no bintang) |
| PWA + Push notif | On Hold | Nunggu WA API |
| Telegram Bot | Selesai | @magicpencil_notif_bot |
| WA floating button | Selesai | wa.me/628111199059 |
| ShareModal | Selesai | Native share HP / modal desktop |
| Vertical Feed Lightbox | Selesai | Scroll feed kayak IG |
| Like + Reaction (2 tabel) | Selesai | gallery_likes + karya_likes, fingerprint |
| Leaderboard | Selesai | Top 10 approved + badge peringkat |
| Auto Akun Murid | Selesai | Auto-create pas daftar, kredensial setelah bayar |
| Online Store | Selesai | Katalog /store, order WA, admin CRUD, proxy image |
| Box Investasi klikable | Selesai | Riwayat invoice di /dashboard/investasi |
| Admin jadwal rework | Selesai | Filter kelas dropdown, filter lewat, hapus +Tambah |
| Lokasi kelas | Selesai | API + auto-fill (skip UI, nunggu WA API) |
| Floating WA sembunyi di admin | Selesai | CSS `body:has(#admin-root)` |
| Minat Gambar | Selesai | Dropdown wajib di form daftar (5 opsi) |
| Kompres Gambar Store | Selesai | Jimp resize 800px, JPEG quality 80 |
| Galeri Sketsa Dinamis | Selesai | Dari gallery_photos, limit 6 beranda, no lightbox |
| Navbar + Footer restructure | Selesai | Navbar: Kelas/Galeri/Testimoni/Kontak. Footer: legal links |
| Halaman baru (Tentang Kami, Kebijakan Privasi, FAQ, Kontak) | Selesai | Gradient-hero + white card + Lucide icons |
| Syarat & Ketentuan diperluas | Selesai | 6->11 section (gabung TOS website + murid) |
| ClassInfo icon update | Selesai | Star->Sparkles, UserCheck->UserPlus, PaintBucket->Cat |

---

## 7. Status Tahap

| Tahap | Fitur | Status |
|-------|-------|--------|
| 1-12 | Foundation + fitur dasar | Selesai |
| 13 | Jadwal kelas murid | Selesai |
| 14 | PWA + Push Notif | Selesai |
| 15 | Galeri Sketsa + Polish | Selesai |
| 16 | Galeri Karya Murid + Watermark | Selesai, deployed |
| 17 | Syarat & Ketentuan | Selesai, deployed |
| 18a | Push Notification | Selesai, deployed |
| 18b | Telegram Bot | Selesai, deployed |
| 18c | WA Floating Button | Selesai, deployed |
| 19 | Testimoni (Simplified) | Selesai, deployed |
| 20 | Share ke Medsos (ShareModal) | Selesai, deployed |
| 21 | Vertical Feed Lightbox (Instagram-style) | Selesai, deployed |
| 22 | Like + Reaction | Selesai, deployed |
| 23 | Auto Akun Murid | Selesai, deployed |
| 24 | Online Store — katalog + order WA + admin CRUD | Selesai, deployed |
| 25 | Navbar + Gallery UX Fixes (link Toko, Beli Merch, rename galeri) | Selesai, deployed |
| 26 | Kompres Gambar Store (Jimp resize 800px, JPEG quality 80) | Selesai, deployed |
| 27 | Like System Karya Murid (tabel karya_likes, API terpisah) | Selesai, deployed |
| 28 | Leaderboard (top 10 approved + badge peringkat) | Selesai, deployed |
| 29 | Auto-generate Jadwal (monthly=4x, single=1x) | Selesai, deployed |
| 30 | Minat Gambar + Design System | Selesai, deployed |
| 31 | Floating WA di Admin + Aturan Baru | Selesai, deployed |
| 32 | Galeri Sketsa Dinamis + Limit 6 Beranda | Selesai, deployed |
| 33 | Update Kontak + Emoji Cleanup Total (87 file) | Selesai, deployed (18 Mei) |
| 34 | New Pages + Navbar/Footer Restructure + Galeri Merge | Selesai, deployed (19 Mei) |

---

## 8. Design System — Monochrome Modern Gray

**Rules (wajib untuk semua fitur ke depan):**

### 8a. Warna
- **Semua** teks, icon, border, background, button, badge -> **monochrome gray**
- `--color-accent: #666666` — adalah medium gray, aman dipakai (`text-accent`, `bg-accent`)
- DILARANG pakai warna mentah: `text-red-*`, `text-green-*`, `text-blue-*`, `text-amber-*`, dll — kecuali untuk semantic states (error=red kalem, success=green kalem, warning=amber kalem)
- Gradasi gray yang dipakai:
  - `text-gray-300` / `text-gray-400` — icon dekoratif, placeholder
  - `text-gray-500` / `text-gray-600` — teks sekunder, badge
  - `text-text-light` — teks sekunder (dari CSS variable)
  - `text-primary` — teks utama (dari CSS variable)
  - `text-accent` / `bg-accent` — aksi, button (medium gray #666666)

### 8b. Font
- **Body & Navbar:** `Inter` (sans-serif) — via CSS variable `--font-sans`
- **Judul/Display:** `Playfair Display` (serif) — via CSS variable `--font-display`
- **Dekoratif:** `Italiana` — class `font-italiana` (jarang dipake)

### 8c. Icons
- **WAJIB** pakai [Lucide Icons](https://lucide.dev) (`lucide-react`)
- Jangan pake emoji — ganti dengan Lucide Icon yang gray/accent
- Kalo gak ada icon Lucide yang cocok, pilih yang paling mirip

### 8d. Aturan Tambahan
- Loading spinner: `text-accent` (konsisten)
- Badge status: `bg-gray-100 text-gray-500` (pending) / `bg-gray-200 text-gray-700` (lunas/aktif)
- Button primary: `bg-accent text-white` — CTA, hover effects
- Button secondary: `bg-gray-100 text-gray-700 hover:bg-gray-200`
- Focus ring input: `focus:ring-2 focus:ring-accent/30`

---

## 9. Catatan Penting

- **Backup + docs** — manual via `update mat` (git push + sync docs + backup DB)
- **New chat threshold** — 70% context
- **Tanya dulu** sebelum edit/delete/add/rename file
- **Server CPU KVM** tua — gak support sharp, pake jimp
- **Next.js 16** — route handler params wajib di-await
- **ShareModal** — native share di HP, modal platform di desktop
- **Proxy image produk** — `/api/produk/image/[...segments]` anti cache issue
- **Online Store** — semua order lewat WA (gak perlu payment gateway)
- **password_plain** — disimpan di DB buat display admin + user setelah bayar
- **Design System** — monochrome gray (Inter, Playfair Display, Lucide Icons, gak pake emoji)
- **Floating WA** — sembunyi otomatis di admin via `body:has(#admin-root) #wa-wrap`
- **Kontak baru:** WA +62 811 199 059, TikTok @magicpencil.id, FB facebook.com/magicpencilid
- **Galeri Sketsa** — dinamis dari gallery_photos, admin 1 button Beranda toggle, limit 6
- **Halaman baru:** /tentang-kami, /kebijakan-privasi, /faq, /kontak
- **Navbar baru:** Beranda, Kelas, Galeri, Toko, Testimoni, Kontak, Masuk
- **Footer baru:** Col 1: Tentang Kami, Kebijakan Privasi, Syarat & Ketentuan, FAQ
- **Syarat & Ketentuan:** 11 section (5 TOS website + 6 syarat murid)
- **Galeri:** /galeri gabung foto studio + karya murid. /koleksi hapus (redirect 308)
- **ClassInfo:** Star->Sparkles, UserCheck->UserPlus, PaintBucket->Cat
