import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

// Lokal: file:local.db  |  Produksi (Turso): libsql://<db>.turso.io
const url = process.env.DATABASE_URL ?? 'file:local.db'
const authToken = process.env.DATABASE_AUTH_TOKEN

export const client = createClient({ url, authToken })

export const db = drizzle(client, { schema })

// Auto-migrate: buat tabel jika belum ada (idempoten, aman dipanggil berulang)
let ready: Promise<void> | null = null
export function ensureSchema(): Promise<void> {
  if (!ready) {
    ready = client
      .executeMultiple(`
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
      .then(() => undefined)
  }
  return ready
}
