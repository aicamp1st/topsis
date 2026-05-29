<script lang="ts">
  import { enhance } from '$app/forms'
  import Modal from '$lib/components/Modal.svelte'
  import Toast from '$lib/components/Toast.svelte'
  import type { Criteria } from '$lib/server/db/schema'
  import { Edit2, Info, Plus, Trash2 } from '@lucide/svelte'
  import type { ActionData, PageData } from './$types'

  let { data, form }: { data: PageData; form: ActionData } = $props()

  let showCreate = $state(false)
  let showEdit = $state(false)
  let showDelete = $state(false)
  let editTarget = $state<Criteria | null>(null)
  let deleteTarget = $state<Criteria | null>(null)
  let toastMsg = $state('')
  let toastType = $state<'success' | 'error'>('success')
  let showToast = $state(false)

  $effect(() => {
    if (form?.success) {
      const msgs: Record<string, string> = {
        create: 'Kriteria berhasil ditambahkan',
        update: 'Kriteria berhasil diperbarui',
        delete: 'Kriteria berhasil dihapus',
      }
      toastMsg = msgs[form.action ?? ''] ?? 'Berhasil'
      toastType = 'success'
      showToast = true
      showCreate = false
      showEdit = false
      showDelete = false
    }
  })

  function openEdit(c: Criteria) {
    editTarget = { ...c }
    showEdit = true
  }

  function openDelete(c: Criteria) {
    deleteTarget = c
    showDelete = true
  }

  const weightPercent = $derived(Math.round(data.totalWeight * 100))
</script>

<Toast bind:show={showToast} message={toastMsg} type={toastType} />

<div class="p-8">
  <div class="flex items-center justify-between mb-8">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Kriteria Penilaian</h1>
      <p class="text-slate-500 text-sm mt-1">Kelola kriteria beserta bobot dan tipe penilaian</p>
    </div>
    <button onclick={() => (showCreate = true)} class="btn-primary">
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
      <span class="text-sm font-bold {data.totalWeight === 1 ? 'text-emerald-600' : 'text-amber-600'}">
        {data.totalWeight} / 1.00
        {#if data.totalWeight === 1}✓{:else}⚠{/if}
      </span>
    </div>
    <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all {data.totalWeight > 1 ? 'bg-rose-500' : data.totalWeight === 1 ? 'bg-emerald-500' : 'bg-amber-400'}"
        style="width: {Math.min(weightPercent, 100)}%"
      ></div>
    </div>
    {#if data.totalWeight !== 1}
      <p class="text-xs text-amber-600 mt-2">Total bobot harus tepat 1.00 agar kalkulasi TOPSIS valid.</p>
    {/if}
  </div>

  <!-- Table -->
  <div class="card overflow-hidden">
    {#if data.criteria.length === 0}
      <div class="py-16 text-center">
        <p class="text-slate-400 text-sm">Belum ada kriteria. Tambah kriteria terlebih dahulu.</p>
      </div>
    {:else}
      <table class="table-base">
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
          {#each data.criteria as c, i}
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
                  <button onclick={() => openDelete(c)} class="btn-ghost p-1.5 rounded-lg text-slate-400 hover:text-rose-600">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>

<!-- Create Modal -->
<Modal bind:open={showCreate} title="Tambah Kriteria">
  <form method="POST" action="?/create" use:enhance class="space-y-4">
    <div>
      <label class="label" for="create-name">Nama Kriteria</label>
      <input id="create-name" name="name" class="input" placeholder="cth. Prestasi Kerja" required />
    </div>
    <div>
      <label class="label" for="create-desc">Deskripsi (opsional)</label>
      <input id="create-desc" name="description" class="input" placeholder="Penjelasan singkat kriteria" />
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="label" for="create-weight">Bobot (0–1)</label>
        <input id="create-weight" name="weight" type="number" step="0.01" min="0.01" max="1" class="input" placeholder="0.25" required />
      </div>
      <div>
        <label class="label" for="create-type">Tipe</label>
        <select id="create-type" name="type" class="input">
          <option value="benefit">↑ Benefit</option>
          <option value="cost">↓ Cost</option>
        </select>
      </div>
    </div>
    {#if form?.error}
      <p class="text-sm text-rose-600">{form.error}</p>
    {/if}
    <div class="flex justify-end gap-2 pt-2">
      <button type="button" onclick={() => (showCreate = false)} class="btn-secondary">Batal</button>
      <button type="submit" class="btn-primary">Simpan</button>
    </div>
  </form>
</Modal>

<!-- Edit Modal -->
{#if editTarget}
  <Modal bind:open={showEdit} title="Edit Kriteria">
    <form method="POST" action="?/update" use:enhance class="space-y-4">
      <input type="hidden" name="id" value={editTarget.id} />
      <div>
        <label class="label" for="edit-name">Nama Kriteria</label>
        <input id="edit-name" name="name" class="input" value={editTarget.name} required />
      </div>
      <div>
        <label class="label" for="edit-desc">Deskripsi</label>
        <input id="edit-desc" name="description" class="input" value={editTarget.description ?? ''} />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="label" for="edit-weight">Bobot</label>
          <input id="edit-weight" name="weight" type="number" step="0.01" min="0.01" max="1" class="input" value={editTarget.weight} required />
        </div>
        <div>
          <label class="label" for="edit-type">Tipe</label>
          <select id="edit-type" name="type" class="input">
            <option value="benefit" selected={editTarget.type === 'benefit'}>↑ Benefit</option>
            <option value="cost" selected={editTarget.type === 'cost'}>↓ Cost</option>
          </select>
        </div>
      </div>
      {#if form?.error}
        <p class="text-sm text-rose-600">{form.error}</p>
      {/if}
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick={() => (showEdit = false)} class="btn-secondary">Batal</button>
        <button type="submit" class="btn-primary">Perbarui</button>
      </div>
    </form>
  </Modal>
{/if}

<!-- Delete Modal -->
{#if deleteTarget}
  <Modal bind:open={showDelete} title="Hapus Kriteria" size="sm">
    <p class="text-sm text-slate-600 mb-4">
      Yakin ingin menghapus kriteria <strong>{deleteTarget.name}</strong>? Semua data penilaian terkait akan ikut terhapus.
    </p>
    <form method="POST" action="?/delete" use:enhance>
      <input type="hidden" name="id" value={deleteTarget.id} />
      <div class="flex justify-end gap-2">
        <button type="button" onclick={() => (showDelete = false)} class="btn-secondary">Batal</button>
        <button type="submit" class="btn-danger">Hapus</button>
      </div>
    </form>
  </Modal>
{/if}
