import { db } from '$lib/server/db'
import { assessments, candidates, criteria } from '$lib/server/db/schema'
import { and, eq } from 'drizzle-orm'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const [allCriteria, allCandidates, allAssessments] = await Promise.all([
    db.select().from(criteria).orderBy(criteria.id),
    db.select().from(candidates).orderBy(candidates.id),
    db.select().from(assessments),
  ])

  // matrix[candidateId][criteriaId] = value
  const matrix: Record<number, Record<number, number>> = {}
  for (const c of allCandidates) matrix[c.id] = {}
  for (const a of allAssessments) {
    if (matrix[a.candidateId]) matrix[a.candidateId][a.criteriaId] = a.value
  }

  return { criteria: allCriteria, candidates: allCandidates, matrix }
}

export const actions: Actions = {
  save: async ({ request }) => {
    const fd = await request.formData()
    const updates: { candidateId: number; criteriaId: number; value: number }[] = []

    for (const [key, val] of fd.entries()) {
      const match = key.match(/^v_(\d+)_(\d+)$/)
      if (match) {
        const candidateId = parseInt(match[1])
        const criteriaId = parseInt(match[2])
        const value = parseFloat(String(val))
        if (!isNaN(value) && value >= 0) {
          updates.push({ candidateId, criteriaId, value })
        }
      }
    }

    for (const u of updates) {
      const existing = await db
        .select()
        .from(assessments)
        .where(and(eq(assessments.candidateId, u.candidateId), eq(assessments.criteriaId, u.criteriaId)))
        .limit(1)

      if (existing.length > 0) {
        await db
          .update(assessments)
          .set({ value: u.value })
          .where(and(eq(assessments.candidateId, u.candidateId), eq(assessments.criteriaId, u.criteriaId)))
      } else {
        await db.insert(assessments).values(u)
      }
    }

    return { success: true }
  },
}
