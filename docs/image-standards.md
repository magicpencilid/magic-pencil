# 📐 Standar Gambar — Magic Pencil

> Berlaku untuk SEMUA gambar di website Magic Pencil.
> Auto-watermark, auto-compress.

---

## 🎯 Aturan Default

| Aturan | Nilai | Keterangan |
|--------|-------|------------|
| **Max Lebar** | 1000px | Aspect ratio otomatis terjaga |
| **Format Output** | JPEG | WebP butuh ImageMagick tambahan |
| **Quality** | 65% | JPEG quality |
| **Watermark** | ✅ WAJIB | watermark.png multiply blend pixel-level |
| **Opasitas Watermark** | 100% | Multiply penuh |
| **Ukuran Watermark** | 60% lebar gambar | Proporsional (0.6x bg width) |
| **Posisi** | Center | Ditengah gambar |
| **File Watermark** | `public/images/watermark.png` | |
| **Library** | JIMP (dynamic import) | |

---

## 🛠 Cara Proses

### 1. Script otomatis: `scripts/process-slide.js`

```
Usage: node scripts/process-slide.js <input.jpg> <output-name>
Contoh: node scripts/process-slide.js foto_baru.jpg slide-7
  → Input:  public/images/foto_baru.jpg
  → Output: public/images/slide-7.webp (1000px, 65%, watermark multiply center)
```

### 2. Manual step-by-step (local dev only — requires ImageMagick)

Gunakan script otomatis aja:
```bash
node scripts/process-slide.js foto_baru.jpg slide-7
```

Atau kalo mau manual:
- Resize & WebP: butuh ImageMagick (`magick`) di lokal
- Watermark: pake JIMP (udah include)
- Script `process-slide.js` udah handle semua step + temp file cleanup

---

## 📂 File Penting

| File | Fungsi |
|------|--------|
| `public/images/watermark.png` | File watermark default (mode multiply) |
| `scripts/process-slide.js` | Script proses slide (resize + watermark + webp) |
| `docs/image-standards.md` | **(file ini)** Dokumentasi standar |

---

## 🖼️ Testimonial Images (B&W)

Foto testimoni diproses otomatis pas upload:
- **Max size:** 300px (kotak)
- **B&W:** `image.greyscale()` (Jimp)
- **Crop:** Kotak dari tengah
- **Format:** JPEG
- **Simpan:** `public/uploads/testimonials/`
- **Serve via:** `/api/testimonials/image/[...segments]` (proxy)

### Programmatic:
```javascript
const { processTestimonialImage } = require("@/lib/process-testimonial-image");
const result = await processTestimonialImage(buffer);
```

---

> **Catatan:** Semua gambar baru WAJIB melalui proses ini sebelum di-upload ke server.

## 📂 Uploads Directories

| Folder | Untuk |
|--------|-------|
| `public/uploads/pembayaran/` | Bukti pembayaran murid |
| `public/uploads/karya/` | Karya murid (admin approve) |
| `public/uploads/gallery/` | Galeri foto owner |
| `public/uploads/testimonials/` | Foto testimoni (otomatis B&W) |
