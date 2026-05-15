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

    db.prepare("INSERT INTO akun_murid (murid_id, email, password_hash) VALUES (?, ?, ?)").run(
      regId,
      loginEmail,
      passwordHash
    );

    /* 3b️⃣ Simpan jadwal pilihan kalo ada */
    if (body.pilihHari && body.pilihJam) {
      db.prepare(`
        INSERT INTO jadwal (registration_id, class_name, schedule_date, schedule_time)
        VALUES (@registration_id, @class_name, @schedule_date, @schedule_time)
      `).run({
        registration_id: regId,
        class_name: body.className,
        schedule_date: body.pilihHari,
        schedule_time: body.pilihJam,
      });
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

    /* 4️⃣ Kirim response sukses — include akun credentials */
    return NextResponse.json({
      success: true,
      data: {
        id: regId,
        message: "Pendaftaran berhasil!",
        akun: {
          email: loginEmail,
          password: rawPassword,
        },
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
