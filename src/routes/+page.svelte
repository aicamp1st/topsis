<script lang="ts">
  import { BarChart3, ClipboardList, LayoutGrid, Trophy, Users } from '@lucide/svelte'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()

  const steps = [
    {
      num: '01',
      title: 'Tentukan Kriteria',
      desc: 'Tambahkan kriteria penilaian beserta bobot dan tipe (benefit/cost)',
      href: '/kriteria',
      icon: LayoutGrid,
      color: 'text-violet-600 bg-violet-50',
    },
    {
      num: '02',
      title: 'Daftarkan Karyawan',
      desc: 'Masukkan data karyawan yang akan dinilai',
      href: '/karyawan',
      icon: Users,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      num: '03',
      title: 'Isi Penilaian',
      desc: 'Berikan nilai pada setiap karyawan untuk setiap kriteria',
      href: '/penilaian',
      icon: ClipboardList,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      num: '04',
      title: 'Lihat Hasil',
      desc: 'Sistem menghitung TOPSIS dan menampilkan peringkat karyawan terbaik',
      href: '/hasil',
      icon: Trophy,
      color: 'text-emerald-600 bg-emerald-50',
    },
  ]
</script>

<div class="p-8">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-2xl font-bold text-slate-900">Dashboard</h1>
    <p class="text-slate-500 text-sm mt-1">Sistem Pendukung Keputusan Pemilihan Karyawan Terbaik</p>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <div class="card p-5">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Kriteria</span>
        <div class="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
          <LayoutGrid size={15} class="text-violet-600" />
        </div>
      </div>
      <p class="text-3xl font-bold text-slate-900">{data.stats.totalCriteria}</p>
      <p class="text-xs text-slate-400 mt-1">
        Bobot total: <span class="{data.stats.totalWeight === 1 ? 'text-emerald-600' : 'text-amber-600'} font-medium">
          {data.stats.totalWeight}
        </span>
      </p>
    </div>

    <div class="card p-5">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Karyawan</span>
        <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <Users size={15} class="text-blue-600" />
        </div>
      </div>
      <p class="text-3xl font-bold text-slate-900">{data.stats.totalCandidates}</p>
      <p class="text-xs text-slate-400 mt-1">Kandidat terdaftar</p>
    </div>

    <div class="card p-5">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Kelengkapan</span>
        <div class="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
          <ClipboardList size={15} class="text-amber-600" />
        </div>
      </div>
      <p class="text-3xl font-bold text-slate-900">{data.stats.completeness}%</p>
      <div class="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all {data.stats.completeness === 100 ? 'bg-emerald-500' : 'bg-amber-500'}"
          style="width: {data.stats.completeness}%"
        ></div>
      </div>
    </div>

    <div class="card p-5">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Teratas</span>
        <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
          <Trophy size={15} class="text-emerald-600" />
        </div>
      </div>
      {#if data.topResult}
        <p class="text-base font-bold text-slate-900 truncate">{data.topResult.name}</p>
        <p class="text-xs text-slate-400 mt-1">
          Skor: <span class="text-emerald-600 font-semibold">{(data.topResult.closeness * 100).toFixed(1)}%</span>
        </p>
      {:else}
        <p class="text-sm text-slate-400">Belum ada data</p>
      {/if}
    </div>
  </div>

  <!-- Alur Penggunaan -->
  <div class="card mb-8">
    <div class="card-header">
      <div>
        <h2 class="font-semibold text-slate-900">Alur Penggunaan</h2>
        <p class="text-xs text-slate-400 mt-0.5">Ikuti 4 langkah berikut untuk mendapatkan hasil TOPSIS</p>
      </div>
      <BarChart3 size={18} class="text-slate-300" />
    </div>
    <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {#each steps as step}
        <a
          href={step.href}
          class="group relative p-4 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200"
        >
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-lg {step.color} flex items-center justify-center flex-shrink-0">
              {#if step.icon}
                {@const Icon = step.icon}
                <Icon size={17} />
              {/if}
            </div>
            <div class="min-w-0">
              <span class="text-xs font-bold text-slate-300">STEP {step.num}</span>
              <h3 class="font-semibold text-slate-800 text-sm mt-0.5 group-hover:text-primary-700 transition-colors">
                {step.title}
              </h3>
              <p class="text-xs text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>

  <!-- Metode TOPSIS Info -->
  <div class="card bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
    <div class="p-6">
      <h2 class="font-semibold text-white mb-2">Tentang Metode TOPSIS</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        <strong class="text-slate-300">TOPSIS</strong> (Technique for Order of Preference by Similarity to Ideal Solution)
        adalah metode pengambilan keputusan multi-kriteria yang memilih alternatif yang paling dekat dengan solusi ideal positif
        dan paling jauh dari solusi ideal negatif. Cocok digunakan dalam pemilihan karyawan terbaik dengan bobot dan tipe
        kriteria yang beragam.
      </p>
      <div class="mt-4 grid grid-cols-3 gap-3">
        {#each [['Normalisasi', 'Matriks keputusan dinormalisasi secara vektor'], ['Pembobotan', 'Setiap nilai dikalikan bobot kriteria'], ['Jarak Ideal', 'Dihitung jarak ke solusi ideal + dan −']] as [title, desc]}
          <div class="bg-slate-800/60 rounded-lg p-3">
            <p class="text-white text-xs font-semibold">{title}</p>
            <p class="text-slate-500 text-xs mt-1">{desc}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
