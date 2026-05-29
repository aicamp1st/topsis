# SPK TOPSIS — Karyawan Terbaik

Sistem Pendukung Keputusan Pemilihan Karyawan Terbaik menggunakan metode **TOPSIS** (Technique for Order of Preference by Similarity to Ideal Solution).

> Aplikasi **100% client-side** — semua data tersimpan di **localStorage browser**, tanpa server & tanpa database. Cocok di-host gratis di **GitHub Pages**.

## Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | SvelteKit 5 (Runes API), SPA / static |
| Penyimpanan | localStorage browser (reactive store) |
| CSS | Tailwind CSS v4 |
| Icons | @lucide/svelte |
| Hosting | GitHub Pages (static) |

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

Logika ada di [`src/lib/topsis.ts`](src/lib/topsis.ts), dijalankan langsung di browser.

## Pengembangan Lokal

```bash
npm install
npm run dev       # buka http://localhost:5173
```

Data contoh otomatis dimuat ke localStorage saat pertama kali dibuka.

## Deploy ke GitHub Pages (gratis, otomatis)

Sudah ada GitHub Actions workflow di [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) yang otomatis build & deploy tiap kali push ke `main`.

**Langkah sekali setup:**

1. Push repo ini ke GitHub (branch `main`).
2. Buka **Settings → Pages** di repo GitHub.
3. Pada **Build and deployment → Source**, pilih **GitHub Actions**.
4. Tunggu workflow selesai (tab **Actions**). Situs live di:
   `https://<username>.github.io/topsis/`

> **Catatan base path:** repo bernama `topsis`, jadi situs disajikan di sub-path `/topsis/`.
> Base path sudah diatur otomatis di [`svelte.config.js`](svelte.config.js) (`/topsis` saat build production).
> Jika nama repo diubah, sesuaikan nilai `base` di file tersebut.

## Build manual

```bash
npm run build     # hasil ada di folder build/
npm run preview   # preview hasil build di http://localhost:4173/topsis
```

## Catatan penyimpanan data

Data (kriteria, karyawan, penilaian) disimpan di **localStorage** per-browser:
- Data **tidak ikut berpindah** antar perangkat / browser.
- Menghapus data browser akan mereset aplikasi ke data contoh.
- Cocok untuk demo, tugas kuliah, dan penggunaan single-user.
