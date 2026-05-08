# Tahap 16 - Galeri Karya Murid + Share Sosmed

```mermaid
flowchart TD
  A[Murid login dashboard] --> B[Buka menu Karya]
  B --> C[Upload foto hasil karya]
  C --> D[Isi judul, deskripsi, kelas]
  D --> E[Simpan karya]

  E --> F{Mode publik?}
  F -->|Tidak| G[Masuk galeri pribadi]
  F -->|Ya| H[Status menunggu approve admin]

  H --> I[Admin review karya]
  I --> J{Approve?}
  J -->|Ya| K[Tampil di galeri publik]
  J -->|Tidak| L[Tetap private / ditolak]

  G --> M[Detail karya]
  K --> M

  M --> N[Share / Download]
  N --> O[Share WA / IG / link]
```

## Alur singkat
1. Murid upload foto hasil karya dari dashboard.
2. Sistem simpan metadata karya, status default private.
3. Jika murid pilih publik, karya masuk antrian review admin.
4. Admin bisa approve atau menolak.
5. Karya yang lolos tampil di galeri publik.
6. Murid bisa buka detail, download, atau share.

## Aturan
- Default: private.
- Publik hanya setelah approve.
- Watermark kecil Magic Pencil opsional.
- Share ke sosmed cukup dari link / download / share card.
