import { db } from '$lib/server/db'
import { assessments, candidates, criteria } from '$lib/server/db/schema'
import { calculateTopsis } from '$lib/server/topsis'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const [allCriteria, allCandidates, allAssessments] = await Promise.all([
    db.select().from(criteria).orderBy(criteria.id),
    db.select().from(candidates).orderBy(candidates.id),
    db.select().from(assessments),
  ])

  if (allCandidates.length < 2 || allCriteria.length < 2) {
    return { ready: false, message: 'Butuh minimal 2 karyawan dan 2 kriteria', result: null }
  }

  const matrix: Record<number, Record<number, number>> = {}
  for (const a of allAssessments) {
    if (!matrix[a.candidateId]) matrix[a.candidateId] = {}
    matrix[a.candidateId][a.criteriaId] = a.value
  }

  const totalFilled = allAssessments.length
  const totalNeeded = allCandidates.length * allCriteria.length
  if (totalFilled < totalNeeded) {
    return {
      ready: false,
      message: `Penilaian belum lengkap. ${totalFilled}/${totalNeeded} sel sudah diisi.`,
      result: null,
    }
  }

  const totalWeight = allCriteria.reduce((s, c) => s + c.weight, 0)
  if (Math.abs(totalWeight - 1) > 0.001) {
    return {
      ready: false,
      message: `Total bobot kriteria harus 1.00, saat ini: ${totalWeight.toFixed(3)}`,
      result: null,
    }
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
    return { ready: true, message: null, result, criteria: allCriteria, candidates: allCandidates }
  } catch (e) {
    return { ready: false, message: String(e), result: null }
  }
}
