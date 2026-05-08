# Tahap 16 - Rencana Implementasi File per File

## 1) Database / lib
- `src/lib/database.js`
  - tambah tabel `karya_murid`
  - field minimal: id, murid_id, judul, deskripsi, kelas, image_path, is_public, status, approved_by, approved_at, created_at, updated_at
- optional helper query di lib auth/murid jika perlu

## 2) API
- `src/app/api/karya/route.js`
  - GET list karya
  - POST create karya
- `src/app/api/karya/[id]/route.js`
  - GET detail
  - PATCH update
  - DELETE hapus
- `src/app/api/karya/[id]/approve/route.js`
  - approve / reject karya publik
- optional:
  - `src/app/api/karya/upload/route.js` kalau upload dipisah

## 3) Dashboard murid
- `src/app/dashboard/karya/page.js`
  - list karya milik murid
  - tombol upload
  - tombol detail / share / download
- `src/app/dashboard/karya/upload/page.js`
  - form upload foto dan metadata
- optional:
  - `src/app/dashboard/karya/[id]/page.js` untuk detail karya

## 4) Admin
- `src/app/admin/karya/page.js`
  - tabel karya masuk
  - status private / pending / approved
  - tombol approve / reject / delete

## 5) UI components
- `src/components/KaryaCards.jsx`
- `src/components/KaryaUploadForm.jsx`
- `src/components/KaryaTable.jsx`
- optional `src/components/KaryaShareCard.jsx`

## 6) Public gallery
- `src/app/galeri/page.js`
  - tampilkan karya approved
  - layout gallery monochrome

## 7) Shared utils
- `src/lib/karya.js`
  - helper query, status mapping, share text
- optional watermark helper kalau diproses server-side

## 8) Asset / storage
- folder simpan upload, misalnya `public/uploads/karya/`
- pastikan ukuran gambar dibatasi
- optional watermark kecil sebelum save

## Urutan kerja
1. tambah schema database
2. buat API dasar
3. buat dashboard murid
4. buat admin review
5. buat public gallery
6. tambah share/download polish
