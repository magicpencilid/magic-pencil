# Changelog — Magic Pencil

> Catatan perubahan per tahap. Format: `YYYY-MM-DD: [Tahap] — Deskripsi`

---

### 2026-05-18: Tahap 33 — Emoji Cleanup + Lucide Migration

**Step 1 — UI/API Visible Emoji (11 file, high priority):**
- ShareModal: emoji icon platform (📸🎵👍💬🐦) → Lucide (Camera, Music, ThumbsUp, MessageCircle, Image)
- ShareModal: ➔ → ArrowRight, 🔗 → Link
- WhatsAppButton: hapus 😊 dari tooltip
- InvoiceLookup: ✅ LUNAS → CheckCircle, ⏳ PENDING → Clock
- NotificationManager: ✅ → CheckCircle
- syarat-ketentuan: hapus 🎉 dari judul
- absensi API: hapus 🎨 dari response checkin/checkout
- karya-constants & dashboard karya: hapus emoji dari share text
- JadwalOpsiAdmin & KelasAdmin: hapus ✅ dari comment

**Step 2 — Comment Headers app/ (53 file, medium priority):**
- Semua header comment di pages (home, layout, invoice, login, syarat-ketentuan, galeri, koleksi)
- Semua header comment di admin pages (auth, absensi, galeri-foto, jadwal-opsi, karya, kelas, murid, pendaftar, produk)
- Semua header comment di dashboard pages (beranda, absensi, investasi, jadwal, karya, upload-karya)
- Semua header comment di API routes (~27 file)
- Inline comment: 🔑 di galeri & koleksi → teks

**Step 3 — Comment Headers components + lib (23 file, medium priority):**
- AdminDashboard, AdminSidebar, ClassInfo, Gallery, Leaderboard, MuridCards, PembayaranTable, RegistrationForm, StatusCheck, WATemplate, LayoutShell
- Step 1 follow-up: ShareModal, WhatsAppButton, InvoiceLookup, NotificationManager, JadwalOpsiAdmin, KelasAdmin
- lib/: auth, database, karya-constants, karya, push, telegram
- Inline comment: 📝 (2x) di RegistrationForm

**Total:** 87 file, 3 commit (`c1e0b0f`, `27afc86`, `e104fed`)
**PM2:** ↺ 14 (emoji cleanup) / ↺ 16 (after AlertTriangle fix)
**Status:** ✅ Selesai

---

### 2026-05-18: Fix — AlertTriangle Missing Import ("This page couldn't load")

**Bug:**
- Commit `ea52907` (emoji cleanup Step 1) nambah `<AlertTriangle>` di JSX done step KonfirmasiPembayaran tapi lupa di-import dari lucide-react
- Runtime error: React.createElement(undefined) → "Element type is invalid" → Next.js error page with black background "This page couldn't load"
- Hanya muncul pas user klik "Ya, Saya Sudah Transfer" dan step berubah ke "done"

**Fix:**
- Tambah `AlertTriangle` ke import lucide-react di KonfirmasiPembayaran.jsx
- Juga fix directory permissions server: `public/uploads/` dan `public/uploads/bukti-bayar/` dari 555 (read-only) ke 755

**Admin Note Investigation:**
- Catatan user (admin_note) tersimpan di DB ✅
- API GET return admin_note ✅
- Belum ada kolom display di admin PembayaranTable ❌

**Analisis Absensi:**
- Gap: gak ada auto-detect alpha, status 'alpha'/'izin', make-up system, notifikasi missed class
- Rencana: fitur absensi lengkap dikerjain setelah WA API siap

**Files:** KonfirmasiPembayaran.jsx
**Commit:** `df677fe` | **PM2:** ↺ 16
**Status:** ✅ Fixed

---

### 2026-05-17: Tahap 31 — Floating WA di Admin + Aturan Baru

**Floating WA di Admin:**
- CSS `body:has(#admin-root) #wa-wrap { display: none }` di WhatsAppButton.jsx
- `id="admin-root"` di admin/(main)/layout.js
- Halaman admin gak perlu floating WA (cuma willy yang akses)

**Deploy issues & fixes:**
- Zip deploy gagal: package.json ketimpa file dari .next/build/
- Cross-platform build rawan eror: Windows better-sqlite3 hash beda sama Linux
- Solusi: `git pull` + build langsung di server

**Aturan baru ditetapkan:**
- Panggilan: willy (user), mamat/asisten (sopan)
- Gak boleh: lo/gua/lu, kata berbau agama
- Workflow: one at a time, bikin step list dulu, kerjakan satu-satu
- Summary/ringkasan wajib ke Obsidian

