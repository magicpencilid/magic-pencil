# ✅ Tahap 19 Checklist — Testimoni

## Backend
- [x] Tabel `testimonials` di database
- [x] `GET /api/testimonials` — ambil semua
- [x] `POST /api/testimonials` — upload + B&W processing
- [x] `DELETE /api/testimonials/[id]` — hapus
- [x] `GET /api/testimonials/image/[...segments]` — proxy serve

## Image Processing
- [x] `src/lib/process-testimonial-image.js`
- [x] Greyscale (B&W) + resize 300px + crop kotak

## Admin Panel
- [x] Halaman `/admin/testimoni`
- [x] Form upload (nama + teks + foto)
- [x] List testimoni + delete button
- [x] Menu "Testimoni" di sidebar

## Frontend
- [x] `TestimoniSection` component
- [x] Server-side data pass ke component
- [x] Scroll horizontal card
- [x] Foto bulat (CSS rounded-full)
- [x] Auto hide kalo data kosong

## Optimasi
- [x] HeroCarousel: `loading=lazy` + `decoding=async`
- [x] Testimoni: server-side data (gak pake client fetch)
- [x] Ganti navbar jadi ringkas (hapus Kelas + Cek Status)

## Deploy
- [x] Build 0 errors
- [x] PM2 restart
- [x] Verify semua halaman
