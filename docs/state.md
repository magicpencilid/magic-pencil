# STATE -- Magic Pencil
> Auto: 2026-05-16 18:32

## APP
nama:Magic Pencil
tujuan:Landing page + pendaftaran + galeri karya murid + online store
tahap:30 (Minat Gambar + Design System)
server:PM2 online (↺ 69)

## STATS
pages:~29
api:~50
comps:~28
kelas:6 (3 monthly + 3 single)
pendaftar:0 (fresh 16 Mei)
karya:0
absen:0
invoice:0
jadwal:0
minat_gambar:field di pendaftar (notes)

## NOTES
- No.Rek BLU BY BCA DIGITAL: 001662116182
- ShareModal: native share di HP, modal platform di desktop
- Like: 2 tabel — gallery_likes (foto studio) + karya_likes (karya murid), fingerprint-based
- Auto Akun Murid: akun auto-create pas daftar, kredensial muncul setelah konfirmasi bayar
- MuridCards langsung tampilin User ID + Password + Minat Gambar
- password_plain disimpan di DB buat display admin & user
- Online Store: katalog /store, order WA, admin CRUD, upload+kompres gambar, proxy API
- Proxy image: /api/produk/image/[...segments] — anti cache issue
- Leaderboard: top 10 karya populer di halaman depan
- Store images: auto-kompres JPEG quality 80, resize 800px
- Auto-generate Jadwal: monthly=4x, single=1x, meeting_number
- Check-in validation: cek jadwal dulu sebelum check-in
- Investasi card klikable di dashboard + riwayat invoice
- Navbar: link Toko, Beli Merch di Gallery, rename galeri
- Design System: monochrome gray (Inter body+navbar, Playfair Display heading, Italiana dekoratif, Lucide Icons, gak pake emoji)
- Minat Gambar: dropdown wajib di form daftar (Alam, Manusia, Hewan, Bangunan, Benda Solid)
- WA floating button: wa.me/628111150563

## NEXT
- WA API integration (notif ke WA ganti web push)

## ROADMAP
- Tahap 20 - Share + Investasi (selesai)
- Tahap 21 - Vertical Feed Lightbox (selesai)
- Tahap 22 - Like + Reaction (selesai)
- Tahap 23 - Auto Akun Murid (selesai)
- Tahap 24 - Online Store (selesai)
- Tahap 25 - Navbar + Gallery UX Fixes (selesai)
- Tahap 26 - Kompres Store (selesai)
- Tahap 27 - Like Karya Murid (selesai)
- Tahap 28 - Leaderboard (selesai)
- Tahap 29 - Auto-generate Jadwal (selesai)
- Tahap 30 - Minat Gambar + Design System (selesai)
- Next - WA API integration
