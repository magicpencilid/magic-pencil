# STATE -- Magic Pencil
> Auto: 2026-05-15 15:49

## APP
nama:Magic Pencil
tujuan:Landing page + pendaftaran + galeri karya murid + online store
tahap:24 (Online Store - katalog + order WA)
server:PM2 online (↺ 47)

## STATS
pages:26 (26 pages)
api:46 (46 routes)
comps:27
kelas:?
pendaftar:0 (fresh)
karya:?
absen:?
invoice:?

## NOTES
- No.Rek BLU BY BCA DIGITAL: 001662116182
- ShareModal: native share di HP, modal platform di desktop
- Like: gallery_likes table, fingerprint-based
- Auto Akun Murid: akun auto-create pas daftar, kredensial muncul setelah konfirmasi bayar
- MuridCards langsung tampilin User ID + Password (gak ada tombol reset/backfill)
- password_plain disimpan di DB buat display admin & user
- Online Store: katalog `/store`, order WA, admin CRUD + upload gambar + proxy API
- Proxy image: `/api/produk/image/[...segments]` — anti cache issue (gak perlu restart PM2)
- Beli Merch: tombol 🛍️ di Gallery lightbox → WA langsung
- Fitur warna + ukuran di produk (tag chips input)
- Foto produk: object-contain + fixed height (h-56 grid, h-72~96 modal)
- Tahap 24-27 (roadmap lama) di-skip — nunggu WhatsApp API

## NEXT
- (nanti dulu) — nunggu arahan willy

## ROADMAP
- Tahap 20 - Dashboard Murid (✅)
- Tahap 21 - Gallery Lightbox (✅)
- Tahap 22 - Like + Reaction (✅)
- Tahap 23 - Auto Akun Murid (✅)
- Tahap 24 - Online Store ✅
- ~~Tahap 24-27 (lama) — di-skip~~
