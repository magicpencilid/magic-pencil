/* =============================================
   ?? NAVBAR - Navigasi Atas
   Black & White Gallery Style
   ============================================= */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Kelas", href: "/#kelas" },
  { label: "Galeri", href: "/#galeri" },
  { label: "Cek Status", href: "/status" },
  { label: "Masuk", href: "/login" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`bg-white/70 backdrop-blur-md sticky top-0 z-50 font-muli transition-shadow ${
      scrolled ? "shadow-md" : ""
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28">
          
          {/* ===== LOGO (big, no crop!) ===== */}
          <Link href="/" className="block -ml-2">
            <Image
              src="/logo-magicpencil.jpg"
              alt="Magic Pencil"
              width={140}
              height={140}
              className="w-28 h-28 md:w-36 md:h-36 object-contain"
              priority
            />
          </Link>

          {/* ===== DESKTOP MENU ===== */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-text-light hover:text-primary font-medium text-sm tracking-wide uppercase transition-colors after:absolute after:bottom-[-32px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/daftar"
              className="bg-accent/40 text-white px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-accent hover:text-white hover:scale-105 transition-all"
            >
              Daftar Sekarang
            </Link>
          </nav>

          {/* ===== HAMBURGER ===== */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-50 p-2 text-primary hover:text-primary-light transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6 animate-scale-in" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu (no slide, biar WA button gak ketutupan) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="block text-center bg-accent/40 text-white px-5 py-3 rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-accent hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
            <Link href="/daftar" onClick={() => setIsOpen(false)} className="block text-center bg-accent-dark text-white px-5 py-3 rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-primary transition-colors shadow-sm">
              Daftar Sekarang
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
