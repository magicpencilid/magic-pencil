# STATE -- Magic Pencil
> Auto: 2026-05-16 18:10

## APP
nama:Magic Pencil
tujuan:Landing page + pendaftaran + galeri karya murid + online store
tahap:30 (Minat Gambar + Design System)
server:PM2 online (↺ 69)

## STATS
pages:27 (27 pages)
api:48 (48 routes)
comps:28
kelas:6
pendaftar:0 (fresh 15 Mei)
karya:0
absen:0
invoice:0
jadwal:0
minat_gambar:field di pendaftar (notes)

## NOTES
- No.Rek BLU BY BCA DIGITAL: 001662116182
- ShareModal: native share di HP, modal platform di desktop
- Like: 2 tabel — `gallery_likes` (foto studio) + `karya_likes` (karya murid), fingerprint-based
- Auto Akun Murid: akun auto-create pas daftar, kredensial muncul setelah konfirmasi bayar
- MuridCards langsung tampilin User ID + Password + Minat Gambar
- password_plain disimpan di DB buat display admin & user
- Online Store: katalog `/store`, order WA, admin CRUD, upload+kompres gambar, proxy API
- Proxy image: `/api/produk/image/[...segments]` — anti cache issue
- Leaderboard: top 10 karya populer di halaman depan
- Store images: auto-kompres JPEG quality 80, resize 800px
- **Design System:** monochrome gray (Inter + Playfair Display + Lucide Icons, gak pake emoji)
- **Minat Gambar:** dropdown wajib di form daftar (Alam, Manusia, Hewan, Bangunan, Benda Solid)

## NEXT
- WA API integration (notif ke WA ganti web push)

## ROADMAP
- Tahap 20 - Share + Investasi (✅)
- Tahap 21 - Vertical Feed Lightbox (✅)
- Tahap 22 - Like + Reaction (✅)
- Tahap 23 - Auto Akun Murid (✅)
- Tahap 24 - Online Store (✅)
- Tahap 25 - Navbar + Gallery UX Fixes (✅)
- Tahap 26 - Kompres Store (✅)
- Tahap 27 - Like Karya Murid (✅)
- Tahap 28 - Leaderboard (✅)
- Tahap 29 - Auto-generate Jadwal (✅)
- Tahap 30 - Minat Gambar + Design System (✅)
- Next - WA API integration
