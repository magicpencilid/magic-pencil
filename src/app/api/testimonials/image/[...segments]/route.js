// Proxy: /api/testimonials/image/[...segments] — serve foto testimoni dari filesystem
// Hindari Next.js static file 404 cache

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request, props) {
  try {
    const params = await props.params;
    const segments = params.segments || [];
    const filePath = path.join(process.cwd(), "public", "uploads", "testimonials", ...segments);

    // Security check: cuma boleh akses dalam uploads/testimonials/
    const allowedDir = path.join(process.cwd(), "public", "uploads", "testimonials");
    if (!filePath.startsWith(allowedDir)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeMap = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
    const contentType = mimeMap[ext] || "application/octet-stream";

    const buffer = fs.readFileSync(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
