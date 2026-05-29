<script lang="ts">
  import { base } from '$app/paths'
  import Toast from '$lib/components/Toast.svelte'
  import { store } from '$lib/store.svelte'
  import { initials } from '$lib/utils'
  import { Save } from '@lucide/svelte'

  let showToast = $state(false)

  // Mirror lokal matriks untuk input (diisi dari store)
  let localMatrix = $state<Record<number, Record<number, number>>>({})

  $effect(() => {
    const m: Record<number, Record<number, number>> = {}
    for (const c of store.candidates) {
      m[c.id] = {}
      for (const cr of store.criteria) {
        m[c.id][cr.id] = store.matrix[c.id]?.[cr.id] ?? 0
      }
    }
    localMatrix = m
  })

  function save() {
    for (const c of store.candidates) {
      for (const cr of store.criteria) {
        store.setValue(c.id, cr.id, localMatrix[c.id]?.[cr.id] ?? 0)
      }
    }
    store.saveMatrix()
    showToast = true
  }

  function cellColor(val: number): string {
    if (val === 0) return 'bg-slate-50 text-slate-300'
    if (val >= 8) return 'bg-emerald-50'
    if (val >= 6) return 'bg-blue-50'
    if (val >= 4) return 'bg-amber-50'
    return 'bg-rose-50'
  }
</script>

<Toast bind:show={showToast} message="Data penilaian berhasil disimpan" type="success" />

<div class="p-8">
  <div class="flex items-center justify-between mb-8">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Matriks Penilaian</h1>
      <p class="text-slate-500 text-sm mt-1">Berikan nilai 1–10 untuk setiap karyawan pada setiap kriteria</p>
    </div>
  </div>

  {#if store.candidates.length === 0 || store.criteria.length === 0}
    <div class="card py-16 text-center">
      <p class="text-slate-400 text-sm">
        {#if store.candidates.length === 0}
          Belum ada karyawan. <a href="{base}/karyawan" class="text-primary-600 underline">Tambah karyawan</a> terlebih dahulu.
        {:else}
          Belum ada kriteria. <a href="{base}/kriteria" class="text-primary-600 underline">Tambah kriteria</a> terlebih dahulu.
        {/if}
      </p>
    </div>
  {:else}
    <div class="card overflow-hidden mb-4">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-100">
              <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide sticky left-0 bg-slate-50 min-w-[180px]">
                Karyawan
              </th>
              {#each store.criteria as cr}
                <th class="px-3 py-3 text-center min-w-[120px]">
                  <span class="text-xs font-semibold text-slate-600 block">{cr.name}</span>
                  <span class="badge mt-1 {cr.type === 'benefit' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}">
                    {cr.type === 'benefit' ? '↑' : '↓'} w={cr.weight}
                  </span>
                </th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each store.candidates as c}
              <tr class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td class="px-4 py-3 sticky left-0 bg-white">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {initials(c.name)}
                    </div>
                    <div>
                      <p class="font-medium text-slate-800 text-sm">{c.name}</p>
                      <p class="text-xs text-slate-400">{c.position}</p>
                    </div>
                  </div>
                </td>
                {#each store.criteria as cr}
                  <td class="px-2 py-2 text-center">
                    {#if localMatrix[c.id]}
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="1"
                        bind:value={localMatrix[c.id][cr.id]}
                        class="w-16 text-center rounded-lg border border-slate-200 py-1.5 text-sm font-mono font-semibold outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition {cellColor(localMatrix[c.id]?.[cr.id] ?? 0)}"
                      />
                    {/if}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex items-center gap-4 mb-4 text-xs text-slate-500">
      <span class="font-medium">Keterangan nilai:</span>
      {#each [['0', 'bg-slate-100', 'Belum diisi'], ['1–3', 'bg-rose-100', 'Kurang'], ['4–5', 'bg-amber-100', 'Cukup'], ['6–7', 'bg-blue-100', 'Baik'], ['8–10', 'bg-emerald-100', 'Sangat Baik']] as [range, cls, label]}
        <span class="flex items-center gap-1">
          <span class="inline-block w-3 h-3 rounded {cls}"></span>
          {range} ({label})
        </span>
      {/each}
    </div>

    <div class="flex justify-end">
      <button type="button" onclick={save} class="btn-primary">
        <Save size={16} />
        Simpan Semua Penilaian
      </button>
    </div>
  {/if}
</div>
