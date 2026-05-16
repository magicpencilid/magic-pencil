/* =============================================
   📡 API: POST /api/register
   
   Fungsi: Menerima data pendaftaran dari form
   dan menyimpannya ke database SQLite.
   
   Di Next.js App Router:
   - route.js di folder api/register/ → /api/register
   - export async function POST(request) = handle POST request
   - Response.json() = kirim response JSON
   ============================================= */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import { sendPushNotification } from "@/lib/push";
import { sendTelegram } from "@/lib/telegram";
import { hashPassword, generatePassword, generateEmail } from "@/lib/auth-murid";

export async function POST(request) {
  try {
    /* 1️⃣ Ambil data dari request body */
    const body = await request.json();
    
    /* 2️⃣ Validasi data */
    const errors = [];
    if (!body.fullName?.trim()) errors.push("Nama lengkap wajib diisi");
    if (!body.participantName?.trim()) errors.push("Nama peserta wajib diisi");
    if (!body.whatsapp?.trim()) errors.push("Nomor WA wajib diisi");
    if (!body.age || body.age < 3 || body.age > 99) errors.push("Usia harus antara 3-99");
    if (!body.className) errors.push("Pilih kelas");

    if (!body.agreeTerms) errors.push("Anda harus menyetujui Syarat & Ketentuan");

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    /* 3️⃣ Simpan ke database */
    const db = getDb();
    
    const now = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
    
    const stmt = db.prepare(`
      INSERT INTO pendaftar (full_name, participant_name, whatsapp, email, age, alamat, class_name, source, notes, agree_terms, agree_terms_at)
      VALUES (@fullName, @participantName, @whatsapp, @email, @age, @alamat, @className, @source, @notes, @agreeTerms, @agreeTermsAt)
    `);

    const result = stmt.run({
      fullName: body.fullName.trim(),
      participantName: body.participantName.trim(),
      whatsapp: body.whatsapp.trim(),
      email: body.email?.trim() || null,
      age: Number(body.age),
      alamat: body.alamat?.trim() || null,
      className: body.className,
      source: body.source || null,
      notes: body.notes?.trim() || null,
      agreeTerms: body.agreeTerms ? 1 : 0,
      agreeTermsAt: now,
    });

    const regId = result.lastInsertRowid;

    /* 🔐 Auto-create akun murid */
    const rawPassword = generatePassword();
    const passwordHash = hashPassword(rawPassword);

    // Login email = email yang diisi user waktu daftar
    let loginEmail = body.email?.trim();
    if (!loginEmail || !loginEmail.includes("@")) {
      // Fallback kalo user gak isi email
      loginEmail = generateEmail(body.participantName || body.fullName, db);
    } else {
      // Unik-in kalo email udah dipake akun lain
      const emailExists = db.prepare("SELECT id FROM akun_murid WHERE email = ?").get(loginEmail);
      if (emailExists) {
        const [local, domain] = loginEmail.split("@");
        let counter = 1;
        while (db.prepare("SELECT id FROM akun_murid WHERE email = ?").get(`${local}${counter}@${domain}`)) {
          counter++;
        }
        loginEmail = `${local}${counter}@${domain}`;
      }
    }

    db.prepare("INSERT INTO akun_murid (murid_id, email, password_hash, password_plain) VALUES (?, ?, ?, ?)").run(
      regId,
      loginEmail,
      passwordHash,
      rawPassword
    );

    /* 3b️⃣ Auto-generate jadwal berdasarkan tipe kelas
      - Monthly (kelas sketsa/gambar): 4 pertemuan, 1x/minggu
      - Sesi: 1 pertemuan aja */
    if (body.pilihHari && body.pilihJam) {
      // Cek tipe kelas dari DB
      const kelasInfo = db.prepare("SELECT type FROM kelas WHERE name = ?").get(body.className);
      const isMonthly = kelasInfo?.type === 'monthly';
      const meetingCount = isMonthly ? 4 : 1;

      // Ambil lokasi default
      const defaultLoc = db.prepare("SELECT value FROM schedule_config WHERE type = 'default_location' LIMIT 1").get();
      const defaultLocation = defaultLoc?.value || '';

      // Map nama hari ke number (0=Minggu)
      const hariMap = {"Minggu":0,"Senin":1,"Selasa":2,"Rabu":3,"Kamis":4,"Jumat":5,"Sabtu":6};
      const targetDay = hariMap[body.pilihHari];

      if (targetDay !== undefined) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentDay = today.getDay(); // 0=Minggu
        let diff = targetDay - currentDay;
        if (diff < 0) diff += 7; // Kalo hari udah lewat, cari minggu depan

        const insertJadwal = db.prepare(`
          INSERT INTO jadwal (registration_id, class_name, schedule_date, schedule_time, meeting_number, location)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        for (let i = 0; i < meetingCount; i++) {
          const jadwalDate = new Date(today);
          jadwalDate.setDate(today.getDate() + diff + (i * 7));
          const yyyy = jadwalDate.getFullYear();
          const mm = String(jadwalDate.getMonth() + 1).padStart(2, '0');
          const dd = String(jadwalDate.getDate()).padStart(2, '0');
          const dateStr = `${yyyy}-${mm}-${dd}`;

          insertJadwal.run(regId, body.className, dateStr, body.pilihJam, i + 1, defaultLocation || null);
        }
      }
    }

    /* 3c️⃣ Kirim notifikasi ke admin via push + telegram */
    const notifText = `📝 ${body.fullName} — ${body.participantName} (${body.age} th) daftar ${body.className}`;
    sendPushNotification({
      title: "📝 Pendaftar Baru",
      body: notifText,
      url: "/admin/pendaftar",
      userType: "admin",
    }).catch(() => {});
    sendTelegram(notifText).catch(() => {});

    /* 4️⃣ Kirim response sukses (tanpa akun — ditampilkan setelah bayar) */
    return NextResponse.json({
      success: true,
      data: {
        id: regId,
        message: "Pendaftaran berhasil!",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, errors: ["Terjadi kesalahan server"] },
      { status: 500 }
    );
  }
}