**Files:** WhatsAppButton.jsx, admin/(main)/layout.js
**Commit:** `491b5fa` | **PM2:** ↺ 77
**Status:** ✅ Selesai

---

### 2026-05-17: Tahap 32 — Galeri Sketsa Dinamis + Limit 6 Beranda

**Galeri sketsa dinamis:**
- Homepage Gallery.jsx rewrite: hardcoded data + lightbox IG-style (like/share/merch) -> fetch dari DB + showcase statis
- Kolom baru `show_on_homepage` di tabel `gallery_photos`
- API `/api/gallery?homepage=1` — filter 6 foto dengan `show_on_homepage = 1`

**Admin toggle:**
- Checkbox "Tampilkan di Beranda" pas upload foto
- Tombol Tampilkan/Sembunyikan di setiap kartu foto
- API toggle: `/api/gallery/[id]/toggle-homepage` (PATCH, admin only)

**Limit 6:**
- Maksimal 6 foto ditampilkan di Beranda
- API toggle + upload reject kalo udah 6
- Admin UI: tombol jadi "Penuh" & disabled, checkbox auto-disable, counter X/6

**Bug:**
- Global replace kebablasan: `const homeCount = homeCount;` -> ReferenceError
- Fix: commit `3132ef1`

**Files:** database.js, Gallery.jsx (rewrite 300->80 line), galeri-foto/page.js, api/gallery/route.js, toggle-homepage/route.js (baru)
**Commit:** `2e8355e`, `8008549`, `3132ef1` | **PM2:** ↺ 80+
**Status:** ✅ Selesai

---

### 2026-05-16: Tahap 29 — Auto-generate Jadwal

**Auto-generate jadwal:**
- Monthly=4x otomatis, Single=1x otomatis
- meeting_number + tanggal real dari schedule_config
- Seed pertama jalan pas generate

**Check-in validasi:**
- Cek jadwal dulu sebelum check-in — gak bisa asal klik

**Investasi card:**
- Box investasi klikable → riwayat invoice di /dashboard/investasi

**Files:** JadwalTable.jsx, api/jadwal/route.js, api/register/route.js
**Commit:** multiple | **PM2:** ↺ 55-69
**Status:** ✅ Selesai

---

### 2026-05-16: Tahap 30 — Minat Gambar + Design System

**Minat Gambar:**
- Ganti catatan tambahan → dropdown wajib di form daftar
- 5 opsi: Alam, Manusia, Hewan, Bangunan, Benda Solid
- Admin lihat minat gambar di MuridCards

**Design System:**
- Monochrome gray rules (semua gray, Lucide Icons, gak pake emoji)
- Inter (body+navbar), Playfair Display (heading), Italiana (dekoratif)
- Footer: link Invoice → Admin

**Perbaikan UI Sore:**
- Halaman daftar: hapus box WA redudan + icon benefits gray
- Store modal: floating WA nutup tombol WA → sembunyiin floating WA pas modal kebuka
- Admin jadwal: hapus +Tambah, filter kelas dropdown, filter lewat toggle
- API default-location (skip UI, nunggu WA API)

**Files:** 10+ file design system, daftar/page.js, store/page.js, WhatsAppButton.jsx, JadwalTable.jsx (5x)
**Commit:** ~37 commit | **PM2:** ↺ 55-76
**Status:** ✅ Selesai

---

### 2026-05-15: Tahap 28 — Leaderboard Karya Populer

