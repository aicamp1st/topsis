import { db } from '$lib/server/db'
import { assessments, candidates } from '$lib/server/db/schema'
import { fail } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const rows = await db.select().from(candidates).orderBy(candidates.id)
  return { candidates: rows }
}

export const actions: Actions = {
  create: async ({ request }) => {
    const fd = await request.formData()
    const name = String(fd.get('name') ?? '').trim()
    const position = String(fd.get('position') ?? '').trim()
    const department = String(fd.get('department') ?? '').trim()
    const employeeId = String(fd.get('employeeId') ?? '').trim() || null

    if (!name || !position || !department)
      return fail(400, { error: 'Nama, jabatan, dan departemen wajib diisi' })

    try {
      await db.insert(candidates).values({ name, position, department, employeeId })
    } catch {
      return fail(400, { error: 'ID Karyawan sudah digunakan' })
    }
    return { success: true, action: 'create' }
  },

  update: async ({ request }) => {
    const fd = await request.formData()
    const id = parseInt(String(fd.get('id') ?? '0'))
    const name = String(fd.get('name') ?? '').trim()
    const position = String(fd.get('position') ?? '').trim()
    const department = String(fd.get('department') ?? '').trim()
    const employeeId = String(fd.get('employeeId') ?? '').trim() || null

    if (!name || !position || !department)
      return fail(400, { error: 'Nama, jabatan, dan departemen wajib diisi' })

    await db
      .update(candidates)
      .set({ name, position, department, employeeId })
      .where(eq(candidates.id, id))
    return { success: true, action: 'update' }
  },

  delete: async ({ request }) => {
    const fd = await request.formData()
    const id = parseInt(String(fd.get('id') ?? '0'))
    await db.delete(assessments).where(eq(assessments.candidateId, id))
    await db.delete(candidates).where(eq(candidates.id, id))
    return { success: true, action: 'delete' }
  },
}
