/* =============================================
   KONTAK — Informasi Kontak Magic Pencil
   
   Kartu kontak yang rapi, langsung terhubung.
   ============================================= */

import { Mail, Camera, Music, MessageCircle, MapPin, Phone } from "lucide-react";

const contacts = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+62 811 1199 059",
    href: "https://wa.me/628111199059",
  },
  {
    icon: Mail,
    label: "Email",
    value: "admin@magicpencil.my.id",
    href: "mailto:admin@magicpencil.my.id",
  },
  {
    icon: Camera,
    label: "Instagram",
    value: "@magicpencilid",
    href: "https://instagram.com/magicpencilid",
  },
  {
    icon: Music,
    label: "TikTok",
    value: "@magicpencil.id",
    href: "https://tiktok.com/@magicpencil.id",
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    label: "Facebook",
    value: "facebook.com/magicpencilid",
    href: "https://facebook.com/magicpencilid",
  },
  {
    icon: MapPin,
    label: "Lokasi",
    value: "Indonesia (Bogor, Jakarta)",
    href: null,
  },
];

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-surface-alt">
      {/* ===== HEADER ===== */}
      <div className="gradient-hero py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">
            Kontak
          </h1>
          <p className="text-text-light mt-3 max-w-2xl mx-auto">
            Jika Anda memiliki pertanyaan terkait kelas, pendaftaran, atau informasi lainnya, silakan hubungi kami melalui:
          </p>
        </div>
      </div>

      {/* ===== KONTEN ===== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contacts.map((c) => {
              const Icon = c.icon;
              const content = (
                <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-gray-200 transition-colors">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-text-light uppercase tracking-wider font-medium">
                      {c.label}
                    </p>
                    <p className="text-sm font-medium text-primary truncate">
                      {c.value}
                    </p>
                  </div>
                </div>
              );

              if (c.href) {
                return (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {content}
                  </a>
                );
              }

              return <div key={c.label}>{content}</div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
