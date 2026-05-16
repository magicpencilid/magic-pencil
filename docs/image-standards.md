# Standar Gambar — Magic Pencil

> Berlaku untuk SEMUA gambar di website Magic Pencil.
> Auto-watermark, auto-compress.

---

## Aturan Default

| Aturan | Nilai | Keterangan |
|--------|-------|------------|
| **Max Lebar** | 1000px | Aspect ratio otomatis terjaga |
| **Format Output** | JPEG | quality 65% |
| **Quality** | 65% | JPEG quality |
| **Watermark** | Wajib | watermark.png multiply blend pixel-level |
| **Opasitas Watermark** | 100% | Multiply penuh |
| **Ukuran Watermark** | 60% lebar gambar | Proporsional (0.6x bg width) |
| **Posisi** | Center | Ditengah gambar |
| **File Watermark** | `public/images/watermark.png` | |
| **Library** | JIMP (dynamic import) | |

---

## Cara Proses

### Script otomatis: `scripts/process-slide.js`

```
Usage: node scripts/process-slide.js <input.jpg> <output-name>
Contoh: node scripts/process-slide.js foto_baru.jpg slide-7
  -> Input:  public/images/foto_baru.jpg
  -> Output: public/images/slide-7.webp (1000px, 65%, watermark multiply center)
```

Script memakai JIMP (bukan ImageMagick) karena server CPU KVM tua tidak support sharp.

---

## File Penting

| File | Fungsi |
|------|--------|
| `public/images/watermark.png` | File watermark default (mode multiply) |
| `scripts/process-slide.js` | Script proses slide (resize + watermark) |
| `docs/image-standards.md` | (file ini) Dokumentasi standar |

---

## Uploads Directories

| Folder | Untuk |
|--------|-------|
| `public/uploads/pembayaran/` | Bukti pembayaran murid |
| `public/uploads/karya/` | Karya murid (admin approve) |
| `public/uploads/gallery/` | Galeri foto owner |
| `public/uploads/produk/` | Foto produk store (auto-kompres JPEG) |

---

> **Catatan:** Semua gambar baru WAJIB melalui proses ini sebelum di-upload ke server.
