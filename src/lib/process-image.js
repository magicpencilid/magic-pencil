/**
 * Process Image — Compress + Watermark untuk upload karya
 * Pake JIMP v1 (ESM via dynamic import)
 * 
 * Aturan:
 *   - Resize: max 1000 px
 *   - Quality: 65% (JPEG)
 *   - Watermark: teks "Magic Pencil" semi-transparan di tengah
 */

const MAX_WIDTH = 1000;
const WATERMARK_TEXT = "Magic Pencil";

/**
 * Proses buffer gambar: resize + kompresi + watermark
 */
async function processImage(inputBuffer) {
  const { Jimp } = await import("jimp");
  const image = await Jimp.read(inputBuffer);

  // Resize kalo terlalu lebar
  if (image.bitmap.width > MAX_WIDTH) {
    image.resize({ w: MAX_WIDTH });
  }

  const w = image.bitmap.width;
  const h = image.bitmap.height;

  // Buat layer watermark semi-transparan
  const fontSize = Math.max(16, Math.round(w * 0.04));
  const padding = Math.round(fontSize * 0.8);
  const textW = WATERMARK_TEXT.length * fontSize * 0.55;
  const boxW = Math.round(Math.min(textW + padding * 2, w * 0.9));
  const boxH = Math.floor(fontSize * 1.6 + padding * 2);
  const radius = Math.round(fontSize * 0.3);

  // Bikin watermark sebagai image baru dengan background gelap transparan
  const wmLayer = new Jimp({ width: boxW, height: boxH, color: 0x00000000 });

  // Fill dengan rounded rect semi-transparan (25% opacity black)
  for (let y = 0; y < boxH; y++) {
    for (let x = 0; x < boxW; x++) {
      const inRect = (
        x >= 0 && x < boxW && y >= 0 && y < boxH &&
        (x >= radius && x < boxW - radius ||
         y >= radius && y < boxH - radius ||
         (x < radius && y < radius && Math.hypot(x - radius + 0.5, y - radius + 0.5) <= radius) ||
         (x >= boxW - radius && y < radius && Math.hypot(x - (boxW - radius - 1), y - radius + 0.5) <= radius) ||
         (x < radius && y >= boxH - radius && Math.hypot(x - radius + 0.5, y - (boxH - radius - 1)) <= radius) ||
         (x >= boxW - radius && y >= boxH - radius && Math.hypot(x - (boxW - radius - 1), y - (boxH - radius - 1)) <= radius))
      );
      if (inRect) {
        wmLayer.setPixelColor(0x40000000, x, y); // RGBA 25% hitam
      }
    }
  }

  // Overlay watermark ke tengah gambar
  const wmX = Math.round((w - boxW) / 2);
  const wmY = Math.round((h - boxH) / 2);
  image.composite(wmLayer, wmX, wmY);

  // Output JPEG kualitas 65%
  const buffer = await image.getBuffer("image/jpeg", { quality: 65 });
  return { buffer, format: "jpg" };
}

module.exports = { processImage };
