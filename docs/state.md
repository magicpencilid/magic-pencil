# STATE -- Magic Pencil
> Auto: 2026-05-18 15:35

## APP
nama:Magic Pencil
tujuan:Landing page + pendaftaran + galeri karya murid + online store
tahap:33 (Update Kontak + Emoji Cleanup Prioritas)
server:PM2 online (↺ 11)

## STATS
pages:~29
api:~50
comps:~28
kelas:6
pendaftar:0 (fresh 17 Mei)
karya:0
absen:0
invoice:0
jadwal:0
minat_gambar:dropdown wajib (Alam, Manusia, Hewan, Bangunan, Benda Solid)

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
- **Kontak baru:** WA `+628111199059`, TikTok `@magicpencil.id`, Facebook `facebook.com/magicpencilid`
- **Minat Gambar:** dropdown wajib di form daftar (Alam, Manusia, Hewan, Bangunan, Benda Solid)
- **Admin jadwal rework:** filter kelas dropdown, filter jadwal lewat otomatis, hapus +Tambah manual, hapus kolom Pengajar
- **Galeri Sketsa:** dinamis dari gallery_photos, limit 6 beranda, 1 button toggle, gak ada lightbox. Upload masuk galeri aja, atur lewat grid.
- **Floating WA:** sembunyi di admin via CSS body:has(#admin-root)
- **Aturan baru:** panggilan willy/mamat, larangan lo/gua/agama, workflow step
- **Lokasi kelas:** API settings/default-location, auto-fill pas daftar, UI skip nunggu WA API
- **Bootstrap config:** bootstrapMaxChars 20rb, bootstrapTotalMaxChars 80rb
- **1 Button Beranda Toggle:** admin galeri — 1 button icon House, dark/light state, disabled kalo penuh, bg-accent serasi
- **Testimoni rencana:** pindah input ke dashboard murid (belum urgent)
- **Upload galeri:** upload masuk galeri aja (gak langsung beranda), atur lewat grid toggle
- **iOS PWA:** skip — bukan prioritas, masalah cuma di Safari Add to Home Screen
- **Nama user:** willy (bukan wil)
- **Aturan icon:** Semua icon harus Lucide, monochrome grey. Gak boleh pake emoji. Warna semantic boleh tp shade kalem.
- **Emoji cleanup tahap 1:** 13 file selesai (KonfirmasiPembayaran, PendaftarTable, dashboard, store, API files, auth-murid, status)
- **Sisa emoji:** ~30 file (ShareModal, syarat-ketentuan, HeroCarousel, dll) — belum

## NEXT
- WA API integration (notif ke WA ganti web push + lokasi kelas + jadwal) — ✅ NIB jadi, nunggu Meta Business diverifikasi, nomor baru + domain siap

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
- Tahap 31 - Floating WA Admin + Aturan Baru (selesai)
- Tahap 32 - Galeri Sketsa Dinamis + Limit 6 Beranda (selesai)
- Tahap 33 - Update Kontak + Emoji Cleanup (selesai)
- Next - WA API integration
- Next - Lanjut emoji cleanup sisa ~30 file
