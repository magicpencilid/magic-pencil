# STATE -- Magic Pencil
> Auto: 2026-05-19 15:28

## APP
nama:Magic Pencil
tujuan:Landing page + pendaftaran + galeri karya murid + online store
tahap:34 (Finalisasi WA API Meta + Mini About/Store + Galeri Lightbox Fix)
latest_deploy:commit 18c6fdd (Fix: missing ChevronLeft import galeri lightbox), PM2 ↺ 32
server:PM2 online (↺ 32)

## STATS
pages:~29
api:~50
comps:~28
kelas:6
pendaftar:8 (sejak 17 Mei)
karya:0
absen:0
invoice:8 (3 pending, 5 lunas)
jadwal:20 (auto-generated)
pembayaran:12
minat_gambar:dropdown wajib (Alam, Manusia, Hewan, Bangunan, Benda Solid)

## WORKFLOW RULES
- One at a time, no rush
- Selalu bikin tahapan kerja: step 1, step 2, step 3, dst — kasi liat willy dulu sebelum mulai
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
- **Kontak:** WA `+628111199059`, TikTok `@magicpencil.id`, Facebook `facebook.com/magicpencilid`
- **Minat Gambar:** dropdown wajib di form daftar (Alam, Manusia, Hewan, Bangunan, Benda Solid)
- **Admin jadwal rework:** filter kelas dropdown, filter jadwal lewat otomatis, hapus +Tambah manual, hapus kolom Pengajar
- **Galeri Sketsa:** dinamis dari gallery_photos, limit 6 beranda, 1 button toggle. Halaman /galeri punya lightbox penuh (like, share, merch link, prev/next). Upload masuk galeri aja, atur lewat grid.
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
- **Emoji cleanup:** 87 file selesai total. Step 1: UI/API visible (ShareModal, WhatsAppButton, InvoiceLookup, dll). Step 2: app/ headers (53 file). Step 3: components+lib/ headers (23 file). Font Inter konsisten.

## NOTES — 19 Mei 2026
- **Halaman baru:** /tentang-kami, /kebijakan-privasi, /faq, /kontak — layout konsisten gradient-hero + white card + Lucide icons
- **Syarat & Ketentuan:** diperluas dari 6 ke 11 section (tambah 5 TOS website)
- **Navbar:** Koleksi->Galeri, tambah Kelas, Testimoni, Kontak
- **Footer:** col 1 ganti ke Tentang Kami, Kebijakan Privasi, Syarat & Ketentuan, FAQ
- **Galeri merge:** /galeri gabung foto studio + karya murid, /koleksi dihapus + redirect 308
- **Testimoni font fix:** font-display + text-primary konsisten
- **ClassInfo icon:** Star->Sparkles, UserCheck->UserPlus, PaintBucket->Cat
- **Hero badge:** tulisan polos "KELAS MENGGAMBAR UNTUK SEMUA UMUR" tanpa bingkai, tanpa arrow nav
- **Mini About:** section baru di homepage (hero->MiniAbout->Kelas), teks + link ke /tentang-kami
- **Mini Store:** section baru setelah Gallery, teks + link ke /store
- **Gallery link:** "Lihat Semua di Galeri" di bawah grid gallery homepage, link ke /galeri
- **Lokasi fix:** dipisah jadi Negara: Indonesia + Wilayah: Bogor & Jakarta (Kontak + Tentang Kami)
- **Jam operasional:** tambah di halaman Kontak (Senin–Sabtu, 09:00–17:00)
- **JSON-LD:** structured data LocalBusiness di head layout
- **OG Tags:** openGraph metadata di layout (title, description, siteName, locale)
- **Gallery lightbox fix:** tambah missing import ChevronLeft, fix crash saat klik gambar

## NOTES — 18 Mei 2026
- **AlertTriangle fix:** Missing import di KonfirmasiPembayaran — error "This page couldn't load" pas done step. Commit `df677fe`.
- **Upload dir fix:** `public/uploads/` dan `public/uploads/bukti-bayar/` permission 555→755 di server.
- **Admin note:** Catatan user (admin_note) tersimpan di DB tapi belum ada kolom di admin PembayaranTable.
- **Absensi gaps:** Gak ada auto-detect alpha, status 'alpha'/'izin', make-up system, notifikasi missed class. Rencana dikerjain setelah WA API siap.
- **Obsidian hari ini:** 5 file summary di vault 20260518/.

## NEXT
- WA API integration (notif ke WA ganti web push + lokasi kelas + jadwal) — ✅ NIB jadi, nunggu Meta Business diverifikasi, nomor baru + domain siap
- Mobile UX improvement (auto-save draft form RegistrationForm + dashboard murid mobile polish)
- Admin PembayaranTable: tambah kolom Catatan (admin_note)
- Absensi system: auto-detect alpha, status 'alpha'/'izin', make-up, notifikasi WA (dikerjain setelah WA API siap)

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
- Tahap 34 - New Pages + Navbar/Footer Restructure + Galeri Merge + Finalisasi WA API Meta + Mini About/Store + Galeri Lightbox Fix (selesai)
- Next - WA API integration
- Next - Mobile UX improvement (auto-save draft form + dashboard mobile polish)
