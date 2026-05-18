/* =============================================
   ?? FOOTER - Info Kontak
   White & Grey Theme, Monochrome
   ============================================= */

import { Globe, Mail, Monitor, MessageCircle, Camera, Music, Facebook } from "lucide-react";
import Link from "next/link";

const quickLinks = [
  { label: "Beranda", href: "/" },
  { label: "Kelas", href: "/#kelas" },
  { label: "Galeri", href: "/#galeri" },
  { label: "Pendaftaran", href: "/daftar" },
  { label: "Cek Status", href: "/status" },
  { label: "Admin", href: "/admin/login" },
];

const contacts = [
  { icon: MessageCircle, text: "+62 811 1199 059", href: "https://wa.me/628111199059" },
  { icon: Mail, text: "admin@magicpencil.my.id", href: "mailto:admin@magicpencil.my.id" },
  { icon: Monitor, text: "magicpencil.my.id", href: "https://magicpencil.my.id" },
  { icon: Camera, text: "@magicpencilid", href: "https://instagram.com/magicpencilid" },
  { icon: Music, text: "@magicpencil.id", href: "https://tiktok.com/@magicpencil.id" },
  { icon: Facebook, text: "Magic Pencil", href: "https://facebook.com/magicpencilid" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-alt border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          
          {/* ===== COL 1: Link Cepat ===== */}
          <div>
            <h3 className="font-display font-bold text-lg text-primary mb-4">Link Cepat</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-text-light hover:text-primary text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== COL 2: Kontak ===== */}
          <div>
            <h3 className="font-display font-bold text-lg text-primary mb-4">Kontak</h3>
            <ul className="space-y-3">
              {contacts.map((c) => {
                const Icon = c.icon;
                return (
                  <li key={c.text}>
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-sm text-text-light hover:text-primary transition-colors">
                      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{c.text}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* ===== COPYRIGHT BAR ===== */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <p className="text-text-light text-sm">&copy; {year} Magic Pencil</p>
        </div>
      </div>
    </footer>
  );
}
