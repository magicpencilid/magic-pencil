/* =============================================
   📚 CLASS INFO — Info Kelas Yang Ditawarkan
   
   5 kelas: sketsa, gambar, lukis anabul, sesi sketsa, sesi gambar
   ============================================= */

import { Pencil, Pen, PaintBucket, Palette, Star, UserCheck } from "lucide-react";

const classes = [
  {
    icon: Pencil,
    title: "Kelas Sketsa",
    desc: "Menyeket beragam objek diajarkan disini agar peserta mahir membuat bentuk global sebagai pondasi membuat drawing.",
    details: [
      "2 minggu pertama: total menyeket bentuk global berbagai objek",
      "2 minggu berikutnya: materi arsir sebagai persiapan ke kelas drawing",
    ],
    duration: "2 jam menyeket • 4 kali / bulan",
    timeNote: "Durasi waktu fleksibel",
  },
  {
    icon: Pen,
    title: "Kelas Gambar",
    desc: "Pada kelas drawing akan diberikan materi mulai dari mengarsir volume membentuk 3D, proporsi, depth, hingga komposisi.",
    details: [
      "Drawing benda solid",
      "Drawing pohon / panorama",
      "Drawing rumah / bangunan",
      "Drawing wajah",
    ],
    duration: "2 jam menggambar • 4 kali / bulan",
    timeNote: "Durasi waktu fleksibel",
  },
  {
    icon: UserCheck,
    title: "Kelas Private",
    subtitle: '"Belajar 1-on-1, materi sesuai kebutuhanmu"',
    desc: "Kelas private dengan bimbingan penuh dari pengajar. Materi, jadwal, dan durasi bisa disesuaikan dengan kebutuhan dan tujuan kamu.",
    details: [
      "Pilih sendiri tema yang ingin dipelajari",
      "Bimbingan intensif 1-on-1 dengan pengajar",
    ],
    duration: "2 jam • sesuai kebutuhan",
    adminNote: "Silahkan hubungi admin untuk keterangan lebih lanjut",
  },
  {
    icon: Star,
    title: "Sesi Sketsa",
    subtitle: '"Sketsa yang kamu mau"',
    desc: "Sketsa sesuai keinginanmu, dibimbing langsung.",
    details: [
      "Kertas gambar",
      "Pensil",
      "Penghapus",
    ],
    duration: "2 jam menyeket • 1 kali sesi",
    timeNote: "Durasi waktu fleksibel",
  },
  {
    icon: Palette,
    title: "Sesi Gambar",
    subtitle: '"Gambar yang kamu suka"',
    desc: "Gambar apapun yang kamu suka, kita bantu wujudkan.",
    details: [
      "Kertas gambar",
      "Pensil",
      "Penghapus",
    ],
    duration: "2 jam menggambar • 1 kali sesi",
    timeNote: "Durasi waktu fleksibel",
  },
  {
    icon: PaintBucket,
    title: "Sesi Lukis Anabul",
    subtitle: '"Kenapa tidak kamu lukis sendiri anabulmu?"',
    desc: "Lukis anabul kesayanganmu dengan bimbingan langsung.",
    details: [
      "Kanvas 25x25",
      "Kuas",
      "Cat akrilik",
    ],
    duration: "2 jam melukis • 1 kali sesi",
    timeNote: "Durasi waktu fleksibel",
  },
];

export default function ClassInfo() {
  return (
    <section id="kelas" className="py-20 bg-surface-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
            Kelas Magic Pencil
          </h2>
          <p className="text-text-light max-w-2xl mx-auto font-light tracking-wide">
            Pilihan kelas yang gembira dan menyenangkan
          </p>
          <div className="w-16 h-0.5 bg-primary mx-auto mt-4 opacity-30" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {classes.map((kelas, index) => {
            const Icon = kelas.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100 flex flex-col">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-display font-bold text-primary mb-1">{kelas.title}</h3>
                {kelas.subtitle && (
                  <p className="text-text-light text-sm italic mb-2">{kelas.subtitle}</p>
                )}

                {/* Description */}
                <p className="text-text-light text-sm mb-4 leading-relaxed">{kelas.desc}</p>

                {/* Details list */}
                {kelas.details && (
                  <ul className="space-y-1.5 mb-4">
                    {kelas.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Admin note */}
                {kelas.adminNote && (
                  <p className="text-sm font-bold text-primary mb-4 text-center">
                    {kelas.adminNote}
                  </p>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Duration */}
                <div className="border-t border-gray-100 pt-4 mt-2 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-text-light">
                    <span>{kelas.duration}</span>
                  </div>
                  {kelas.timeNote && (
                    <p className="text-xs text-gray-400">{kelas.timeNote}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
