<script lang="ts">
  import BarChart from '$lib/components/BarChart.svelte'
  import RadarChart from '$lib/components/RadarChart.svelte'
  import { store } from '$lib/store.svelte'
  import { closenessLabel, departmentColor, fmt, initials, rankMedal } from '$lib/utils'
  import { AlertCircle, BarChart3, ChevronDown, ChevronUp, Hexagon, Trophy } from '@lucide/svelte'

  const computed = $derived(store.compute())

  let activeStep = $state<number | null>(null)

  function toggleStep(n: number) {
    activeStep = activeStep === n ? null : n
  }

  // Data untuk bar chart skor Ci (urut peringkat)
  const barItems = $derived(
    computed.result?.results.map((r) => ({ name: r.name, value: r.closeness, rank: r.rank })) ?? [],
  )

  // Data radar: top 3 kandidat, nilai ternormalisasi per kriteria
  const radarSeries = $derived.by(() => {
    const res = computed.result
    if (!res) return []
    return res.results.slice(0, 3).map((r) => {
      const ci = res.candidateLabels.indexOf(r.name)
      return { name: r.name, values: res.steps.normalizedMatrix[ci] ?? [] }
    })
  })

  const stepNames = [
    'Matriks Keputusan',
    'Normalisasi Vektor',
    'Matriks Berbobot',
    'Solusi Ideal',
    'Jarak & Kedekatan',
  ]
</script>

