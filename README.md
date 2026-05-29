# SPK TOPSIS — Karyawan Terbaik

Sistem Pendukung Keputusan Pemilihan Karyawan Terbaik menggunakan metode **TOPSIS** (Technique for Order of Preference by Similarity to Ideal Solution).

## Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend + Backend | SvelteKit 5 (Runes API) |
| Database | libSQL / SQLite via Drizzle ORM (lokal: file, produksi: Turso) |
| CSS | Tailwind CSS v4 |
| Icons | @lucide/svelte |
| Runtime | Node.js / Vercel |

## Fitur

- **Kriteria** — CRUD kriteria dengan bobot dan tipe (benefit/cost), validasi total bobot = 1.00
- **Karyawan** — CRUD data kandidat karyawan
- **Penilaian** — Matriks penilaian interaktif (nilai 1–10 per karyawan per kriteria)
- **Hasil TOPSIS** — Peringkat lengkap dengan step-by-step kalkulasi (5 langkah TOPSIS)

## Algoritma TOPSIS

1. Matriks keputusan
2. Normalisasi vektor: `r[i][j] = x[i][j] / √(Σ x[k][j]²)`
3. Matriks berbobot: `v[i][j] = w[j] × r[i][j]`
4. Solusi ideal positif A⁺ dan negatif A⁻
5. Jarak Euclidean D⁺ dan D⁻
6. Koefisien kedekatan: `Ci = D⁻ / (D⁺ + D⁻)`
7. Peringkat berdasarkan Ci tertinggi

## Pengembangan Lokal

```bash
npm install
npm run db:seed   # isi data contoh ke file:local.db
npm run dev       # buka http://localhost:5173
```

## Deploy ke Production (Vercel + Turso) — Gratis

### 1. Buat database Turso (gratis, tanpa kartu kredit)

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login (buka browser, login pakai GitHub)
turso auth login

# Buat database
turso db create topsis

# Ambil URL database  -> simpan sebagai DATABASE_URL
turso db show topsis --url

# Buat auth token   -> simpan sebagai DATABASE_AUTH_TOKEN
turso db tokens create topsis
```

### 2. Set environment variables di Vercel

Di dashboard Vercel project → **Settings → Environment Variables**, tambahkan:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `libsql://topsis-xxxx.turso.io` (dari langkah 1) |
| `DATABASE_AUTH_TOKEN` | token dari langkah 1 |

### 3. Deploy

- Import repo GitHub ini ke [vercel.com/new](https://vercel.com/new)
- Framework otomatis terdeteksi sebagai **SvelteKit**
- Klik **Deploy**

Tabel database otomatis dibuat saat request pertama (lihat `src/hooks.server.ts` → `ensureSchema()`).

### 4. (Opsional) Isi data awal ke Turso

```bash
# Set env lokal ke Turso lalu seed sekali
DATABASE_URL="libsql://topsis-xxxx.turso.io" \
DATABASE_AUTH_TOKEN="<token>" \
npm run db:seed
```

## Database Schema (Drizzle)

Migrasi ada di `drizzle/`. Untuk apply manual ke Turso:

```bash
npm run db:push     # sinkronkan schema ke DATABASE_URL aktif
npm run db:studio   # buka Drizzle Studio (GUI database)
```
