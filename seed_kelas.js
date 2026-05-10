const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join('C:\\Users\\willy\\DW Works\\Magicpencil\\Pencil Web\\magic-pencil-app', 'magic-pencil.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

const classes = [
  { name: 'Kelas Sketsa', price: 1000000, type: 'monthly', description: 'Belajar menyeket bentuk global sebagai pondasi drawing' },
  { name: 'Kelas Gambar', price: 1000000, type: 'monthly', description: 'Mengarsir volume, proporsi, depth, hingga komposisi' },
  { name: 'Kelas Private', price: 0, type: 'monthly', description: 'Bimbingan personal 1-on-1 dengan pengajar. Materi, jadwal, dan durasi bisa disesuaikan.' },
  { name: 'Sesi Lukis Anabul', price: 350000, type: 'single', description: 'Lukis anabul kesayanganmu — 1x sesi, alat lengkap' },
  { name: 'Sesi Sketsa', price: 300000, type: 'single', description: 'Sketsa sesuai keinginanmu — 1x sesi, alat lengkap' },
  { name: 'Sesi Gambar', price: 300000, type: 'single', description: 'Gambar apapun yang kamu suka — 1x sesi, alat lengkap' },
];

const stmt = db.prepare("INSERT OR IGNORE INTO kelas (name, price, type, description) VALUES (@name, @price, @type, @description)");
let count = 0;
for (const k of classes) {
  const r = stmt.run(k);
  if (r.changes > 0) count++;
}
console.log(`Seeded ${count} classes`);

const rows = db.prepare('SELECT * FROM kelas').all();
console.log('Total classes:', rows.length, rows.map(r => `${r.name}: ${r.type} — ${r.price > 0 ? 'IDR '+r.price.toLocaleString('id-ID') : 'Hubungi Admin'}`));

db.close();
