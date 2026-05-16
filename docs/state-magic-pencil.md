# STATE -- Magic Pencil
> Auto: 2026-05-15 17:20

## APP
nama:Magic Pencil
tujuan:Landing page + pendaftaran + galeri karya murid + online store
tahap:28 (Leaderboard Karya Populer)
server:PM2 online (↺ 54)

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

## NOTES
- No.Rek BLU BY BCA DIGITAL: 001662116182
- ShareModal: native share di HP, modal platform di desktop
- Like: 2 tabel — `gallery_likes` (foto studio) + `karya_likes` (karya murid), fingerprint-based
- Auto Akun Murid: akun auto-create pas daftar, kredensial muncul setelah konfirmasi bayar
- MuridCards langsung tampilin User ID + Password
- password_plain disimpan di DB buat display admin & user
- Online Store: katalog `/store`, order WA, admin CRUD, upload+kompres gambar, proxy API
- Proxy image: `/api/produk/image/[...segments]` — anti cache issue
- Leaderboard: top 10 karya populer di halaman depan (🔥 Karya Paling Populer)
- Store images: auto-kompres JPEG quality 80, resize 800px

## NEXT
- Upgrade Store — Multi Gambar + Slider

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
- Next - Upgrade Store — Multi Gambar + Slider
