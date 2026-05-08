const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(process.cwd(), 'src', 'lib', 'database.sqlite'));

// Schedule config
db.prepare('DELETE FROM schedule_config').run();

const jam = ['10:00 - 12:00', '13:00 - 15:00', '15:00 - 17:00'];
jam.forEach((j, i) => {
  db.prepare('INSERT INTO schedule_config (type, value, sort_order) VALUES (?, ?, ?)').run('jam', j, i + 1);
});

const hari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
hari.forEach((h, i) => {
  db.prepare('INSERT INTO schedule_config (type, value, sort_order) VALUES (?, ?, ?)').run('hari', h, i + 1);
});

console.log('Schedule config updated');
console.table(db.prepare('SELECT * FROM schedule_config ORDER BY type, sort_order').all());
db.close();
