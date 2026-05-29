<script lang="ts">
  import { base } from '$app/paths'
  import { store } from '$lib/store.svelte'
  import { ArrowRight, ClipboardList, LayoutGrid, Sparkles, Trophy, Users } from '@lucide/svelte'

  const totalWeight = $derived(store.totalWeight)
  const topResult = $derived(store.topResult())

  const steps = [
    { num: '01', title: 'Tentukan Kriteria', desc: 'Tambahkan kriteria penilaian beserta bobot dan tipe (benefit/cost)', href: '/kriteria', icon: LayoutGrid, tint: 'bg-primary-100 text-primary-700' },
    { num: '02', title: 'Daftarkan Karyawan', desc: 'Masukkan data karyawan yang akan dinilai', href: '/karyawan', icon: Users, tint: 'bg-olive-100 text-olive-700' },
    { num: '03', title: 'Isi Penilaian', desc: 'Berikan nilai pada setiap karyawan untuk setiap kriteria', href: '/penilaian', icon: ClipboardList, tint: 'bg-honey-200 text-[#8a5a12]' },
    { num: '04', title: 'Lihat Hasil', desc: 'Sistem menghitung TOPSIS dan menampilkan peringkat terbaik', href: '/hasil', icon: Trophy, tint: 'bg-primary-100 text-primary-700' },
  ]
</script>

<div class="p-4 sm:p-6 lg:p-8 max-w-6xl">
  <!-- Hero -->
  <div class="relative mb-8 sm:mb-10">
    <span class="eyebrow"><Sparkles size={13} /> Decision Support System</span>
    <h1 class="text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.1] lg:leading-[1.05] font-semibold text-slate-900 mt-3 max-w-2xl">
      Temukan <span class="text-primary-600 italic">karyawan terbaik</span> dengan metode TOPSIS.
    </h1>
    <p class="text-slate-500 mt-4 max-w-xl leading-relaxed">
      Sistem pendukung keputusan yang membantu menilai dan memeringkat karyawan secara objektif berdasarkan beberapa kriteria sekaligus.
    </p>
    <a href="{base}/hasil" class="btn-primary mt-6">
      Lihat hasil peringkat
      <ArrowRight size={16} />
    </a>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
    <div class="card p-5">
      <div class="flex items-center justify-between mb-3">
        <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Kriteria</span>
        <div class="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center">
          <LayoutGrid size={15} class="text-primary-600" />
        </div>
      </div>
      <p class="text-4xl font-display font-semibold text-slate-900">{store.criteria.length}</p>
      <p class="text-xs text-slate-400 mt-1">
        Bobot total: <span class="{totalWeight === 1 ? 'text-olive-600' : 'text-primary-600'} font-semibold">{totalWeight}</span>
      </p>
    </div>

    <div class="card p-5">
      <div class="flex items-center justify-between mb-3">
        <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Karyawan</span>
        <div class="w-8 h-8 rounded-xl bg-olive-100 flex items-center justify-center">
          <Users size={15} class="text-olive-600" />
        </div>
      </div>
      <p class="text-4xl font-display font-semibold text-slate-900">{store.candidates.length}</p>
      <p class="text-xs text-slate-400 mt-1">Kandidat terdaftar</p>
    </div>

    <div class="card p-5">
      <div class="flex items-center justify-between mb-3">
        <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Kelengkapan</span>
        <div class="w-8 h-8 rounded-xl bg-honey-200 flex items-center justify-center">
          <ClipboardList size={15} class="text-[#8a5a12]" />
        </div>
      </div>
      <p class="text-4xl font-display font-semibold text-slate-900">{store.completeness}<span class="text-lg">%</span></p>
      <div class="mt-2.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-500 {store.completeness === 100 ? 'bg-olive-500' : 'bg-primary-400'}"
          style="width: {store.completeness}%"
        ></div>
      </div>
    </div>

    <div class="card p-5 relative overflow-hidden">
      <div class="flex items-center justify-between mb-3">
        <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Teratas</span>
        <div class="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
          <Trophy size={15} class="text-white" />
        </div>
      </div>
      {#if topResult}
        <p class="text-lg font-display font-semibold text-slate-900 truncate">{topResult.name}</p>
        <p class="text-xs text-slate-400 mt-1">
          Skor: <span class="text-primary-600 font-semibold">{(topResult.closeness * 100).toFixed(1)}%</span>
        </p>
      {:else}
        <p class="text-sm text-slate-400 mt-2">Belum ada data</p>
      {/if}
    </div>
  </div>

  <!-- Alur Penggunaan -->
  <div class="mb-10">
    <h2 class="text-xl font-semibold text-slate-900 mb-1">Empat langkah, satu keputusan</h2>
    <p class="text-sm text-slate-500 mb-5">Ikuti alur berikut untuk mendapatkan hasil TOPSIS.</p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {#each steps as step, i}
        {@const Icon = step.icon}
        <a
          href="{base}{step.href}"
          class="group card p-5 hover:-translate-y-1 transition-all duration-200 relative"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 rounded-xl {step.tint} flex items-center justify-center">
              <Icon size={18} />
            </div>
            <span class="font-display text-3xl font-semibold text-slate-200 group-hover:text-primary-200 transition-colors">{step.num}</span>
          </div>
          <h3 class="font-semibold text-slate-800 group-hover:text-primary-700 transition-colors">{step.title}</h3>
          <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">{step.desc}</p>
          {#if i < steps.length - 1}
            <ArrowRight size={14} class="absolute -right-2 top-1/2 hidden lg:block text-slate-200" />
          {/if}
        </a>
      {/each}
    </div>
  </div>

  <!-- Metode TOPSIS Info -->
  <div class="card bg-slate-900 border-0 relative overflow-hidden">
    <div
      class="absolute inset-0 opacity-50 pointer-events-none"
      style="background-image: radial-gradient(at 85% 10%, rgba(194,95,55,0.3) 0px, transparent 50%), radial-gradient(at 10% 100%, rgba(133,145,57,0.2) 0px, transparent 45%);"
    ></div>
    <div class="relative p-7">
      <span class="eyebrow !text-honey-300">Tentang Metode</span>
      <h2 class="text-white text-2xl font-semibold mt-2 mb-3">Kenapa TOPSIS?</h2>
      <p class="text-slate-300 text-sm leading-relaxed max-w-2xl">
        <strong class="text-white">TOPSIS</strong> (Technique for Order of Preference by Similarity to Ideal Solution)
        memilih alternatif yang paling dekat dengan solusi ideal positif dan paling jauh dari solusi ideal negatif —
        cocok untuk pemilihan karyawan dengan bobot dan tipe kriteria yang beragam.
      </p>
      <div class="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {#each [['Normalisasi', 'Matriks keputusan dinormalisasi secara vektor'], ['Pembobotan', 'Setiap nilai dikalikan bobot kriteria'], ['Jarak Ideal', 'Dihitung jarak ke solusi ideal + dan −']] as [title, desc]}
          <div class="bg-white/5 border border-white/5 rounded-xl p-4">
            <p class="text-honey-300 text-sm font-semibold">{title}</p>
            <p class="text-slate-400 text-xs mt-1 leading-relaxed">{desc}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
