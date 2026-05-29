<script lang="ts">
  import Modal from '$lib/components/Modal.svelte'
  import Toast from '$lib/components/Toast.svelte'
  import { store } from '$lib/store.svelte'
  import type { Criteria } from '$lib/types'
  import { Edit2, Info, Plus, Trash2 } from '@lucide/svelte'

  let showCreate = $state(false)
  let showEdit = $state(false)
  let showDelete = $state(false)
  let editTarget = $state<Criteria | null>(null)
  let deleteTarget = $state<Criteria | null>(null)
  let toastMsg = $state('')
  let toastType = $state<'success' | 'error'>('success')
  let showToast = $state(false)
  let formError = $state('')

  // Form fields
  let fName = $state('')
  let fDesc = $state('')
  let fWeight = $state<number | string>('')
  let fType = $state<'benefit' | 'cost'>('benefit')

  const totalWeight = $derived(store.totalWeight)
  const weightPercent = $derived(Math.round(totalWeight * 100))

  function toast(msg: string, type: 'success' | 'error' = 'success') {
    toastMsg = msg
    toastType = type
    showToast = true
  }

  function validate(): boolean {
    formError = ''
    if (!fName.trim()) {
      formError = 'Nama kriteria wajib diisi'
      return false
    }
    const w = parseFloat(String(fWeight))
    if (isNaN(w) || w <= 0 || w > 1) {
      formError = 'Bobot harus antara 0 dan 1'
      return false
    }
    return true
  }

  function openCreate() {
    fName = ''
    fDesc = ''
    fWeight = ''
    fType = 'benefit'
    formError = ''
    showCreate = true
  }

  function openEdit(c: Criteria) {
    editTarget = c
    fName = c.name
    fDesc = c.description
    fWeight = c.weight
    fType = c.type
    formError = ''
    showEdit = true
  }

  function submitCreate() {
    if (!validate()) return
    store.addCriteria({
      name: fName.trim(),
      description: fDesc.trim(),
      weight: parseFloat(String(fWeight)),
      type: fType,
    })
    showCreate = false
    toast('Kriteria berhasil ditambahkan')
  }

  function submitEdit() {
    if (!validate() || !editTarget) return
    store.updateCriteria(editTarget.id, {
      name: fName.trim(),
      description: fDesc.trim(),
      weight: parseFloat(String(fWeight)),
      type: fType,
    })
    showEdit = false
    toast('Kriteria berhasil diperbarui')
  }

  function confirmDelete() {
    if (!deleteTarget) return
    store.deleteCriteria(deleteTarget.id)
    showDelete = false
    toast('Kriteria berhasil dihapus')
  }
</script>

<Toast bind:show={showToast} message={toastMsg} type={toastType} />

