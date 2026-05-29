<script lang="ts">
  import { enhance } from '$app/forms'
  import Modal from '$lib/components/Modal.svelte'
  import Toast from '$lib/components/Toast.svelte'
  import type { Candidate } from '$lib/server/db/schema'
  import { departmentColor, initials } from '$lib/utils'
  import { Edit2, Plus, Trash2, User } from '@lucide/svelte'
  import type { ActionData, PageData } from './$types'

  let { data, form }: { data: PageData; form: ActionData } = $props()

  let showCreate = $state(false)
  let showEdit = $state(false)
  let showDelete = $state(false)
  let editTarget = $state<Candidate | null>(null)
  let deleteTarget = $state<Candidate | null>(null)
  let toastMsg = $state('')
  let showToast = $state(false)

  $effect(() => {
    if (form?.success) {
      const msgs: Record<string, string> = {
        create: 'Karyawan berhasil ditambahkan',
        update: 'Data karyawan berhasil diperbarui',
        delete: 'Karyawan berhasil dihapus',
      }
      toastMsg = msgs[form.action ?? ''] ?? 'Berhasil'
      showToast = true
      showCreate = false
      showEdit = false
      showDelete = false
    }
  })

  const departments = ['Keuangan', 'Pemasaran', 'Teknologi', 'SDM', 'Operasional', 'Produksi', 'Lainnya']
</script>

<Toast bind:show={showToast} message={toastMsg} type="success" />

<div class="p-8">
  <div class="flex items-center justify-between mb-8">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Data Karyawan</h1>
      <p class="text-slate-500 text-sm mt-1">Kelola kandidat karyawan yang akan dinilai</p>
    </div>
    <button onclick={() => (showCreate = true)} class="btn-primary">
      <Plus size={16} />
      Tambah Karyawan
    </button>
  </div>

  {#if data.candidates.length === 0}
    <div class="card py-20 text-center">
      <User size={32} class="text-slate-200 mx-auto mb-3" />
      <p class="text-slate-400 text-sm">Belum ada karyawan. Tambah karyawan terlebih dahulu.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {#each data.candidates as c}
        <div class="card p-5 hover:shadow-md transition-shadow">
          <div class="flex items-start gap-4">
            <!-- Avatar -->
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
                onclick={() => { editTarget = { ...c }; showEdit = true }}
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
  <form method="POST" action="?/create" use:enhance class="space-y-4">
    <div>
      <label class="label" for="cn-name">Nama Lengkap</label>
      <input id="cn-name" name="name" class="input" placeholder="cth. Andi Prasetyo" required />
    </div>
    <div>
      <label class="label" for="cn-eid">ID Karyawan (opsional)</label>
      <input id="cn-eid" name="employeeId" class="input" placeholder="cth. EMP-001" />
    </div>
    <div>
      <label class="label" for="cn-pos">Jabatan</label>
      <input id="cn-pos" name="position" class="input" placeholder="cth. Staff Accounting" required />
    </div>
    <div>
      <label class="label" for="cn-dept">Departemen</label>
      <select id="cn-dept" name="department" class="input">
        {#each departments as dept}
          <option value={dept}>{dept}</option>
        {/each}
      </select>
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
  <Modal bind:open={showEdit} title="Edit Karyawan">
    <form method="POST" action="?/update" use:enhance class="space-y-4">
      <input type="hidden" name="id" value={editTarget.id} />
      <div>
        <label class="label" for="en-name">Nama Lengkap</label>
        <input id="en-name" name="name" class="input" value={editTarget.name} required />
      </div>
      <div>
        <label class="label" for="en-eid">ID Karyawan</label>
        <input id="en-eid" name="employeeId" class="input" value={editTarget.employeeId ?? ''} />
      </div>
      <div>
        <label class="label" for="en-pos">Jabatan</label>
        <input id="en-pos" name="position" class="input" value={editTarget.position} required />
      </div>
      <div>
        <label class="label" for="en-dept">Departemen</label>
        <select id="en-dept" name="department" class="input">
          {#each departments as dept}
            <option value={dept} selected={editTarget.department === dept}>{dept}</option>
          {/each}
        </select>
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
  <Modal bind:open={showDelete} title="Hapus Karyawan" size="sm">
    <p class="text-sm text-slate-600 mb-4">
      Yakin ingin menghapus <strong>{deleteTarget.name}</strong>? Data penilaiannya juga akan terhapus.
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
