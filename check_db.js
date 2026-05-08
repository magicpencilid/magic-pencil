const Database = require('better-sqlite3');
const path = require('path');
const base = process.cwd();

// Check both possible databases
const paths = [
  path.join(base, 'src', 'lib', 'database.sqlite'),
  path.join(base, 'magic-pencil.db'),
];

paths.forEach(p => {
  const fs = require('fs');
  if (fs.existsSync(p)) {
    const size = fs.statSync(p).size;
    console.log(`\n${p} (${size} bytes):`);
    if (size > 0) {
      try {
        const db = new Database(p);
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        console.log(' Tables:', tables.map(t => t.name).join(', '));
        db.close();
      } catch(e) {
        console.log(' Error:', e.message);
      }
    } else {
      console.log(' (empty)');
    }
  }
});
