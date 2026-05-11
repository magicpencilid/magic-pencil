/**
 * Proses slide gambar: resize, webp, watermark multiply
 * 
 * Usage: node scripts/process-slide.js
 * Input:
 *   - public/images/_temp_slide_resized.jpg (gambar mentah)
 *   - public/images/_temp_watermark.png (watermark)
 * Output:
 *   - public/images/slide-4.webp
 */

const { Jimp } = require("jimp");
const path = require("path");

const MAX_WIDTH = 1000;
const QUALITY = 65;

async function main() {
  const baseDir = path.join(__dirname, "..", "public", "images");
  const inputPath = path.join(baseDir, "_temp_slide_resized.jpg");
  const wmPath = path.join(baseDir, "_temp_watermark.png");
  const outputPath = path.join(baseDir, "_temp_slide_watermarked.jpg");

  // 1. Load background image
  console.log("📷 Loading background...");
  const bg = await Jimp.read(inputPath);

  // 2. Resize to max 1000px width
  if (bg.bitmap.width > MAX_WIDTH) {
    bg.resize({ w: MAX_WIDTH });
    console.log(`  → Resized to ${bg.bitmap.width}x${bg.bitmap.height}`);
  } else {
    console.log(`  → Size OK: ${bg.bitmap.width}x${bg.bitmap.height}`);
  }

  const bgW = bg.bitmap.width;
  const bgH = bg.bitmap.height;

  // 3. Load watermark
  console.log("🖊️ Loading watermark...");
  const wm = await Jimp.read(wmPath);
  const wmW = wm.bitmap.width;
  const wmH = wm.bitmap.height;
  console.log(`  → Watermark size: ${wmW}x${wmH}`);

  // 4. Scale watermark to fit background nicely (max 60% of background width)
  const targetWmW = Math.min(Math.round(bgW * 0.6), wmW);
  const scale = targetWmW / wmW;
  const targetWmH = Math.round(wmH * scale);
  wm.resize({ w: targetWmW, h: targetWmH });
  console.log(`  → Watermark scaled to: ${targetWmW}x${targetWmH}`);

  // 5. Apply watermark at center with multiply blend
  console.log("🎨 Applying watermark (multiply)...");
  const wmX = Math.round((bgW - targetWmW) / 2);
  const wmY = Math.round((bgH - targetWmH) / 2);

  // Manual multiply blend pixel by pixel
  for (let wy = 0; wy < targetWmH; wy++) {
    for (let wx = 0; wx < targetWmW; wx++) {
      const bgX = wmX + wx;
      const bgY = wmY + wy;

      // Skip if outside background bounds
      if (bgX < 0 || bgX >= bgW || bgY < 0 || bgY >= bgH) continue;

      const wmHex = wm.getPixelColor(wx, wy);
      const bgHex = bg.getPixelColor(bgX, bgY);

      // Extract RGBA (JIMP stores as hex RRGGBBAA)
      const wmStr = wmHex.toString(16).padStart(8, "0");
      const bgStr = bgHex.toString(16).padStart(8, "0");

      const wr = parseInt(wmStr.slice(0, 2), 16);
      const wg = parseInt(wmStr.slice(2, 4), 16);
      const wb = parseInt(wmStr.slice(4, 6), 16);
      const wa = parseInt(wmStr.slice(6, 8), 16);

      const br = parseInt(bgStr.slice(0, 2), 16);
      const bg_ = parseInt(bgStr.slice(2, 4), 16);
      const bb = parseInt(bgStr.slice(4, 6), 16);

      // Multiply blend: result = (bg * wm) / 255
      // If watermark has alpha, blend with alpha
      const alpha = wa / 255;
      const invAlpha = 1 - alpha;

      const rr = Math.round((br * wr / 255) * alpha + br * invAlpha);
      const rg = Math.round((bg_ * wg / 255) * alpha + bg_ * invAlpha);
      const rb = Math.round((bb * wb / 255) * alpha + bb * invAlpha);

      // Set pixel (JIMP expects RGBA as number)
      const newHex = (rr << 24) | (rg << 16) | (rb << 8) | 0xff;
      bg.setPixelColor(newHex >>> 0, bgX, bgY);
    }
  }

  // 6. Save as WebP quality 65%
  console.log(`💾 Saving to slide-4.webp (quality ${QUALITY}%)...`);
  await bg.write(outputPath, { quality: QUALITY });

  console.log("✅ Done! slide-4.webp siap.");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