<div class="p-8 max-w-6xl">
  <div class="mb-8">
    <span class="eyebrow"><Trophy size={13} /> Hasil Akhir</span>
    <h1 class="text-4xl font-semibold text-slate-900 mt-2">Peringkat Karyawan</h1>
    <p class="text-slate-500 text-sm mt-2 max-w-lg">Peringkat lengkap karyawan terbaik berdasarkan metode TOPSIS, lengkap dengan visualisasi dan rincian perhitungan.</p>
  </div>

  {#if !computed.ready}
    <div class="card p-8 text-center">
      <AlertCircle size={32} class="text-amber-400 mx-auto mb-3" />
      <p class="text-slate-600 font-medium">{computed.message}</p>
      <p class="text-slate-400 text-sm mt-1">Lengkapi data sebelum menghitung TOPSIS.</p>
    </div>
  {:else if computed.result}
    {@const { results, steps, criteriaLabels, candidateLabels } = computed.result}

    <!-- Top 3 Podium -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      {#each results.slice(0, 3) as r}
        <div
          class="card p-5 text-center relative overflow-hidden transition-transform hover:-translate-y-0.5
          {r.rank === 1 ? 'border-honey-300 bg-gradient-to-b from-honey-100/60 to-[#fffdfa] shadow-md -mt-2' : ''}
          {r.rank === 2 ? 'border-slate-300 bg-gradient-to-b from-slate-50 to-[#fffdfa]' : ''}
          {r.rank === 3 ? 'border-primary-200 bg-gradient-to-b from-primary-50/60 to-[#fffdfa]' : ''}"
        >
          {#if r.rank === 1}
            <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-honey-300 via-primary-400 to-olive-400"></div>
          {/if}
          <div class="text-3xl mb-2">{rankMedal(r.rank)}</div>
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-display font-semibold text-lg mx-auto mb-2 shadow-sm">
            {initials(r.name)}
          </div>
          <p class="font-semibold text-slate-900">{r.name}</p>
          <p class="text-xs text-slate-400 mt-0.5">{r.position}</p>
          <div class="mt-3">
            <span class="text-3xl font-display font-semibold {r.rank === 1 ? 'text-primary-600' : 'text-slate-700'}">
              {(r.closeness * 100).toFixed(2)}<span class="text-base align-top">%</span>
            </span>
            <p class="text-xs text-slate-400 mt-0.5">Skor Kedekatan (Ci)</p>
          </div>
        </div>
      {/each}
    </div>

    <!-- Full Ranking Table -->
    <div class="card overflow-hidden mb-6">
      <div class="card-header">
        <div class="flex items-center gap-2">
          <Trophy size={16} class="text-amber-500" />
          <h2 class="font-semibold text-slate-900">Tabel Peringkat Lengkap</h2>
        </div>
      </div>
      <table class="table-base">
        <thead>
          <tr>
            <th class="w-12">Rank</th>
            <th>Karyawan</th>
            <th>Departemen</th>
            <th class="text-right">D⁺ (Jarak Ideal+)</th>
            <th class="text-right">D⁻ (Jarak Ideal−)</th>
            <th class="text-right">Ci (Skor)</th>
            <th class="text-center">Kategori</th>
          </tr>
        </thead>
        <tbody>
          {#each results as r}
            {@const label = closenessLabel(r.closeness)}
            <tr class="{r.rank === 1 ? 'bg-amber-50/40' : ''}">
              <td class="text-center font-bold text-lg">{rankMedal(r.rank)}</td>
              <td>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {initials(r.name)}
                  </div>
                  <div>
                    <p class="font-medium text-slate-900">{r.name}</p>
                    <p class="text-xs text-slate-400">{r.position}</p>
                  </div>
                </div>
              </td>
              <td><span class="badge {departmentColor(r.department)}">{r.department}</span></td>
              <td class="text-right font-mono text-sm">{fmt(r.distancePlus)}</td>
              <td class="text-right font-mono text-sm">{fmt(r.distanceMinus)}</td>
              <td class="text-right">
                <div class="flex items-center justify-end gap-2">
                  <div class="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full {r.rank === 1 ? 'bg-amber-500' : 'bg-primary-500'}"
                      style="width: {r.closeness * 100}%"
                    ></div>
                  </div>
                  <span class="font-mono font-bold text-sm text-slate-800">{fmt(r.closeness, 4)}</span>
                </div>
              </td>
              <td class="text-center"><span class="badge {label.class}">{label.label}</span></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Visualisasi -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
      <div class="card lg:col-span-3">
        <div class="card-header">
          <div class="flex items-center gap-2">
            <BarChart3 size={16} class="text-primary-500" />
            <h2 class="font-semibold text-slate-900 text-base">Skor Kedekatan (Ci)</h2>
          </div>
          <span class="text-xs text-slate-400">per karyawan · %</span>
        </div>
        <div class="p-5">
          <BarChart items={barItems} />
        </div>
      </div>

      <div class="card lg:col-span-2">
        <div class="card-header">
          <div class="flex items-center gap-2">
            <Hexagon size={16} class="text-olive-600" />
            <h2 class="font-semibold text-slate-900 text-base">Profil Kriteria</h2>
          </div>
          <span class="text-xs text-slate-400">top 3</span>
        </div>
        <div class="p-5">
          <RadarChart axes={criteriaLabels} series={radarSeries} />
        </div>
      </div>
    </div>

    <!-- Step-by-step Calculation Detail -->
    <div class="card overflow-hidden mb-6">
      <div class="card-header">
        <h2 class="font-semibold text-slate-900">Detail Perhitungan TOPSIS</h2>
        <span class="text-xs text-slate-400">Klik langkah untuk melihat detail</span>
      </div>

      <div class="divide-y divide-slate-50">
        {#each stepNames as name, i}
          <div>
            <button
              onclick={() => toggleStep(i)}
              class="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
            >
              <div class="flex items-center gap-3">
                <span class="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span class="font-medium text-slate-800 text-sm">{name}</span>
              </div>
              {#if activeStep === i}
                <ChevronUp size={16} class="text-slate-400" />
              {:else}
                <ChevronDown size={16} class="text-slate-400" />
              {/if}
            </button>

            {#if activeStep === i}
              <div class="px-6 pb-6 overflow-x-auto">
                {#if i === 0}
                  <!-- Decision Matrix -->
                  <p class="text-xs text-slate-400 mb-3">Nilai mentah dari matriks penilaian</p>
                  <table class="text-xs border-collapse">
                    <thead>
                      <tr>
                        <th class="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 font-semibold sticky left-0">Karyawan</th>
                        {#each criteriaLabels as cl}
                          <th class="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 font-semibold text-center">{cl}</th>
                        {/each}
                      </tr>
                    </thead>
                    <tbody>
                      {#each steps.decisionMatrix as row, ri}
                        <tr>
                          <td class="px-3 py-2 border border-slate-200 font-medium bg-slate-50 sticky left-0">{candidateLabels[ri]}</td>
                          {#each row as val}
                            <td class="px-3 py-2 border border-slate-200 text-center font-mono">{val}</td>
                          {/each}
                        </tr>
                      {/each}
                    </tbody>
                  </table>

                {:else if i === 1}
                  <!-- Normalized Matrix -->
                  <p class="text-xs text-slate-400 mb-3">r[i][j] = x[i][j] / √(Σ x[k][j]²)</p>
                  <table class="text-xs border-collapse">
                    <thead>
                      <tr>
                        <th class="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 font-semibold sticky left-0">Karyawan</th>
                        {#each criteriaLabels as cl}
                          <th class="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 font-semibold text-center">{cl}</th>
                        {/each}
                      </tr>
                    </thead>
                    <tbody>
                      {#each steps.normalizedMatrix as row, ri}
                        <tr>
                          <td class="px-3 py-2 border border-slate-200 font-medium bg-slate-50 sticky left-0">{candidateLabels[ri]}</td>
                          {#each row as val}
                            <td class="px-3 py-2 border border-slate-200 text-center font-mono">{fmt(val)}</td>
                          {/each}
                        </tr>
                      {/each}
                    </tbody>
                  </table>

                {:else if i === 2}
                  <!-- Weighted Matrix -->
                  <p class="text-xs text-slate-400 mb-3">v[i][j] = w[j] × r[i][j]</p>
                  <table class="text-xs border-collapse">
                    <thead>
                      <tr>
                        <th class="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 font-semibold sticky left-0">Karyawan</th>
                        {#each criteriaLabels as cl}
                          <th class="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 font-semibold text-center">{cl}</th>
                        {/each}
                      </tr>
                    </thead>
                    <tbody>
                      {#each steps.weightedMatrix as row, ri}
                        <tr>
                          <td class="px-3 py-2 border border-slate-200 font-medium bg-slate-50 sticky left-0">{candidateLabels[ri]}</td>
                          {#each row as val}
                            <td class="px-3 py-2 border border-slate-200 text-center font-mono">{fmt(val)}</td>
                          {/each}
                        </tr>
                      {/each}
                    </tbody>
                  </table>

                {:else if i === 3}
                  <!-- Ideal Solutions -->
                  <p class="text-xs text-slate-400 mb-3">
                    A⁺ = max benefit / min cost &nbsp;|&nbsp; A⁻ = min benefit / max cost
                  </p>
                  <table class="text-xs border-collapse">
                    <thead>
                      <tr>
                        <th class="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 font-semibold">Solusi</th>
                        {#each criteriaLabels as cl}
                          <th class="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 font-semibold text-center">{cl}</th>
                        {/each}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="px-3 py-2 border border-slate-200 font-bold text-emerald-700 bg-emerald-50">A⁺ (Ideal+)</td>
                        {#each steps.idealPositive as val}
                          <td class="px-3 py-2 border border-slate-200 text-center font-mono text-emerald-700">{fmt(val)}</td>
                        {/each}
                      </tr>
                      <tr>
                        <td class="px-3 py-2 border border-slate-200 font-bold text-rose-600 bg-rose-50">A⁻ (Ideal−)</td>
                        {#each steps.idealNegative as val}
                          <td class="px-3 py-2 border border-slate-200 text-center font-mono text-rose-600">{fmt(val)}</td>
                        {/each}
                      </tr>
                    </tbody>
                  </table>

                {:else if i === 4}
                  <!-- Distances & Closeness -->
                  <p class="text-xs text-slate-400 mb-3">
                    D⁺ = √(Σ(v−A⁺)²) &nbsp;|&nbsp; D⁻ = √(Σ(v−A⁻)²) &nbsp;|&nbsp; Ci = D⁻/(D⁺+D⁻)
                  </p>
                  <table class="text-xs border-collapse">
                    <thead>
                      <tr>
                        <th class="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 font-semibold sticky left-0">Karyawan</th>
                        <th class="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 font-semibold text-center">D⁺</th>
                        <th class="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 font-semibold text-center">D⁻</th>
                        <th class="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 font-semibold text-center">Ci</th>
                        <th class="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 font-semibold text-center">Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each results as r}
                        <tr class="{r.rank === 1 ? 'bg-amber-50/40' : ''}">
                          <td class="px-3 py-2 border border-slate-200 font-medium sticky left-0 bg-white">{r.name}</td>
                          <td class="px-3 py-2 border border-slate-200 text-center font-mono">{fmt(r.distancePlus)}</td>
                          <td class="px-3 py-2 border border-slate-200 text-center font-mono">{fmt(r.distanceMinus)}</td>
                          <td class="px-3 py-2 border border-slate-200 text-center font-mono font-bold text-primary-700">{fmt(r.closeness)}</td>
                          <td class="px-3 py-2 border border-slate-200 text-center font-bold">{rankMedal(r.rank)}</td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- Conclusion -->
    <div class="card bg-gradient-to-r from-primary-600 to-olive-700 border-0">
      <div class="p-6">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Trophy size={22} class="text-white" />
          </div>
          <div>
            <p class="text-white/70 text-sm font-medium">Rekomendasi Karyawan Terbaik</p>
            <p class="text-white text-xl font-bold mt-1">{results[0].name}</p>
            <p class="text-white/70 text-sm">{results[0].position} · {results[0].department}</p>
            <p class="text-white/90 text-sm mt-2">
              Skor kedekatan (Ci) tertinggi:
              <strong>{(results[0].closeness * 100).toFixed(2)}%</strong>
              — paling mendekati solusi ideal positif dan paling jauh dari solusi ideal negatif.
            </p>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
