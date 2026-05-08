/* =============================================
   ?? HERO SECTION - Bagian Depan Website
   ============================================= */

import Link from "next/link";
import { ArrowRight, Sparkles, Palette, Users } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative gradient-hero text-white overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl"></div>
      <div className="absolute top-[30%] right-[20%] w-[200px] h-[200px] rounded-full bg-accent/10 blur-2xl animate-pulse"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* ===== KIRI: Teks ===== */}
          <div className="animate-slide-up space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Kursus Menggambar &amp; Melukis</span>
            </div>

            {/* Judul Utama */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Kembangkan
              <span className="text-accent"> Kreativitas</span>
              {" "}Anak Anda
            </h1>

            <p className="text-lg text-gray-200 leading-relaxed max-w-lg">
              Tempat belajar menggambar dan melukis yang menyenangkan untuk 
              anak-anak hingga dewasa. Dibimbing pengajar profesional dalam 
              suasana yang kreatif dan inspiratif.
            </p>

            {/* Tombol CTA */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/daftar"
                className="inline-flex items-center gap-2 bg-accent text-primary font-bold px-8 py-3.5 rounded-full hover:bg-accent-light hover:scale-105 transition-all shadow-lg"
              >
                Daftar Sekarang
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#kelas"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-all"
              >
                Lihat Kelas
              </Link>
            </div>

            {/* Statistik */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                <span className="text-sm text-gray-200">100+ Siswa</span>
              </div>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-accent" />
                <span className="text-sm text-gray-200">5 Kelas</span>
              </div>
            </div>
          </div>

          {/* ===== KANAN: Ilustrasi Pencil Art ===== */}
          <div className="hidden md:flex items-center justify-center animate-fade-in">
            <div className="relative w-full max-w-md aspect-[4/3]">
              {/* Decorative blobs */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d96c4a" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#e8896a" stopOpacity="0.08" />
                  </linearGradient>
                  <linearGradient id="g2" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d96c4a" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#e8896a" stopOpacity="0.03" />
                  </linearGradient>
                  <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
                  </linearGradient>
                  <linearGradient id="pencil" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#d96c4a" />
                    <stop offset="40%" stopColor="#e8896a" />
                    <stop offset="40%" stopColor="#1a1a1a" />
                    <stop offset="100%" stopColor="#000000" />
                  </linearGradient>
                  <filter id="shadow">
                    <feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.15" />
                  </filter>
                </defs>

                {/* Blob background */}
                <circle cx="300" cy="50" r="120" fill="url(#g1)" />
                <circle cx="100" cy="250" r="100" fill="url(#g2)" />
                <circle cx="200" cy="150" r="180" fill="url(#g3)" />

                {/* ===== PENCIL ICON ===== */}
                <g transform="translate(80, 60)" filter="url(#shadow)">
                  {/* Pencil body */}
                  <rect x="20" y="10" width="120" height="40" rx="4" fill="url(#pencil)" />
                  {/* Pencil tip (wood) */}
                  <polygon points="140,10 190,30 140,50" fill="#d4a574" />
                  {/* Pencil tip (graphite) */}
                  <polygon points="180,27 190,30 180,33" fill="#333" />
                  {/* Pencil eraser */}
                  <rect x="10" y="12" width="12" height="36" rx="3" fill="#ef4444" />
                  {/* Eraser band */}
                  <rect x="20" y="10" width="6" height="40" fill="#9ca3af" />
                  {/* Pencil stripe */}
                  <rect x="26" y="10" width="3" height="40" fill="#cbd5e1" />
                  {/* Animated sparkle */}
                  <circle cx="160" cy="40" r="3" fill="#e8896a" className="animate-ping" opacity="0.7" />
                  <circle cx="170" cy="15" r="2" fill="#d96c4a" className="animate-ping" opacity="0.5" style={{animationDelay:"0.5s"}} />
                </g>

                {/* ===== COLOR PALLETTE ===== */}
                <g transform="translate(150, 140)" filter="url(#shadow)">
                  {/* Paint palette */}
                  <ellipse cx="60" cy="30" rx="70" ry="40" fill="#f8fafc" />
                  {/* Paint blobs */}
                  <circle cx="30" cy="25" r="10" fill="#ef4444" />
                  <circle cx="55" cy="15" r="10" fill="#3b82f6" />
                  <circle cx="80" cy="20" r="10" fill="#10b981" />
                  <circle cx="95" cy="35" r="10" fill="#d96c4a" />
                  <circle cx="40" cy="42" r="8" fill="#8b5cf6" />
                  {/* Thumb hole */}
                  <ellipse cx="85" cy="45" rx="10" ry="12" fill="#e2e8f0" />
                  {/* Brush */}
                  <line x1="10" y1="0" x2="-20" y2="-30" stroke="#a0aec0" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="-20" cy="-30" r="6" fill="#ef4444" />
                </g>

                {/* ===== DECORATIVE DOTS ===== */}
                <g opacity="0.4">
                  <circle cx="50" cy="40" r="2" fill="#fff" className="animate-pulse" style={{animationDelay:"0.2s"}} />
                  <circle cx="350" cy="80" r="2" fill="#fff" className="animate-pulse" style={{animationDelay:"0.8s"}} />
                  <circle cx="320" cy="220" r="2" fill="#fff" className="animate-pulse" style={{animationDelay:"0.5s"}} />
                  <circle cx="60" cy="200" r="3" fill="#e8896a" className="animate-pulse" style={{animationDelay:"1s"}} />
                  <circle cx="370" cy="150" r="2" fill="#d96c4a" className="animate-pulse" style={{animationDelay:"0.3s"}} />
                  <circle cx="30" cy="120" r="1.5" fill="#fff" className="animate-pulse" style={{animationDelay:"0.7s"}} />
                </g>

                {/* ===== PAPER SHEET ===== */}
                <g transform="translate(210, 10)" opacity="0.9">
                  <rect x="0" y="0" width="65" height="80" rx="3" fill="white" />
                  {/* Sketch lines */}
                  <path d="M12 20 Q20 18 30 22" stroke="#333" strokeWidth="1.5" fill="none" opacity="0.4" />
                  <path d="M12 30 Q25 28 40 33" stroke="#333" strokeWidth="1.5" fill="none" opacity="0.4" />
                  <path d="M12 40 Q30 35 45 42" stroke="#333" strokeWidth="1.5" fill="none" opacity="0.3" />
                  <path d="M12 50 Q22 48 35 52" stroke="#333" strokeWidth="1.5" fill="none" opacity="0.3" />
                  {/* Color splashes */}
                  <circle cx="48" cy="55" r="8" fill="#d96c4a" opacity="0.3" />
                  <circle cx="52" cy="52" r="5" fill="#ef4444" opacity="0.2" />
                  <circle cx="45" cy="58" r="6" fill="#3b82f6" opacity="0.2" />
                  {/* Star */}
                  <text x="28" y="72" textAnchor="middle" fontSize="14" fill="#d96c4a">⭐</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg className="relative block w-full h-[40px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C300,100 700,-100 1200,0 L1200,120 L0,120 Z" fill="#ffffff" />
        </svg>
      </div>
    </section>
  );
}
