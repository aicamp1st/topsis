import { db } from '$lib/server/db'
import { criteria } from '$lib/server/db/schema'
import { fail } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const rows = await db.select().from(criteria).orderBy(criteria.id)
  const totalWeight = rows.reduce((s, c) => s + c.weight, 0)
  return { criteria: rows, totalWeight: Math.round(totalWeight * 1000) / 1000 }
}

export const actions: Actions = {
  create: async ({ request }) => {
    const fd = await request.formData()
    const name = String(fd.get('name') ?? '').trim()
    const weight = parseFloat(String(fd.get('weight') ?? '0'))
    const type = String(fd.get('type') ?? 'benefit') as 'benefit' | 'cost'
    const description = String(fd.get('description') ?? '').trim()

    if (!name) return fail(400, { error: 'Nama kriteria wajib diisi' })
    if (isNaN(weight) || weight <= 0 || weight > 1)
      return fail(400, { error: 'Bobot harus antara 0 dan 1' })

    await db.insert(criteria).values({ name, weight, type, description })
    return { success: true, action: 'create' }
  },

  update: async ({ request }) => {
    const fd = await request.formData()
    const id = parseInt(String(fd.get('id') ?? '0'))
    const name = String(fd.get('name') ?? '').trim()
    const weight = parseFloat(String(fd.get('weight') ?? '0'))
    const type = String(fd.get('type') ?? 'benefit') as 'benefit' | 'cost'
    const description = String(fd.get('description') ?? '').trim()

    if (!name) return fail(400, { error: 'Nama kriteria wajib diisi' })
    if (isNaN(weight) || weight <= 0 || weight > 1)
      return fail(400, { error: 'Bobot harus antara 0 dan 1' })

    await db.update(criteria).set({ name, weight, type, description }).where(eq(criteria.id, id))
    return { success: true, action: 'update' }
  },

  delete: async ({ request }) => {
    const fd = await request.formData()
    const id = parseInt(String(fd.get('id') ?? '0'))
    await db.delete(criteria).where(eq(criteria.id, id))
    return { success: true, action: 'delete' }
  },
}
