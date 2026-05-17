# STATE -- Magic Pencil
> Auto: 2026-05-17 10:55

## APP
nama:Magic Pencil
tujuan:Landing page + pendaftaran + galeri karya murid + online store
tahap:30 (Minat Gambar + Design System) + perbaikan sore
server:PM2 online (↺ 77+)

## STATS
pages:~29
api:~50
comps:~28
kelas:6
pendaftar:0 (fresh 16 Mei)
karya:0
absen:0
invoice:0
jadwal:0
minat_gambar:field di pendaftar (notes)

## WORKFLOW RULES
- One at a time, no rush
- Selalu bikin tahapan kerja: step 1, step 2, step 3, dst — kasi liat wil dulu sebelum mulai
- Kerjakan step satu-satu

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
- **Design System:** monochrome gray (Inter body+navbar, Playfair Display heading, Italiana dekoratif, Lucide Icons, gak pake emoji)
- **Minat Gambar:** dropdown wajib di form daftar (Alam, Manusia, Hewan, Bangunan, Benda Solid)
- **Admin jadwal rework:** filter kelas dropdown, filter jadwal lewat otomatis, hapus +Tambah manual, hapus kolom Pengajar
- **Lokasi kelas:** API settings/default-location, auto-fill pas daftar, UI skip nunggu WA API
- **Docs audit + cleanup:** 7 docs dibersihin, 6 file sisa dihapus

## NEXT
- WA API integration (notif ke WA ganti web push + lokasi kelas + jadwal)

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
