import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'karaoke.db');
const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    singer TEXT,
    tj_number TEXT,
    lyrics TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Migrations for existing DBs
const columns = db.prepare("PRAGMA table_info(songs)").all().map(c => c.name);
if (!columns.includes('singer')) {
  db.exec('ALTER TABLE songs ADD COLUMN singer TEXT');
}

export default db;
