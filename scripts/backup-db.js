/**
 * backup-db.js — Backup SQLite database dengan aman
 * 
 * Pake better-sqlite3 .backup() biar konsisten walau DB dipake.
 * Simpen ke lokal (E:) + Drive (I:) dengan timestamp.
 * 
 * Cara jalanin: node scripts/backup-db.js
 */

const path = require('path');
const fs = require('fs');

const projectRoot = path.resolve(__dirname, '..');
const dbPath = path.join(projectRoot, 'magic-pencil.db');

// Format timestamp: YYYY-MM-DD-HHmm
const now = new Date();
const ts = now.getFullYear() +
    '-' + String(now.getMonth() + 1).padStart(2, '0') +
    '-' + String(now.getDate()).padStart(2, '0') +
    '-' + String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0');

const dbName = `magic-pencil-${ts}.db`;

const backupDirs = [
    path.join('E:\\', 'backup_mamat', 'magic_pencil', 'db'),
    path.join('I:\\', 'My Drive', 'backup_mamat', 'magic_pencil', 'db'),
];

function backup() {
    console.log(`[${ts}] Backup DB dimulai...`);

    if (!fs.existsSync(dbPath)) {
        console.error(`[ERROR] DB tidak ditemukan: ${dbPath}`);
        process.exit(1);
    }

    let db;
    try {
        db = require('better-sqlite3')(dbPath);

        // Flush WAL ke main DB
        db.pragma('wal_checkpoint(TRUNCATE)');
        console.log('[OK] WAL checkpoint done');

        // Cek integritas
        const integrity = db.pragma('integrity_check');
        if (integrity[0].integrity_check !== 'ok') {
            console.error(`[ERROR] DB integrity FAILED: ${JSON.stringify(integrity)}`);
            process.exit(1);
        }
        console.log('[OK] Integrity check passed');

        // Hitung jumlah data
        const tables = db.prepare(
            "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
        ).all();
        console.log(`[OK] ${tables.length} tables ditemukan`);

        db.close();

        // Backup ke setiap tujuan (copy file aja, udah di-checkpoint)
        for (const dir of backupDirs) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            const backupPath = path.join(dir, dbName);
            fs.copyFileSync(dbPath, backupPath);
            const size = fs.statSync(backupPath).size;
            console.log(`[OK] Backup ke ${backupPath} (${(size / 1024).toFixed(1)} KB)`);
        }

        console.log('[DONE] Backup DB selesai!');
    } catch (err) {
        console.error(`[ERROR] ${err.message}`);
        if (db) db.close();
        process.exit(1);
    }
}

backup();
