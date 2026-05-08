#!/usr/bin/env node
/**
 * 🖼️ Compress + Watermark — Image Batch Processor
 * 
 * Aturan Willy:
 *   - Lebar: 800–1000 px (otomatis aspect ratio)
 *   - Format: WebP
 *   - Quality: 65%
 *   - Watermark: mode multiply, tipis
 *   - Bisa pake gambar aja, teks "Magic Pencil" aja, atau kombinasi keduanya
 * 
 * Usage:
 *   node scripts/compress-watermark.js <source> [dest] [options]
 *
 * Examples:
 *   # Pake teks "Magic Pencil" aja (tanpa gambar)
 *   node scripts/compress-watermark.js foto.jpg hasil.webp
 *
 *   # Pake gambar watermark dari kamu
 *   node scripts/compress-watermark.js ./gallery ./hd --watermark logo.png
 *
 *   # Gambar + teks (rekomendasi mamat 🌟)
 *   node scripts/compress-watermark.js ./gallery ./hd --watermark logo.png --text "Magic Pencil"
 *
 * Options:
 *   --width 1000      Max width (default: 1000, 0 = auto)
 *   --quality 65      WebP quality (default: 65)
 *   --watermark       Path ke gambar watermark (optional)
 *   --text "Magic Pencil"   Teks watermark (optional, default: "Magic Pencil")
 *   --position center  Posisi: nw, ne, sw, se, center (default: center)
 *   --blend multiply   Blend mode: multiply, over, screen (default: multiply)
 *   --format webp     Output format: jpg, png, webp (default: webp)
 *   --dry-run         Preview tanpa proses
 *   --verbose         Show detailed logs
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// ─── Parse arguments ───────────────────────────────────────
const args = process.argv.slice(2);
const source = args.find(a => !a.startsWith('--'));
const dest = args.filter(a => !a.startsWith('--') && a !== source)[1] || null;

const getOpt = (flag, def) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] || def : def;
};

const hasFlag = (flag) => args.includes(flag);

const config = {
  width: parseInt(getOpt('--width', '1000')),
  quality: parseInt(getOpt('--quality', '65')),
  watermark: getOpt('--watermark', './public/watermark.png'),
  text: getOpt('--text', ''),
  position: getOpt('--position', 'center'),
  blend: getOpt('--blend', 'multiply'),
  format: getOpt('--format', 'webp'),
  dryRun: hasFlag('--dry-run'),
  verbose: hasFlag('--verbose'),
};

const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.avif']);
const POSITION_MAP = {
  nw: 'northwest', ne: 'northeast', sw: 'southwest',
  se: 'southeast', center: 'center',
};

// ─── Helper ────────────────────────────────────────────────
function log(msg, force = false) {
  if (config.verbose || force) console.log(msg);
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ─── Resolve paths ─────────────────────────────────────────
const sourcePath = path.resolve(source || '.');
const destPath = dest ? path.resolve(dest) : null;

async function getFiles(src) {
  const stat = fs.statSync(src);
  if (stat.isFile()) return [src];
  if (stat.isDirectory()) {
    return fs.readdirSync(src)
      .filter(f => EXTENSIONS.has(path.extname(f).toLowerCase()))
      .map(f => path.join(src, f));
  }
  return [];
}

// ─── Generate text watermark SVG ──────────────────────────
function generateTextSvg(text, imgWidth, imgHeight) {
  const fontSize = Math.round(Math.min(imgWidth, imgHeight) * 0.035);
  const padding = Math.round(fontSize * 0.6);
  const textWidthEstimate = text.length * fontSize * 0.6;
  const svgWidth = Math.round(Math.min(textWidthEstimate + padding * 2, imgWidth * 0.9));
  const svgHeight = Math.round(fontSize * 2.2 + padding * 2);

  return `
    <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:white;stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:white;stop-opacity:0.05" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" rx="${Math.round(fontSize * 0.4)}" fill="url(#g)" />
      <text
        x="50%" y="50%"
        text-anchor="middle" dominant-baseline="central"
        font-family="system-ui, sans-serif"
        font-size="${fontSize}px"
        font-weight="bold"
        fill="none"
        stroke="rgba(0,0,0,0.35)"
        stroke-width="${Math.round(fontSize * 0.06)}px"
      >${text}</text>
      <text
        x="50%" y="50%"
        text-anchor="middle" dominant-baseline="central"
        font-family="system-ui, sans-serif"
        font-size="${fontSize}px"
        font-weight="bold"
        fill="rgba(255,255,255,0.6)"
      >${text}</text>
    </svg>
  `;
}

// ─── Watermark overlay ─────────────────────────────────────
async function applyWatermark(inputBuffer) {
  const inInfo = await sharp(inputBuffer).metadata();
  const composites = [];

  // Ada gambar watermark?
  const hasImage = config.watermark && fs.existsSync(config.watermark);
  // Ada teks?
  const hasText = config.text && config.text.trim();

  // --- 1. Image watermark ---
  if (hasImage) {
    const wmPath = path.resolve(config.watermark);
    const wmInfo = await sharp(wmPath).metadata();

    // Ukuran watermark (max 8% dari lebar gambar — tipis & elegan)
    const wmMaxWidth = Math.round(inInfo.width * 0.08);
    const wmWidth = Math.min(wmInfo.width, wmMaxWidth);

    let wmBuffer = await sharp(wmPath)
      .resize({ width: wmWidth, withoutEnlargement: true })
      .png()
      .toBuffer();

    // Kalo ada teks juga, combine image + tebs dalam satu SVG
    if (hasText) {
      const fontSize = Math.round(inInfo.width * 0.025);
      const wmMeta = await sharp(wmBuffer).metadata();
      const combinedHeight = wmMeta.height + fontSize * 1.8;

      const svgContent = `
        <svg width="${wmMeta.width}" height="${combinedHeight}" xmlns="http://www.w3.org/2000/svg">
          <image href="data:image/png;base64,${wmBuffer.toString('base64')}" x="${(wmMeta.width - wmMeta.width) / 2}" y="0" width="${wmMeta.width}" height="${wmMeta.height}" />
          <text
            x="50%" y="${wmMeta.height + fontSize * 0.7}"
            text-anchor="middle"
            font-family="system-ui, sans-serif"
            font-size="${fontSize}px"
            fill="rgba(255,255,255,0.5)"
          >${config.text}</text>
        </svg>
      `;

      wmBuffer = await sharp(Buffer.from(svgContent))
        .png()
        .toBuffer();
    }

    composites.push({
      input: wmBuffer,
      gravity: POSITION_MAP[config.position] || 'center',
      blend: config.blend === 'multiply' ? 'multiply' : 'over',
    });
  }
  // --- 2. Text-only watermark ---
  else if (hasText) {
    const svgContent = generateTextSvg(config.text, inInfo.width, inInfo.height);
    const textBuffer = await sharp(Buffer.from(svgContent)).png().toBuffer();

    composites.push({
      input: textBuffer,
      gravity: POSITION_MAP[config.position] || 'center',
      blend: 'over',
    });
  }

  if (composites.length === 0) return inputBuffer;

  return sharp(inputBuffer)
    .composite(composites)
    .toBuffer();
}

// ─── Process single file ───────────────────────────────────
async function processFile(inputPath, outputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  const outFormat = config.format || ext.replace('.', '');

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ File not found: ${inputPath}`);
    return;
  }

  const inputSize = fs.statSync(inputPath).size;
  const metadata = await sharp(inputPath).metadata();

  if (config.dryRun) {
    console.log(`  [DRY] ${path.basename(inputPath)}`);
    console.log(`        ${metadata.width}×${metadata.height} | ${formatSize(inputSize)}`);
    return;
  }

  let pipeline = sharp(inputPath);

  // Resize
  const resizeOpts = {};
  if (config.width > 0) resizeOpts.width = config.width;
  resizeOpts.fit = 'inside';
  resizeOpts.withoutEnlargement = true;
  pipeline = pipeline.resize(resizeOpts);

  // Encode
  if (outFormat === 'jpg' || outFormat === 'jpeg') {
    pipeline = pipeline.jpeg({ quality: config.quality, mozjpeg: true });
  } else if (outFormat === 'png') {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true });
  } else {
    pipeline = pipeline.webp({ quality: config.quality });
  }

  // Watermark
  let buffer = await pipeline.toBuffer();
  buffer = await applyWatermark(buffer);

  // Write output
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, buffer);

  const outputSize = fs.statSync(outputPath).size;
  const ratio = ((1 - outputSize / inputSize) * 100).toFixed(1);

  console.log(`  ✅ ${path.basename(inputPath)}`);
  console.log(`     ${formatSize(inputSize)} → ${formatSize(outputSize)} (—${ratio}%)`);
}

// ─── Main ──────────────────────────────────────────────────
async function main() {
  console.log('\n🖼️  Compress + Watermark\n');

  if (!source) {
    console.error('❌ Masukkan file atau folder sumber.');
    console.log('\nContoh:');
    console.log('  node scripts/compress-watermark.js ./public/gallery ./hd --watermark logo.png --text "Magic Pencil"');
    process.exit(1);
  }

  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Sumber tidak ditemukan: ${sourcePath}`);
    process.exit(1);
  }

  const files = await getFiles(sourcePath);

  if (files.length === 0) {
    console.error('❌ Tidak ada file gambar yang ditemukan.');
    process.exit(1);
  }

  console.log(`📂 ${files.length} file ditemukan`);
  console.log(`📐 Resize: max ${config.width}px (auto height)`);
  console.log(`🎯 Quality: ${config.quality}%`);
  if (config.watermark && fs.existsSync(config.watermark)) {
    console.log(`💧 Watermark: ${path.basename(config.watermark)} @ ${config.position}`);
  }
  if (config.text && config.text.trim()) {
    console.log(`🔤 Text: "${config.text}"`);
  }
  if (!config.watermark && !config.text) {
    console.log(`⚠️  No watermark — kompresi aja`);
  }
  console.log(`📦 Format: ${config.format}`);
  console.log('');

  for (const file of files) {
    const relPath = path.relative(sourcePath, file);
    const outputFile = destPath
      ? path.join(destPath, relPath)
      : file.replace(/(\.\w+)$/, '_compressed$1');

    await processFile(file, outputFile);
  }

  const processedCount = config.dryRun ? files.length : files.filter(f => !config.dryRun).length;
  console.log(`\n✨ Selesai! ${processedCount} file diproses.\n`);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
