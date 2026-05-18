/* =============================================
   API: /api/produk/image/[...segments]
   Proxy buat serve gambar produk — biar gak kena cache issue Next.js
   ============================================= */

import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(_, props) {
  try {
    const p = await props.params;
    const segments = p.segments || [];
    const filePath = path.join(process.cwd(), "public", ...segments);

    // Security: cuma serve dari uploads/produk/
    const resolved = path.resolve(filePath);
    const allowed = path.resolve(process.cwd(), "public", "uploads", "produk");
    if (!resolved.startsWith(allowed)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (!existsSync(resolved)) {
      return new NextResponse("Not found", { status: 404 });
    }

    const buffer = await readFile(resolved);
    const ext = path.extname(resolved).toLowerCase();
    const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Error serving produk image:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
