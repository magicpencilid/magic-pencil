# ✅ Tahap 16 — Checklist Progres

## 1) Database — Tabel `karya_murid`
- [x] Tambah schema migrasi tabel `karya_murid`
- [x] Field: id, murid_id, judul, deskripsi, kelas, image_path, is_public, status, approved_by, approved_at, created_at, updated_at

## 2) API Routes
- [x] `src/app/api/karya/route.js` — GET list + POST create
- [x] `src/app/api/karya/[id]/route.js` — GET detail + PATCH + DELETE
- [x] `src/app/api/karya/[id]/approve/route.js` — approve/reject

## 3) Dashboard Murid
- [x] `src/app/dashboard/karya/page.js` — list + upload + detail
- [x] `src/app/dashboard/karya/upload/page.js` — form upload

## 4) Admin Review
- [x] `src/app/admin/karya/page.js` — tabel + approve/reject

## 5) UI Components
- [x] `src/components/KaryaCards.jsx` — kartu galeri (inline di dashboard)
- [x] `src/components/KaryaUploadForm.jsx` — form upload (inline di upload page)
- [x] `src/components/KaryaTable.jsx` — tabel admin (inline di admin page)

## 6) Public Gallery
- [x] `src/app/galeri/page.js` — galeri publik approved

## 7) Utility
- [x] `src/lib/karya.js` — helper queries & status mapping

## 8) Upload Folder
- [x] Buat `public/uploads/karya/`
- [x] Limitasi ukuran gambar (10 MB, JPG/PNG/WEBP)
- [ ] Opsional: watermark kecil (skip — bisa ditambah nanti)
