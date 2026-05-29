<script lang="ts">
  import Modal from '$lib/components/Modal.svelte'
  import Toast from '$lib/components/Toast.svelte'
  import { store } from '$lib/store.svelte'
  import type { Candidate } from '$lib/types'
  import { departmentColor, initials } from '$lib/utils'
  import { Edit2, Plus, Trash2, User } from '@lucide/svelte'

  let showCreate = $state(false)
  let showEdit = $state(false)
  let showDelete = $state(false)
  let editTarget = $state<Candidate | null>(null)
  let deleteTarget = $state<Candidate | null>(null)
  let toastMsg = $state('')
  let toastType = $state<'success' | 'error'>('success')
  let showToast = $state(false)
  let formError = $state('')

  let fName = $state('')
  let fEid = $state('')
  let fPos = $state('')
  let fDept = $state('Keuangan')

  const departments = ['Keuangan', 'Pemasaran', 'Teknologi', 'SDM', 'Operasional', 'Produksi', 'Lainnya']

  function toast(msg: string, type: 'success' | 'error' = 'success') {
    toastMsg = msg
    toastType = type
    showToast = true
  }

  function validate(exceptId?: number): boolean {
    formError = ''
    if (!fName.trim() || !fPos.trim() || !fDept.trim()) {
      formError = 'Nama, jabatan, dan departemen wajib diisi'
      return false
    }
    if (fEid.trim() && store.employeeIdExists(fEid.trim(), exceptId)) {
      formError = 'ID Karyawan sudah digunakan'
      return false
    }
    return true
  }

  function openCreate() {
    fName = ''
    fEid = ''
    fPos = ''
    fDept = 'Keuangan'
    formError = ''
    showCreate = true
  }

  function openEdit(c: Candidate) {
    editTarget = c
    fName = c.name
    fEid = c.employeeId ?? ''
    fPos = c.position
    fDept = c.department
    formError = ''
    showEdit = true
  }

  function submitCreate() {
    if (!validate()) return
    store.addCandidate({
      name: fName.trim(),
      position: fPos.trim(),
      department: fDept,
      employeeId: fEid.trim() || null,
    })
    showCreate = false
    toast('Karyawan berhasil ditambahkan')
  }

  function submitEdit() {
    if (!editTarget || !validate(editTarget.id)) return
    store.updateCandidate(editTarget.id, {
      name: fName.trim(),
      position: fPos.trim(),
      department: fDept,
      employeeId: fEid.trim() || null,
    })
    showEdit = false
    toast('Data karyawan berhasil diperbarui')
  }

  function confirmDelete() {
    if (!deleteTarget) return
    store.deleteCandidate(deleteTarget.id)
    showDelete = false
    toast('Karyawan berhasil dihapus')
  }
</script>

<Toast bind:show={showToast} message={toastMsg} type={toastType} />

<div class="p-8">
  <div class="flex items-center justify-between mb-8">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Data Karyawan</h1>
      <p class="text-slate-500 text-sm mt-1">Kelola kandidat karyawan yang akan dinilai</p>
    </div>
    <button onclick={openCreate} class="btn-primary">
      <Plus size={16} />
      Tambah Karyawan
    </button>
  </div>

  {#if store.candidates.length === 0}
    <div class="card py-20 text-center">
      <User size={32} class="text-slate-200 mx-auto mb-3" />
      <p class="text-slate-400 text-sm">Belum ada karyawan. Tambah karyawan terlebih dahulu.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {#each store.candidates as c}
        <div class="card p-5 hover:shadow-md transition-shadow">
          <div class="flex items-start gap-4">
            <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
              {initials(c.name)}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-slate-900 truncate">{c.name}</p>
              <p class="text-sm text-slate-500 truncate">{c.position}</p>
              <div class="flex items-center gap-2 mt-2">
                <span class="badge {departmentColor(c.department)}">{c.department}</span>
                {#if c.employeeId}
                  <span class="text-xs text-slate-400 font-mono">{c.employeeId}</span>
                {/if}
              </div>
            </div>
            <div class="flex flex-col gap-1 flex-shrink-0">
              <button
                onclick={() => openEdit(c)}
                class="btn-ghost p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <Edit2 size={14} />
              </button>
              <button
                onclick={() => { deleteTarget = c; showDelete = true }}
                class="btn-ghost p-1.5 rounded-lg text-slate-400 hover:text-rose-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Create Modal -->
<Modal bind:open={showCreate} title="Tambah Karyawan">
  <form onsubmit={(e) => { e.preventDefault(); submitCreate() }} class="space-y-4">
    <div>
      <label class="label" for="cn-name">Nama Lengkap</label>
      <input id="cn-name" bind:value={fName} class="input" placeholder="cth. Andi Prasetyo" required />
    </div>
    <div>
      <label class="label" for="cn-eid">ID Karyawan (opsional)</label>
      <input id="cn-eid" bind:value={fEid} class="input" placeholder="cth. EMP-001" />
    </div>
    <div>
      <label class="label" for="cn-pos">Jabatan</label>
      <input id="cn-pos" bind:value={fPos} class="input" placeholder="cth. Staff Accounting" required />
    </div>
    <div>
      <label class="label" for="cn-dept">Departemen</label>
      <select id="cn-dept" bind:value={fDept} class="input">
        {#each departments as dept}
          <option value={dept}>{dept}</option>
        {/each}
      </select>
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
<Modal bind:open={showEdit} title="Edit Karyawan">
  <form onsubmit={(e) => { e.preventDefault(); submitEdit() }} class="space-y-4">
    <div>
      <label class="label" for="en-name">Nama Lengkap</label>
      <input id="en-name" bind:value={fName} class="input" required />
    </div>
    <div>
      <label class="label" for="en-eid">ID Karyawan</label>
      <input id="en-eid" bind:value={fEid} class="input" />
    </div>
    <div>
      <label class="label" for="en-pos">Jabatan</label>
      <input id="en-pos" bind:value={fPos} class="input" required />
    </div>
    <div>
      <label class="label" for="en-dept">Departemen</label>
      <select id="en-dept" bind:value={fDept} class="input">
        {#each departments as dept}
          <option value={dept}>{dept}</option>
        {/each}
      </select>
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
  <Modal bind:open={showDelete} title="Hapus Karyawan" size="sm">
    <p class="text-sm text-slate-600 mb-4">
      Yakin ingin menghapus <strong>{deleteTarget.name}</strong>? Data penilaiannya juga akan terhapus.
    </p>
    <div class="flex justify-end gap-2">
      <button type="button" onclick={() => (showDelete = false)} class="btn-secondary">Batal</button>
      <button type="button" onclick={confirmDelete} class="btn-danger">Hapus</button>
    </div>
  </Modal>
{/if}
