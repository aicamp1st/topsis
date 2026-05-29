import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

const DB_PATH = process.env.DATABASE_URL ?? 'local.db'

const sqlite = new Database(DB_PATH)
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('foreign_keys = ON')

export const db = drizzle(sqlite, { schema })

// Auto-migrate on startup (creates tables if not exist)
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS criteria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    weight REAL NOT NULL,
    type TEXT NOT NULL DEFAULT 'benefit',
    description TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT NOT NULL,
    employee_id TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_id INTEGER NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    criteria_id INTEGER NOT NULL REFERENCES criteria(id) ON DELETE CASCADE,
    value REAL NOT NULL DEFAULT 0,
    UNIQUE(candidate_id, criteria_id)
  );
`)
