/* =============================================
   🗄️ DATABASE — Koneksi SQLite + Schema
   
   Pake better-sqlite3 — library SQLite buat Node.js.
   Cepet, synchronous, ngga perlu async/await.
   
   Database file: magic-pencil.db di root project.
   ============================================= */

import Database from "better-sqlite3";
import path from "path";

/* Koneksi database — singleton biar ngga buat koneksi baru tiap request */
let db;

export function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), "magic-pencil.db");
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL"); // mode write-ahead log — lebih cepat
    db.pragma("foreign_keys = ON");
    initTables();
  }
  return db;
}

/* =============================================
   Buat tabel kalo belum ada
   ============================================= */
function initTables() {
  // Semua DDL pake SATU db.exec biar Turbopack gak merge sama migration try/catch
  db.exec(`
    CREATE TABLE IF NOT EXISTS pendaftar (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      participant_name TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      email TEXT,
      age INTEGER NOT NULL,
      alamat TEXT,
      class_name TEXT NOT NULL,
      source TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'baru',
      agree_terms INTEGER NOT NULL DEFAULT 0,
      agree_terms_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS jadwal (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      registration_id INTEGER NOT NULL,
      class_name TEXT NOT NULL,
      schedule_date TEXT,
      schedule_time TEXT,
      teacher_name TEXT,
      location TEXT,
      meeting_link TEXT,
      notes TEXT,
      sent_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (registration_id) REFERENCES pendaftar(id)
    );

    CREATE TABLE IF NOT EXISTS invoice (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      registration_id INTEGER NOT NULL,
      invoice_number TEXT NOT NULL UNIQUE,
      amount REAL NOT NULL,
      payment_due_date TEXT,
      payment_status TEXT NOT NULL DEFAULT 'pending',
      invoice_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (registration_id) REFERENCES pendaftar(id)
    );

    CREATE TABLE IF NOT EXISTS pembayaran (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      registration_id INTEGER NOT NULL,
      invoice_id INTEGER,
      file_url TEXT,
      uploaded_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      verified_at TEXT,
      verified_by TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      admin_note TEXT,
      FOREIGN KEY (registration_id) REFERENCES pendaftar(id),
      FOREIGN KEY (invoice_id) REFERENCES invoice(id)
    );

    CREATE TABLE IF NOT EXISTS kelas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      price REAL NOT NULL DEFAULT 0,
      type TEXT NOT NULL DEFAULT 'monthly',
      duration TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS schedule_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      value TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS notifikasi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      registration_id INTEGER NOT NULL,
      channel TEXT NOT NULL,
      recipient TEXT NOT NULL,
      message_type TEXT,
      message_body TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      sent_at TEXT,
      FOREIGN KEY (registration_id) REFERENCES pendaftar(id)
    );

    CREATE TABLE IF NOT EXISTS akun_murid (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      murid_id INTEGER NOT NULL UNIQUE,
      email TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (murid_id) REFERENCES pendaftar(id)
    );

    CREATE TABLE IF NOT EXISTS absensi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      murid_id INTEGER NOT NULL,
      jadwal_id INTEGER,
      check_in TEXT,
      check_out TEXT,
      status TEXT NOT NULL DEFAULT 'belum',
      tanggal TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (murid_id) REFERENCES pendaftar(id),
      FOREIGN KEY (jadwal_id) REFERENCES jadwal(id)
    );

    CREATE TABLE IF NOT EXISTS karya_murid (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      murid_id INTEGER NOT NULL,
      judul TEXT NOT NULL,
      deskripsi TEXT,
      kelas TEXT,
      image_path TEXT NOT NULL,
      is_public INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'private',
      approved_by TEXT,
      approved_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (murid_id) REFERENCES pendaftar(id)
    );

    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_type TEXT NOT NULL DEFAULT 'murid',
      user_id INTEGER,
      endpoint TEXT NOT NULL UNIQUE,
      auth TEXT NOT NULL,
      p256dh TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS gallery_photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      deskripsi TEXT,
      image_path TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      teks TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 5,
      photo_path TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // Migrasi: tambah kolom kalo belum ada (untuk DB lama)
  try { db.exec("ALTER TABLE pendaftar ADD COLUMN alamat TEXT"); } catch {}
  try { db.exec("ALTER TABLE pendaftar ADD COLUMN agree_terms INTEGER NOT NULL DEFAULT 0"); } catch (e) { /* kolom udah ada */ }
  try { db.exec("ALTER TABLE pendaftar ADD COLUMN agree_terms_at TEXT"); } catch (e) { /* kolom udah ada */ }
  try { db.exec("ALTER TABLE kelas ADD COLUMN type TEXT NOT NULL DEFAULT 'monthly'"); } catch (e) { /* kolom udah ada */ }

  // Seed data kelas (kalo tabelnya baru dibuat)
  const kelasCount = db.prepare("SELECT COUNT(*) as count FROM kelas").get();
  if (kelasCount.count === 0) {
    const seedClasses = [
      { name: "Melukis Akrilik", price: 500000, description: "Teknik melukis dengan cat akrilik di atas kanvas" },
      { name: "Sketsa & Drawing", price: 400000, description: "Dasar-dasar menggambar dengan pensil dan arsiran" },
      { name: "Mewarnai Anak", price: 350000, description: "Mewarnai gambar untuk anak-anak (usia 3-8 tahun)" },
      { name: "Ilustrasi Digital", price: 600000, description: "Menggambar digital menggunakan tablet" },
      { name: "Cat Air", price: 450000, description: "Teknik melukis dengan cat air" },
      { name: "Kelas Private", price: 800000, description: "Bimbingan personal 1-on-1 dengan pengajar" },
    ];
    const ins = db.prepare("INSERT INTO kelas (name, price, description) VALUES (@name, @price, @description)");
    for (const k of seedClasses) ins.run(k);
  }

  // Seed data schedule config (hari & jam)
  const schedCount = db.prepare("SELECT COUNT(*) as count FROM schedule_config").get();
  if (schedCount.count === 0) {
    const hari = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
    const jam = ["09:00-11:00","10:00-12:00","14:00-16:00","16:00-18:00"];
    const insHari = db.prepare("INSERT INTO schedule_config (type, value, sort_order) VALUES ('hari', ?, ?)");
    const insJam = db.prepare("INSERT INTO schedule_config (type, value, sort_order) VALUES ('jam', ?, ?)");
    hari.forEach((h, i) => insHari.run(h, i));
    jam.forEach((j, i) => insJam.run(j, i));
  }
}
