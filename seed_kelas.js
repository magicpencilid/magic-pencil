const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join('C:\\Users\\willy\\DW Works\\Magicpencil\\Pencil Web\\magic-pencil-app', 'magic-pencil.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

const classes = [
  { name: 'Melukis Akrilik', price: 500000, description: 'Teknik melukis dengan cat akrilik di atas kanvas' },
  { name: 'Sketsa & Drawing', price: 400000, description: 'Dasar-dasar menggambar dengan pensil dan arsiran' },
  { name: 'Mewarnai Anak', price: 350000, description: 'Mewarnai gambar untuk anak-anak (usia 3-8 tahun)' },
  { name: 'Ilustrasi Digital', price: 600000, description: 'Menggambar digital menggunakan tablet' },
  { name: 'Cat Air', price: 450000, description: 'Teknik melukis dengan cat air' },
  { name: 'Kelas Private', price: 800000, description: 'Bimbingan personal 1-on-1 dengan pengajar' },
];

const stmt = db.prepare("INSERT OR IGNORE INTO kelas (name, price, description) VALUES (@name, @price, @description)");
let count = 0;
for (const k of classes) {
  const r = stmt.run(k);
  if (r.changes > 0) count++;
}
console.log(`Seeded ${count} classes`);

const rows = db.prepare('SELECT * FROM kelas').all();
console.log('Total classes:', rows.length, rows.map(r => `${r.name}: Rp ${r.price}`));

db.close();
