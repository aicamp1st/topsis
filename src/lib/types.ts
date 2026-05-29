export interface Criteria {
  id: number
  name: string
  weight: number
  type: 'benefit' | 'cost'
  description: string
}

export interface Candidate {
  id: number
  name: string
  position: string
  department: string
  employeeId: string | null
}

// matrix[candidateId][criteriaId] = nilai mentah
export type Matrix = Record<number, Record<number, number>>
