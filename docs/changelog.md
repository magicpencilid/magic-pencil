# Changelog — Magic Pencil

> Catatan perubahan per tahap. Format: `YYYY-MM-DD: [Tahap] — Deskripsi`

---

### 2026-05-08: Tahap 16 — Galeri Karya Murid

**Files baru:**
- `src/lib/karya.js` — server helper
- `src/lib/karya-constants.js` — client-safe constants
- `src/app/api/karya/route.js`
- `src/app/api/karya/[id]/route.js`
- `src/app/api/karya/[id]/approve/route.js`
- `src/app/dashboard/karya/page.js`
- `src/app/dashboard/karya/upload/page.js`
- `src/app/admin/(main)/karya/page.js`
- `src/app/galeri/page.js`
- `src/components/AdminSidebar.jsx` — + menu Karya
- `src/app/dashboard/page.js` — + link Karya Saya
- `docs/tahap16-workflow.md`
- `docs/tahap16-implementation-plan.md`
- `docs/tahap16-checklist.md`

**Fitur:**
- Upload karya murid (status: private/pending/approved/rejected)
- Review & approve/reject dari admin
- Galeri publik (hanya approved yang tampil)
- Galeri pribadi di dashboard murid

**Status:** ✅ Selesai di lokal — ⏳ Belum di-deploy

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

### 2026-05-10: Backup Infrastructure + GitHub

**Backup system:**
- DB backup: `scripts/backup-db.js` — WAL checkpoint + integrity check + timestamp
- Snapshot mingguan: `scripts/snapshot-backup.ps1` — robocopy + cleanup (retensi 4 minggu)
- Real-time watcher diperbaiki — VBScript launcher, exclude rules di-update

**GitHub:**
- Akun: `magicpencilid` — magicpencil.admin@gmail.com
- Repo: `magicpencilid/magic-pencil`
- Push 3 commit: 137 files

**Test restore:** ✅ DB integrity OK, git clone OK, npm install OK
