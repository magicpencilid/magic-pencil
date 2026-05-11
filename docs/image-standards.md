# 📐 Standar Gambar — Magic Pencil

> Berlaku untuk SEMUA gambar di website Magic Pencil.
> Auto-watermark, auto-compress.

---

## 🎯 Aturan Default

| Aturan | Nilai | Keterangan |
|--------|-------|------------|
| **Max Lebar** | 1000px | Aspect ratio otomatis terjaga |
| **Format Output** | WebP | Kecil, kualitas optimal |
| **Quality** | 65% | JPEG/WebP quality |
| **Watermark** | ✅ WAJIB | Mulai 11 Mei 2026 |
| **Mode** | Multiply | Tipis, nyatu sama gambar |
| **Posisi** | Center | Ditengah gambar |
| **File Watermark** | `public/images/watermark.png` | |
| **Library** | JIMP (multiply) + ImageMagick (WebP) | |

---

## 🛠 Cara Proses

### 1. Script otomatis: `scripts/process-slide.js`

```
Usage: node scripts/process-slide.js <input.jpg> <output-name>
Contoh: node scripts/process-slide.js foto_baru.jpg slide-7
  → Input:  public/images/foto_baru.jpg
  → Output: public/images/slide-7.webp (1000px, 65%, watermark multiply center)
```

### 2. Manual step-by-step

```bash
# Step 1 — Resize ke max 1000px (ImageMagick)
magick input.jpg -resize 1000x resized.jpg

# Step 2 — Apply watermark multiply (JIMP)
node -e "
const {Jimp} = require('jimp');
(async () => {
  const bg = await Jimp.read('resized.jpg');
  const wm = await Jimp.read('public/images/watermark.png');
  
  // Scale watermark to 60% of bg width
  const targetW = Math.round(bg.bitmap.width * 0.6);
  wm.resize({ w: targetW });
  const wmX = Math.round((bg.bitmap.width - targetW) / 2);
  const wmY = Math.round((bg.bitmap.height - wm.bitmap.height) / 2);
  
  // Multiply blend
  for (let wy = 0; wy < wm.bitmap.height; wy++) {
    for (let wx = 0; wx < targetW; wx++) {
      const bx = wmX + wx, by = wmY + wy;
      if (bx < 0 || bx >= bg.bitmap.width || by < 0 || by >= bg.bitmap.height) continue;
      
      const wc = wm.getPixelColor(wx, wy).toString(16).padStart(8,'0');
      const bc = bg.getPixelColor(bx, by).toString(16).padStart(8,'0');
      
      const wr=parseInt(wc.slice(0,2),16), wg=parseInt(wc.slice(2,4),16), wb=parseInt(wc.slice(4,6),16), wa=parseInt(wc.slice(6,8),16);
      const br=parseInt(bc.slice(0,2),16), bg_=parseInt(bc.slice(2,4),16), bb=parseInt(bc.slice(4,6),16);
      const a=wa/255;
      
      const rr = Math.round((br*wr/255)*a + br*(1-a));
      const rgg = Math.round((bg_*wg/255)*a + bg_*(1-a));
      const rbb = Math.round((bb*wb/255)*a + bb*(1-a));
      
      bg.setPixelColor((rr<<24)|(rgg<<16)|(rbb<<8)|0xff >>> 0, bx, by);
    }
  }
  
  await bg.write('watermarked.jpg', { quality: 65 });
  console.log('✅ Watermarked');
})();
"

# Step 3 — Convert ke WebP (ImageMagick)
magick watermarked.jpg -quality 65 output.webp
```

---

## 📂 File Penting

| File | Fungsi |
|------|--------|
| `public/images/watermark.png` | File watermark default (mode multiply) |
| `scripts/process-slide.js` | Script proses slide (resize + watermark + webp) |
| `docs/image-standards.md` | **(file ini)** Dokumentasi standar |

---

> **Catatan:** Semua gambar baru WAJIB melalui proses ini sebelum di-upload ke server.
