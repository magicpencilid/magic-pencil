/* =============================================
   🗓️ JADWAL OPSI — Kelola Hari & Jam
   
   FIXED — 3 slot waktu tetap.
   ============================================= */

"use client";

import { Clock } from "lucide-react";

const fixedSlots = [
  { day: "Senin — Sabtu", time: "10:00 - 12:00" },
  { day: "Senin — Sabtu", time: "13:00 - 15:00" },
  { day: "Senin — Sabtu", time: "15:00 - 17:00" },
];

export default function JadwalOpsiAdmin() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Clock className="w-6 h-6 text-gray-500" />
          Kelola Hari & Jam
        </h1>
        <p className="text-sm text-text-light mt-1">
          Jadwal yang tersedia untuk dipilih pendaftar — bersifat tetap.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="space-y-3">
          {fixedSlots.map((slot, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-sm font-medium text-primary">{slot.day}</span>
              </div>
              <span className="text-sm font-semibold text-primary bg-white px-4 py-1.5 rounded-lg border border-gray-200">
                {slot.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-text-light mt-6">
        <p className="font-semibold mb-1 text-gray-700">Informasi:</p>
        <p>• Jadwal bersifat tetap dan tidak bisa diubah dari sini.</p>
        <p>• Hubungi developer jika ada perubahan data jadwal.</p>
      </div>
    </div>
  );
}
