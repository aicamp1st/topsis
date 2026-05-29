import { db } from '$lib/server/db'
import { assessments, candidates, criteria } from '$lib/server/db/schema'
import { calculateTopsis } from '$lib/server/topsis'
import type { PageServerLoad } from './$types'
import { sql } from 'drizzle-orm'

export const load: PageServerLoad = async () => {
  const [totalCriteria, totalCandidates, assessmentCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(criteria),
    db.select({ count: sql<number>`count(*)` }).from(candidates),
    db.select({ count: sql<number>`count(*)` }).from(assessments),
  ])

  const allCriteria = await db.select().from(criteria)
  const allCandidates = await db.select().from(candidates)
  const allAssessments = await db.select().from(assessments)

  let topResult: { name: string; closeness: number; rank: number } | null = null

  if (allCandidates.length >= 2 && allCriteria.length >= 2 && allAssessments.length > 0) {
    const matrix: Record<number, Record<number, number>> = {}
    for (const a of allAssessments) {
      if (!matrix[a.candidateId]) matrix[a.candidateId] = {}
      matrix[a.candidateId][a.criteriaId] = a.value
    }
    try {
      const result = calculateTopsis({
        candidates: allCandidates.map((c) => ({
          id: c.id,
          name: c.name,
          position: c.position,
          department: c.department,
        })),
        criteria: allCriteria.map((c) => ({
          id: c.id,
          name: c.name,
          weight: c.weight,
          type: c.type as 'benefit' | 'cost',
        })),
        matrix,
      })
      topResult = result.results[0]
        ? {
            name: result.results[0].name,
            closeness: result.results[0].closeness,
            rank: result.results[0].rank,
          }
        : null
    } catch {
      topResult = null
    }
  }

  const totalWeight = allCriteria.reduce((s, c) => s + c.weight, 0)
  const filledCells = allAssessments.length
  const totalCells = allCandidates.length * allCriteria.length
  const completeness = totalCells === 0 ? 0 : Math.round((filledCells / totalCells) * 100)

  return {
    stats: {
      totalCriteria: totalCriteria[0].count,
      totalCandidates: totalCandidates[0].count,
      completeness,
      totalWeight: Math.round(totalWeight * 100) / 100,
    },
    topResult,
  }
}
