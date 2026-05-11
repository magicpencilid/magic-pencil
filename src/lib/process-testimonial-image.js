// Process Testimonial Image — B&W (greyscale) + resize + kompresi
// Pake Jimp v1

const fs = require("fs");
const path = require("path");

async function processTestimonialImage(inputBuffer) {
  const { Jimp } = await import("jimp");

  // Memory limit untuk foto HP
  if (Jimp.decoders) {
    if (Jimp.decoders["image/jpeg"]) Jimp.decoders["image/jpeg"].maxMemoryUsageInMB = 512;
    if (Jimp.decoders["image/png"]) Jimp.decoders["image/png"].maxMemoryUsageInMB = 512;
  }

  const image = await Jimp.read(inputBuffer);

  // Resize — foto testimoni cukup 300px (bulat kecil)
  const maxSize = 300;
  if (image.bitmap.width > maxSize || image.bitmap.height > maxSize) {
    const ratio = Math.min(maxSize / image.bitmap.width, maxSize / image.bitmap.height);
    image.resize({ w: Math.round(image.bitmap.width * ratio) });
  }

  // Convert ke Black & White (greyscale)
  image.greyscale();

  // Crop kotak dari tengah (biar pas dibikin bulat di CSS)
  const size = Math.min(image.bitmap.width, image.bitmap.height);
  const x = Math.round((image.bitmap.width - size) / 2);
  const y = Math.round((image.bitmap.height - size) / 2);
  image.crop({ x, y, w: size, h: size });

  // Simpan
  const uploadDir = path.join(process.cwd(), "public", "uploads", "testimonials");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const filename = `testimonial-${Date.now()}.jpg`;
  const outputPath = path.join(uploadDir, filename);
  await image.write(outputPath);

  return { filename, path: outputPath };
}

module.exports = { processTestimonialImage };
