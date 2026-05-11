/**
 * Process Image — Compress + Watermark untuk upload
 * Pake JIMP v1 (ESM via dynamic import)
 * 
 * Aturan:
 *   - Resize: max 1000 px
 *   - Quality: 65% (JPEG)
 *   - Watermark: gambar watermark.png dikomposite di tengah (30% opacity)
 */

const fs = require("fs");
const path = require("path");

const MAX_WIDTH = 1000;

/**
 * Proses buffer gambar: resize + kompresi + watermark
 */
async function processImage(inputBuffer) {
  const { Jimp } = await import("jimp");

  // Naikin memory limit decoder biar HP 12MP+ muat
  if (Jimp.decoders) {
    if (Jimp.decoders["image/jpeg"]) Jimp.decoders["image/jpeg"].maxMemoryUsageInMB = 1024;
    if (Jimp.decoders["image/png"]) Jimp.decoders["image/png"].maxMemoryUsageInMB = 1024;
    if (Jimp.decoders["image/webp"]) Jimp.decoders["image/webp"].maxMemoryUsageInMB = 1024;
  }

  const image = await Jimp.read(inputBuffer);

  // Resize kalo terlalu lebar
  if (image.bitmap.width > MAX_WIDTH) {
    image.resize({ w: MAX_WIDTH });
  }

  const w = image.bitmap.width;
  const h = image.bitmap.height;

  // Load watermark image
  const wmPath = path.join(process.cwd(), "public", "images", "watermark.png");
  if (fs.existsSync(wmPath)) {
    let wmImage = await Jimp.read(wmPath);

    // Resize watermark — maks 80% lebar gambar
    const maxWmW = Math.round(w * 0.8);
    if (wmImage.bitmap.width > maxWmW) {
      wmImage.resize({ w: maxWmW });
    }

    const wmW = wmImage.bitmap.width;
    const wmH = wmImage.bitmap.height;

    // Posisi tengah
    const wmX = Math.round((w - wmW) / 2);
    const wmY = Math.round((h - wmH) / 2);

    // Watermark pake Multiply blend mode
    // - Area putih watermark → transparan (gak ngefek) — rumus: area * (opacity + (1-opacity) * w/255)
    // - Area gelap watermark → ngegelapin gambar
    // - Opacity 40% biar keliatan natural
    const wmOpacity = 1.0;
    for (let y = 0; y < wmH; y++) {
      for (let x = 0; x < wmW; x++) {
        const baseColor = image.getPixelColor(wmX + x, wmY + y);
        const wmColor = wmImage.getPixelColor(x, y);

        // Ekstrak RGB (format Jimp: R << 24 | G << 16 | B << 8 | A)
        const br = (baseColor >> 24) & 0xff;
        const bg = (baseColor >> 16) & 0xff;
        const bb = (baseColor >> 8) & 0xff;
        const ba = baseColor & 0xff;

        const wr = (wmColor >> 24) & 0xff;
        const wg = (wmColor >> 16) & 0xff;
        const wb = (wmColor >> 8) & 0xff;

        // Multiply + opacity control
        // br * (1 - wmOpacity + wmOpacity * wr/255)
        // = br * (1 - wmOpacity) + br * wmOpacity * wr/255
        const r = Math.round(br * (1 - wmOpacity) + br * wmOpacity * wr / 255);
        const g = Math.round(bg * (1 - wmOpacity) + bg * wmOpacity * wg / 255);
        const b = Math.round(bb * (1 - wmOpacity) + bb * wmOpacity * wb / 255);

        const newColor = ((r << 24) | (g << 16) | (b << 8) | ba) >>> 0;
        image.setPixelColor(newColor, wmX + x, wmY + y);
      }
    }
  }

  // Output JPEG kualitas 65%
  const buffer = await image.getBuffer("image/jpeg", { quality: 65 });
  return { buffer, format: "jpg" };
}

module.exports = { processImage };
