/* =============================================
   ROOT LAYOUT — Template untuk semua halaman
   
   - Navbar + Footer cuma muncul di halaman public
   - Halaman admin pake sidebar sendiri (no navbar/footer)
   - Google Fonts: Playfair Display (display) + Inter (body)
   ============================================= */

import LayoutShell from "@/components/LayoutShell";
import WhatsAppButton from "@/components/WhatsAppButton";
import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "Magic Pencil | Kursus Menggambar & Melukis",
  description:
    "Kursus menggambar dan melukis untuk anak-anak hingga dewasa. Kembangkan kreativitas dengan bimbingan pengajar profesional.",
  icons: {
    icon: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  openGraph: {
    title: "Magic Pencil | Kursus Menggambar & Melukis",
    description:
      "Kursus menggambar dan melukis untuk anak-anak hingga dewasa. Kembangkan kreativitas dengan bimbingan pengajar profesional.",
    url: "https://magicpencil.my.id",
    siteName: "Magic Pencil",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Script
          id="schema-local-business"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Magic Pencil",
              description:
                "Kursus menggambar dan melukis untuk anak-anak hingga dewasa. Kembangkan kreativitas dengan bimbingan pengajar profesional.",
              url: "https://magicpencil.my.id",
              email: "admin@magicpencil.my.id",
              telephone: "+628111199059",
              areaServed: ["Bogor", "Jakarta"],
              address: {
                "@type": "PostalAddress",
                addressCountry: "ID",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <LayoutShell>{children}</LayoutShell>
        <WhatsAppButton />
      </body>
    </html>
  );
}
