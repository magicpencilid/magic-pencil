/**
 * Process Slide Image — Compress + Watermark buat slide gambar
 * 
 * Aturan standar (docs/image-standards.md):
 *   - Max lebar: 1000px
 *   - Quality: 65%
 *   - Watermark: multiply mode, center
 * 
 * Usage: node scripts/process-slide.js <input-filename> <output-name>
 * 
 * Contoh:
 *   node scripts/process-slide.js foto_baru.jpg slide-7
 *   → Input:  public/images/foto_baru.jpg
 *   → Output: public/images/slide-7.webp (1000px, 65%, watermark multiply center)
 * 
 * Tanpa argumen: pake default (buat ganti slide)
 *   → Input:  public/images/_input.jpg
 *   → Output: public/images/_output.webp
 */

const { Jimp } = require("jimp");
const path = require("path");
const { execSync } = require("child_process");
const fs = require("fs");

const IMAGES_DIR = path.join(__dirname, "..", "public", "images");
const WATERMARK_PATH = path.join(IMAGES_DIR, "watermark.png");
const MAX_WIDTH = 1000;
const QUALITY = 65;

async function main() {
  const args = process.argv.slice(2);
  
  let inputFile, outputFile;
  if (args.length >= 2) {
    inputFile = path.join(IMAGES_DIR, args[0]);
    outputFile = path.join(IMAGES_DIR, args[1] + ".webp");
  } else {
    // Default (ganti slide aja)
    inputFile = path.join(IMAGES_DIR, "_input.jpg");
    outputFile = path.join(IMAGES_DIR, "_output.webp");
  }

  // Cek file
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ File tidak ditemukan: ${inputFile}`);
    console.log("Gunakan: node scripts/process-slide.js <input.jpg> <output-name>");
    process.exit(1);
  }
  if (!fs.existsSync(WATERMARK_PATH)) {
    console.error(`❌ Watermark tidak ditemukan: ${WATERMARK_PATH}`);
    process.exit(1);
  }

  const tempResized = path.join(IMAGES_DIR, "_temp_resized.jpg");
  const tempWatermarked = path.join(IMAGES_DIR, "_temp_watermarked.jpg");

  try {
    // === Step 1: Resize dengan ImageMagick ===
    console.log("📷 Resize...");
    execSync(`magick "${inputFile}" -resize ${MAX_WIDTH}x "${tempResized}"`, { stdio: "ignore" });

    // === Step 2: Watermark multiply dengan JIMP ===
    console.log("🖊️ Watermark...");
    const bg = await Jimp.read(tempResized);
    const wm = await Jimp.read(WATERMARK_PATH);
    
    const bgW = bg.bitmap.width;
    const bgH = bg.bitmap.height;
    const targetWmW = Math.min(Math.round(bgW * 0.6), wm.bitmap.width);
    const scale = targetWmW / wm.bitmap.width;
    const targetWmH = Math.round(wm.bitmap.height * scale);
    wm.resize({ w: targetWmW, h: targetWmH });

    const wmX = Math.round((bgW - targetWmW) / 2);
    const wmY = Math.round((bgH - targetWmH) / 2);

    for (let wy = 0; wy < targetWmH; wy++) {
      for (let wx = 0; wx < targetWmW; wx++) {
        const bx = wmX + wx, by = wmY + wy;
        if (bx < 0 || bx >= bgW || by < 0 || by >= bgH) continue;

        const wc = wm.getPixelColor(wx, wy).toString(16).padStart(8, "0");
        const bc = bg.getPixelColor(bx, by).toString(16).padStart(8, "0");

        const wr = parseInt(wc.slice(0, 2), 16), wg = parseInt(wc.slice(2, 4), 16), wb = parseInt(wc.slice(4, 6), 16), wa = parseInt(wc.slice(6, 8), 16);
        const br = parseInt(bc.slice(0, 2), 16), bgg = parseInt(bc.slice(2, 4), 16), bb = parseInt(bc.slice(4, 6), 16);
        const a = wa / 255;

        const rr = Math.round((br * wr / 255) * a + br * (1 - a));
        const rgg = Math.round((bgg * wg / 255) * a + bgg * (1 - a));
        const rbb = Math.round((bb * wb / 255) * a + bb * (1 - a));

        bg.setPixelColor(((rr << 24) | (rgg << 16) | (rbb << 8) | 0xff) >>> 0, bx, by);
      }
    }

    await bg.write(tempWatermarked, { quality: QUALITY });

    // === Step 3: Convert ke WebP ===
    console.log("💾 Convert WebP...");
    execSync(`magick "${tempWatermarked}" -quality ${QUALITY} "${outputFile}"`, { stdio: "ignore" });

    const stats = fs.statSync(outputFile);
    console.log(`✅ Selesai! ${path.basename(outputFile)} (${(stats.size / 1024).toFixed(1)} KB)`);

    // Bersihin temp
    try { fs.unlinkSync(tempResized); } catch {}
    try { fs.unlinkSync(tempWatermarked); } catch {}

  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

main();
