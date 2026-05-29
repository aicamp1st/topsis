export interface TopsisCandidate {
  id: number
  name: string
  position: string
  department: string
}

export interface TopsisCriteria {
  id: number
  name: string
  weight: number
  type: 'benefit' | 'cost'
}

export interface TopsisInput {
  candidates: TopsisCandidate[]
  criteria: TopsisCriteria[]
  // matrix[candidateId][criteriaId] = raw value
  matrix: Record<number, Record<number, number>>
}

export interface TopsisSteps {
  decisionMatrix: number[][]      // Step 1: raw matrix
  normalizedMatrix: number[][]    // Step 2: vector normalized
  weightedMatrix: number[][]      // Step 3: weight * normalized
  idealPositive: number[]         // A+ per criteria
  idealNegative: number[]         // A- per criteria
  distancePlus: number[]          // D+ per candidate
  distanceMinus: number[]         // D- per candidate
}

export interface TopsisResult {
  candidateId: number
  name: string
  position: string
  department: string
  distancePlus: number
  distanceMinus: number
  closeness: number  // C (0–1, higher = better)
  rank: number
}

export interface TopsisOutput {
  results: TopsisResult[]
  steps: TopsisSteps
  candidateLabels: string[]
  criteriaLabels: string[]
}

export function calculateTopsis(input: TopsisInput): TopsisOutput {
  const { candidates, criteria, matrix } = input
  const n = candidates.length
  const m = criteria.length

  if (n === 0 || m === 0) {
    throw new Error('Data tidak cukup untuk kalkulasi TOPSIS')
  }

  // ── Step 1: Decision matrix ───────────────────────────────────
  const decisionMatrix: number[][] = candidates.map((c) =>
    criteria.map((cr) => matrix[c.id]?.[cr.id] ?? 0),
  )

  // ── Step 2: Normalized matrix (vector normalization) ─────────
  // r[i][j] = x[i][j] / √(Σ x[k][j]²)
  const normalizedMatrix: number[][] = Array.from({ length: n }, () => Array(m).fill(0))
  for (let j = 0; j < m; j++) {
    const sumSq = candidates.reduce((acc, _, i) => acc + decisionMatrix[i][j] ** 2, 0)
    const denom = Math.sqrt(sumSq)
    for (let i = 0; i < n; i++) {
      normalizedMatrix[i][j] = denom === 0 ? 0 : decisionMatrix[i][j] / denom
    }
  }

  // ── Step 3: Weighted normalized matrix ───────────────────────
  // v[i][j] = w[j] * r[i][j]
  const weightedMatrix: number[][] = normalizedMatrix.map((row) =>
    row.map((val, j) => criteria[j].weight * val),
  )

  // ── Step 4: Ideal solutions ───────────────────────────────────
  const idealPositive: number[] = Array(m)
  const idealNegative: number[] = Array(m)
  for (let j = 0; j < m; j++) {
    const col = candidates.map((_, i) => weightedMatrix[i][j])
    const isBenefit = criteria[j].type === 'benefit'
    idealPositive[j] = isBenefit ? Math.max(...col) : Math.min(...col)
    idealNegative[j] = isBenefit ? Math.min(...col) : Math.max(...col)
  }

  // ── Step 5: Euclidean distances ───────────────────────────────
  const distancePlus: number[] = candidates.map((_, i) =>
    Math.sqrt(criteria.reduce((acc, _, j) => acc + (weightedMatrix[i][j] - idealPositive[j]) ** 2, 0)),
  )
  const distanceMinus: number[] = candidates.map((_, i) =>
    Math.sqrt(criteria.reduce((acc, _, j) => acc + (weightedMatrix[i][j] - idealNegative[j]) ** 2, 0)),
  )

  // ── Step 6: Closeness coefficient ────────────────────────────
  // C[i] = D-[i] / (D+[i] + D-[i])
  const closeness: number[] = candidates.map((_, i) => {
    const sum = distancePlus[i] + distanceMinus[i]
    return sum === 0 ? 0 : distanceMinus[i] / sum
  })

  // ── Step 7: Rank (descending closeness) ──────────────────────
  const ranks: number[] = Array(n)
  closeness
    .map((c, i) => ({ c, i }))
    .sort((a, b) => b.c - a.c)
    .forEach(({ i }, rank) => {
      ranks[i] = rank + 1
    })

  const results: TopsisResult[] = candidates
    .map((c, i) => ({
      candidateId: c.id,
      name: c.name,
      position: c.position,
      department: c.department,
      distancePlus: distancePlus[i],
      distanceMinus: distanceMinus[i],
      closeness: closeness[i],
      rank: ranks[i],
    }))
    .sort((a, b) => a.rank - b.rank)

  return {
    results,
    steps: {
      decisionMatrix,
      normalizedMatrix,
      weightedMatrix,
      idealPositive,
      idealNegative,
      distancePlus,
      distanceMinus,
    },
    candidateLabels: candidates.map((c) => c.name),
    criteriaLabels: criteria.map((c) => c.name),
  }
}

export function round(val: number, dp = 4): number {
  return Math.round(val * 10 ** dp) / 10 ** dp
}