<div class="p-4 sm:p-6 lg:p-8 max-w-6xl">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
    <div>
      <span class="eyebrow">Langkah 01</span>
      <h1 class="text-2xl sm:text-3xl font-semibold text-slate-900 mt-1.5">Kriteria Penilaian</h1>
      <p class="text-slate-500 text-sm mt-1.5">Kelola kriteria beserta bobot dan tipe penilaian</p>
    </div>
    <button onclick={openCreate} class="btn-primary self-start sm:self-auto">
      <Plus size={16} />
      Tambah Kriteria
    </button>
  </div>

  <!-- Weight summary -->
  <div class="card mb-6 p-4">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <Info size={15} class="text-slate-400" />
        <span class="text-sm font-medium text-slate-600">Total Bobot</span>
      </div>
      <span class="text-sm font-bold {totalWeight === 1 ? 'text-emerald-600' : 'text-amber-600'}">
        {totalWeight} / 1.00
        {#if totalWeight === 1}✓{:else}⚠{/if}
      </span>
    </div>
    <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all {totalWeight > 1 ? 'bg-rose-500' : totalWeight === 1 ? 'bg-emerald-500' : 'bg-amber-400'}"
        style="width: {Math.min(weightPercent, 100)}%"
      ></div>
    </div>
    {#if totalWeight !== 1}
      <p class="text-xs text-amber-600 mt-2">Total bobot harus tepat 1.00 agar kalkulasi TOPSIS valid.</p>
    {/if}
  </div>

  <!-- Table -->
  <div class="card overflow-hidden">
    {#if store.criteria.length === 0}
      <div class="py-16 text-center">
        <p class="text-slate-400 text-sm">Belum ada kriteria. Tambah kriteria terlebih dahulu.</p>
      </div>
    {:else}
      <div class="overflow-x-auto">
      <table class="table-base min-w-[640px]">
        <thead>
          <tr>
            <th class="w-8">#</th>
            <th>Nama Kriteria</th>
            <th>Deskripsi</th>
            <th>Bobot</th>
            <th>Tipe</th>
            <th class="text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {#each store.criteria as c, i}
            <tr>
              <td class="text-slate-400 font-mono text-xs">{i + 1}</td>
              <td class="font-medium text-slate-900">{c.name}</td>
              <td class="text-slate-400 text-xs max-w-xs truncate">{c.description || '—'}</td>
              <td>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-sm font-semibold text-slate-800">{c.weight}</span>
                  <div class="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-primary-400 rounded-full" style="width: {c.weight * 100}%"></div>
                  </div>
                </div>
              </td>
              <td>
                <span
                  class="badge {c.type === 'benefit'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-600'}"
                >
                  {c.type === 'benefit' ? '↑ Benefit' : '↓ Cost'}
                </span>
              </td>
              <td class="text-right">
                <div class="flex items-center justify-end gap-1">
                  <button onclick={() => openEdit(c)} class="btn-ghost p-1.5 rounded-lg text-slate-400 hover:text-slate-700">
                    <Edit2 size={15} />
                  </button>
                  <button onclick={() => { deleteTarget = c; showDelete = true }} class="btn-ghost p-1.5 rounded-lg text-slate-400 hover:text-rose-600">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      </div>
    {/if}
  </div>
</div>

<!-- Create Modal -->
<Modal bind:open={showCreate} title="Tambah Kriteria">
  <form onsubmit={(e) => { e.preventDefault(); submitCreate() }} class="space-y-4">
    <div>
      <label class="label" for="create-name">Nama Kriteria</label>
      <input id="create-name" bind:value={fName} class="input" placeholder="cth. Prestasi Kerja" required />
    </div>
    <div>
      <label class="label" for="create-desc">Deskripsi (opsional)</label>
      <input id="create-desc" bind:value={fDesc} class="input" placeholder="Penjelasan singkat kriteria" />
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="label" for="create-weight">Bobot (0–1)</label>
        <input id="create-weight" bind:value={fWeight} type="number" step="0.01" min="0.01" max="1" class="input" placeholder="0.25" required />
      </div>
      <div>
        <label class="label" for="create-type">Tipe</label>
        <select id="create-type" bind:value={fType} class="input">
          <option value="benefit">↑ Benefit</option>
          <option value="cost">↓ Cost</option>
        </select>
      </div>
    </div>
    {#if formError}
      <p class="text-sm text-rose-600">{formError}</p>
    {/if}
    <div class="flex justify-end gap-2 pt-2">
      <button type="button" onclick={() => (showCreate = false)} class="btn-secondary">Batal</button>
      <button type="submit" class="btn-primary">Simpan</button>
    </div>
  </form>
</Modal>

<!-- Edit Modal -->
<Modal bind:open={showEdit} title="Edit Kriteria">
  <form onsubmit={(e) => { e.preventDefault(); submitEdit() }} class="space-y-4">
    <div>
      <label class="label" for="edit-name">Nama Kriteria</label>
      <input id="edit-name" bind:value={fName} class="input" required />
    </div>
    <div>
      <label class="label" for="edit-desc">Deskripsi</label>
      <input id="edit-desc" bind:value={fDesc} class="input" />
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="label" for="edit-weight">Bobot</label>
        <input id="edit-weight" bind:value={fWeight} type="number" step="0.01" min="0.01" max="1" class="input" required />
      </div>
      <div>
        <label class="label" for="edit-type">Tipe</label>
        <select id="edit-type" bind:value={fType} class="input">
          <option value="benefit">↑ Benefit</option>
          <option value="cost">↓ Cost</option>
        </select>
      </div>
    </div>
    {#if formError}
      <p class="text-sm text-rose-600">{formError}</p>
    {/if}
    <div class="flex justify-end gap-2 pt-2">
      <button type="button" onclick={() => (showEdit = false)} class="btn-secondary">Batal</button>
      <button type="submit" class="btn-primary">Perbarui</button>
    </div>
  </form>
</Modal>

<!-- Delete Modal -->
{#if deleteTarget}
  <Modal bind:open={showDelete} title="Hapus Kriteria" size="sm">
    <p class="text-sm text-slate-600 mb-4">
      Yakin ingin menghapus kriteria <strong>{deleteTarget.name}</strong>? Semua data penilaian terkait akan ikut terhapus.
    </p>
    <div class="flex justify-end gap-2">
      <button type="button" onclick={() => (showDelete = false)} class="btn-secondary">Batal</button>
      <button type="button" onclick={confirmDelete} class="btn-danger">Hapus</button>
    </div>
  </Modal>
{/if}
