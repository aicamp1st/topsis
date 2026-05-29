# SPK TOPSIS — Karyawan Terbaik

Sistem Pendukung Keputusan Pemilihan Karyawan Terbaik menggunakan metode **TOPSIS** (Technique for Order of Preference by Similarity to Ideal Solution).

## Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend + Backend | SvelteKit 5 (Runes API) |
| Database | SQLite via Drizzle ORM |
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
npm run db:seed   # isi data contoh
npm run dev       # buka http://localhost:5173
```

## Deploy ke Vercel

1. Ganti adapter ke `@sveltejs/adapter-vercel` (sudah terpasang)
2. Ganti database ke [Turso](https://turso.tech) (cloud SQLite):
   ```bash
   npm install @libsql/client drizzle-orm
   ```
   Update `DATABASE_URL` di Vercel environment variables ke Turso URL.