**Leaderboard:**
- API `/api/karya/populer` — top 10 karya approved with most likes
- `Leaderboard.jsx` — grid responsive, badge peringkat (#1🏆 #2 #3) + ring oranye untuk top 3
- Letak di halaman depan antara Galeri Sketsa dan Testimoni
- Auto-hide kalo data kosong

**Commit:** `77432df` | **PM2:** ↺ 54
**Status:** ✅ Selesai

---

### 2026-05-15: Tahap 27 — Like System Karya Murid

**Like untuk karya murid:**
- Tabel baru `karya_likes` (pattern: karya_id + fingerprint, UNIQUE)
- API `/api/karya/[id]/like` (GET status + POST toggle)
- ❤️ button + count di lightbox `/galeri`

**Fix count display:**
- Count ❤️ selalu kelihatan walaupun 0 (IG-style)
- Fix `/koleksi` page: routing like berdasarkan source (gallery vs karya)

**Commit:** `f5645a9` | **PM2:** ↺ 53
**Status:** ✅ Selesai

---

### 2026-05-15: Tahap 26 — Kompres Gambar Store

**Fix gambar store berat:**
- PNG 1.3MB + 2.0MB dikompres ke JPEG quality 80 @800px → 27KB + 36KB
- DB path diupdate ke file baru, PNG lama dihapus
- API upload produk otomatis kompres pake Jimp

**Commit:** `7ee7623` | **PM2:** ↺ 52
**Status:** ✅ Selesai

---

### 2026-05-15: Tahap 25 — Navbar, Gallery UX Fixes

**Navbar:**
- Tambah link Toko (`/store`) di navbar
- Beli Merch button di Gallery lightbox (WA → `/store`)

**Rename & cleanup:**
- Rename `/gallery` → `/koleksi` (biar gak bingung sama `/galeri`)
- Update Navbar href + label
- Hapus deskripsi dari galeri sketsa di home page

**Commit:** `46f48a2`, `49b46b3`, `7a4a088`, `7b6ccd3` | **PM2:** ↺ 48-51
**Status:** ✅ Selesai

---

### 2026-05-15: Tahap 21 — Vertical Feed Lightbox (Instagram-style)

**Lightbox redesign:**
- Centered lightbox diganti jadi vertical scroll feed (kayak IG)
- Scroll ke bawah liat foto berikutnya — gak perlu klik prev/next
- Auto-scroll ke foto yang dipilih pas buka
- Tombol X fixed di atas

**Layout final (setelah polish):**
- Title overlay kiri atas (gradient bg, drop-shadow)
- Action bar bawah: ❤️ + count, Repost, Share, Beli Merch
- Caption di bawah action bar (kalo ada deskripsi)
- Style konsisten antara Gallery home, /koleksi, /galeri

**File berubah:** `Gallery.jsx`

---

### 2026-05-15: Tahap 20 — Share ke Medsos + Istilah Investasi

**Share Modal (ShareModal.jsx):**
- Komponen modal share ke: Instagram, TikTok, Facebook, WhatsApp, Twitter/X, Copy Link
- Integrasi di /gallery (GalleriPage) dan /galeri (Gallery lightbox)
- HP: native `navigator.share()` — muncul apps sesuai yg terinstall
- Desktop: fallback ShareModal dengan platform buttons

**Istilah Investasi:**
- Login murid: logo dihapus, "tagihan" → "investasi"
- Dashboard murid: "Tagihan" → "Investasi", "Cek status pembayaran" → "Cek status investasi"

---

### 2026-05-14: No.Rek BLU BY BCA DIGITAL

**Tambah No.Rekening (001662116182):**
- InvoiceLookup.jsx — format 3 baris: Transfer ke / Atas nama / No.Rek
- KonfirmasiPembayaran.jsx (2 tempat) — format 3 baris, bold No.Rek, font sama besar
- WATemplate.jsx — format 3 baris plain text
- Docs: project-brief.md + project-cheat.md diupdate
- Build + deploy ke server ✅

---

### 2026-05-12: Testimoni Simplifikasi + Auto Akun Rencana

**Testimoni Simplified:**
- Hapus foto & bintang — cuma nama + quote
- Admin panel monochrome gray
- Judul: "Mereka dan Gambar"
- Fix: `force-dynamic` biar data fresh tiap render

**Rencana Fitur Baru (saat itu, semua udah jadi):**
- Auto akun murid → ✅ Tahap 23
- Share medsos → ✅ Tahap 20
- Like → ✅ Tahap 22

---

### 2026-05-11: Testimoni + Optimasi + Navbar Ringkas

**Testimoni Baru:**
- Tabel `testimonials` + API CRUD + Proxy image
- Foto otomatis B&W (greyscale + crop tengah)
- Admin panel `/admin/testimoni`
- Section di beranda (setelah galeri, server-side data)

**Optimasi Performa:**
- HeroCarousel: `loading=lazy` + `decoding=async`
- Testimoni: ganti client fetch → server-side data

**Navbar Ringkas:**
- Hapus "Kelas" dan "Cek Status" dari navbar
- Navbar sekarang: Beranda | Galeri | Masuk + [Daftar]

---

### 2026-05-11: Watermark Multiply + Upload Fixes + Galeri Foto

**Galeri Foto Baru:**
- Halaman `/gallery` grid Instagram (lightbox, tab filter)
- Admin upload `/admin/galeri-foto`
- API `/api/gallery` + proxy image

**Upload Fixes:**
- Fix Jimp decoders + mime export + await params (Next.js 16)
- Fix DB migration di dalam SQL exec (Turbopack bug)

**Watermark Upgrade:**
- rounded rect → watermark.png multiply blend pixel-level
- 100% opacity, 80% lebar

---

### 2026-05-11: Navbar Glass + Gallery Lightbox + Standar Gambar + Flow Daftar

**Perubahan UI:**
- Navbar white glass: `bg-white/95` → `bg-white/70`, shadow ilang di awal, muncul pas scroll
- Navbar mobile dropdown: link text transparan, CTA outline (border), glass bg
- Navbar font: Muli → Inter (konsisten sama body)
- Gallery lightbox: hover text dihapus, klik gambar zoom full-screen, backdrop gelap, nav panah + keyboard

**Flow Daftar Baru:**
- Isi form → redirect ke `/syarat-ketentuan?from=daftar`
- Scroll ke bawah → tombol "Saya Setuju" / "Tidak Setuju"
- Setuju → API call + invoice + success view di halaman syket
- Tidak setuju → balik ke `/daftar`
- Checkbox syket di form dihapus

**Gambar & Standar:**
- Slide #4 baru: 4429x6496 px → resize 1000px → watermark multiply center → webp 65%
- Standar gambar default: `public/images/watermark.png`, `scripts/process-slide.js`, `docs/image-standards.md`

**File diubah:**
- `src/components/Navbar.jsx` — glass effect, mobile dropdown, font Inter
- `src/components/RegistrationForm.jsx` — ilangin checkbox, redirect ke syket
- `src/app/syarat-ketentuan/page.js` — client component + interaktif
- `src/components/Gallery.jsx` — lightbox, hapus hover text
- `public/images/slide-4.webp` — gambar baru watermark multiply
- `public/images/watermark.png` — 🆕 file watermark default
- `scripts/process-slide.js` — 🆕 script proses slide reusable
- `docs/image-standards.md` — 🆕 dokumentasi standar gambar

---

### 2026-05-10: Tahap 18c — WhatsApp wa.me Floating Button

**File baru:**
- `src/components/WhatsAppButton.jsx` — floating button pojok kanan bawah

**File diubah:**
- `src/components/Navbar.jsx` — mobile menu slide drawer → dropdown (biar WA button gak ketutupan)
- `src/app/globals.css` — animasi fade-in

**Fitur:**
- Floating WA button di semua halaman
- Tooltip "Ada yang bisa dibantu? 😊" — 2 baris, CSS-only
- Awal client component pake Tailwind → fix server component + inline styles (stacking context issue)
- Nomor: 628111150563

**Status:** ✅ Selesai, deployed

---

### 2026-05-10: Tahap 18b — Telegram Bot

**File baru:**
- `src/lib/telegram.js` — sendTelegram() pake fetch API Telegram (parse_mode: HTML)

**File diubah:**
- `src/app/api/register/route.js` — +sendTelegram
- `src/app/api/invoice/route.js` — +sendTelegram
- `src/app/api/pembayaran/route.js` — +sendTelegram
- `.env.local` — +TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

**Fitur:**
- Bot: @magicpencil_notif_bot dari @BotFather
- Chat ID: 7720311893
- Trigger: pendaftaran baru, invoice baru, pembayaran diverifikasi
- Notif admin real-time via Telegram

**Status:** ✅ Selesai, deployed

---

### 2026-05-10: Tahap 18a — Push Notification

**File diubah:**
- `src/app/api/register/route.js` — +sendPushNotification
- `src/app/api/invoice/route.js` — +sendPushNotification
- `src/app/api/pembayaran/route.js` — +sendPushNotification

**Fitur:**
- Colok sendPushNotification() di 3 titik
- Notif ke admin: pendaftar baru, invoice baru, pembayaran diverifikasi
- Web push via VAPID keys

**Status:** ✅ Selesai, deployed

---

### 2026-05-10: Tahap 17 — Syarat & Ketentuan

**File baru:**
- `src/app/syarat-ketentuan/page.js`

**File diubah:**
- `src/lib/database.js` — +kolom agree_terms + agree_terms_at
- `src/app/daftar/page.js` — +checkbox syket wajib

**Fitur:**
- Halaman /syarat-ketentuan
- Checkbox setuju syarat & ketentuan sebelum submit daftar
- Kolom agree_terms + agree_terms_at di tabel pendaftar
- API validasi + insert

**Deploy:** SCP → build → PM2 restart
**Status:** ✅ Selesai, deployed

---

### 2026-05-10: Tahap 16 — Galeri Karya Murid + Watermark + Deploy

**File baru:**
- `src/lib/karya.js` — server helper
- `src/lib/karya-constants.js` — client-safe constants
- `src/lib/process-image.js` — resize + kompresi + watermark (pake jimp)
- `src/app/api/karya/route.js`
- `src/app/api/karya/[id]/route.js`
- `src/app/api/karya/[id]/approve/route.js`
- `src/app/dashboard/karya/page.js`
- `src/app/dashboard/karya/upload/page.js`
- `src/app/admin/(main)/karya/page.js`
- `src/app/galeri/page.js`
- `public/images/` — sketsa owner

**File diubah:**
- `src/components/AdminSidebar.jsx` — + menu Karya
- `src/app/dashboard/page.js` — + link Karya Saya
- `src/app/api/karya/route.js` — integrasi watermark di upload
- `src/app/api/karya/[id]/approve/route.js` — fix await params (Next.js 16 async params)
- `package.json` — +jimp (ganti sharp yang gak support CPU KVM server)

**Fitur:**
- Upload karya murid (private/pending/approved/rejected)
- Review & approve/reject dari admin
- Galeri publik (lightbox + keyboard nav)
- Watermark "Magic Pencil" otomatis (resize 1000px + JPEG 65%)
- Galeri pribadi di dashboard murid

**Deploy:** Git push → server pull → npm install → build → PM2 restart
**Routes:** 52 → 53 (setelah Tahap 16)
**Test:** upload ✅ → approve admin ✅ → galeri publik ✅
**Status:** ✅ Selesai, deployed

---

### 2026-05-10: WP Config & Cheat Sheet

**File baru:**
- `docs/project-cheat.md` — project cheat sheet
- `docs/project-state.md` — project state tracker
- `state_magic_pencil.md` — ringkasan lengkap server & webui

**Status:** ✅ Selesai

---

### 2026-05-09: Backup Infrastructure Restruktur

**Perubahan:**
- Obsidian vault pindah ke `C:\Users\willy\.obsidian`
- Struktur backup baru: `E:\backup_mamat\` + `I:\My Drive\backup_mamat\`
- Watcher: `scripts/watch-backup.ps1` — FileSystemWatcher + debounce 10 detik
- Scheduled Task: "Mamat Backup Watcher" — auto start tiap login
- Watcher fix: VBScript launcher (biar gak nongol window), exclude rules

**Status:** ✅ Selesai

---

### 2026-05-08: Tahap 15b — Polish Pagi

**Perubahan:**
- Beranda: CTA section + tombol di tengah
- Warna button: semua dark grey (#666)
- Invoice: typo fix, font hitam, BLU BCA
- Font Muli ditambahkan (navbar)
- Kelas Private: kelas ke-3 (personal 1-on-1)
- Halaman Daftar: font header hitam

**Deploy:** ✅ Ke server

---

### 2026-05-08: Setup Git + Tahap 15 — Galeri Sketsa Owner

**Fitur:**
- Redesign hero + galeri sketsa owner di homepage
- DB backup cron tiap 6 jam (scripts/backup-db.js)
- Snapshot mingguan (scripts/snapshot-backup.ps1)
- compress-watermark.js — script watermark & kompresi

**GitHub:**
- Setup akun: magicpencilid
- Repo: magicpencilid/magic-pencil
- 3 commit, 137 files
- Test restore: DB integrity OK, git clone OK, npm install OK

**Status:** ✅ Selesai

---

### 2026-05-07: Tahap 13-14

- seed_kelas.js — isi data kelas awal
- update_schedule.js — utility jadwal
- Fix layout admin sidebar
- Perbaikan UI pendaftaran & payment flow

**Status:** ✅ Selesai

---

### 2026-05-06: Initial Deploy (Tahap 1-12)

**Fitur awal:**
- Next.js 16 + SQLite setup
- Landing page (hero, galeri sketsa, footer)
- Pendaftaran + invoice + status check
- Login murid + dashboard
- Absensi check-in/out
- Jadwal kelas murid
- Admin panel (login, pendaftar, pembayaran, murid, jadwal, absensi, kelas)
- PWA + notifikasi push (VAPID keys)
- Google Fonts (Playfair Display, Inter, Italiana)

**Deploy:** aaPanel → PM2 → Cloudflare Tunnel
**Status:** ✅ Selesai, deployed
