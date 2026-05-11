# Changelog — Magic Pencil

> Catatan perubahan per tahap. Format: `YYYY-MM-DD: [Tahap] — Deskripsi`

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
