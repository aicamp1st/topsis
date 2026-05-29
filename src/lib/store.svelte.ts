import { browser } from '$app/environment'
import type { Candidate, Criteria, Matrix } from './types'
import { calculateTopsis, type TopsisOutput } from './topsis'

const STORAGE_KEY = 'spk-topsis-v1'

interface DataShape {
  criteria: Criteria[]
  candidates: Candidate[]
  matrix: Matrix
}

// ── Data contoh awal (sama dengan seed versi database) ──────────
function seedData(): DataShape {
  const criteria: Criteria[] = [
    { id: 1, name: 'Kedisiplinan', weight: 0.25, type: 'benefit', description: 'Tingkat kedisiplinan karyawan dalam bekerja' },
    { id: 2, name: 'Prestasi Kerja', weight: 0.3, type: 'benefit', description: 'Pencapaian target dan kualitas hasil kerja' },
    { id: 3, name: 'Kerjasama Tim', weight: 0.2, type: 'benefit', description: 'Kemampuan bekerja sama dengan rekan kerja' },
    { id: 4, name: 'Inisiatif', weight: 0.15, type: 'benefit', description: 'Kemampuan mengambil inisiatif dan inovasi' },
    { id: 5, name: 'Absensi (Hari Absent)', weight: 0.1, type: 'cost', description: 'Jumlah hari tidak masuk kerja (semakin sedikit semakin baik)' },
  ]
  const candidates: Candidate[] = [
    { id: 1, name: 'Andi Prasetyo', position: 'Staff Accounting', department: 'Keuangan', employeeId: 'EMP-001' },
    { id: 2, name: 'Budi Santoso', position: 'Staff Marketing', department: 'Pemasaran', employeeId: 'EMP-002' },
    { id: 3, name: 'Citra Dewi', position: 'Staff IT', department: 'Teknologi', employeeId: 'EMP-003' },
    { id: 4, name: 'Dian Kusuma', position: 'Staff HR', department: 'SDM', employeeId: 'EMP-004' },
    { id: 5, name: 'Eko Wijaya', position: 'Staff Operasional', department: 'Operasional', employeeId: 'EMP-005' },
  ]
  const raw: Record<number, number[]> = {
    1: [8, 7, 8, 7, 2],
    2: [7, 9, 7, 8, 1],
    3: [9, 8, 9, 9, 0],
    4: [8, 7, 9, 7, 3],
    5: [7, 8, 8, 6, 2],
  }
  const matrix: Matrix = {}
  for (const c of candidates) {
    matrix[c.id] = {}
    criteria.forEach((cr, j) => {
      matrix[c.id][cr.id] = raw[c.id][j]
    })
  }
  return { criteria, candidates, matrix }
}

function loadData(): DataShape {
  if (!browser) return { criteria: [], candidates: [], matrix: {} }
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const seeded = seedData()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
    return seeded
  }
  try {
    const parsed = JSON.parse(raw) as DataShape
    return {
      criteria: parsed.criteria ?? [],
      candidates: parsed.candidates ?? [],
      matrix: parsed.matrix ?? {},
    }
  } catch {
    return seedData()
  }
}

const state = $state<DataShape>(loadData())

function persist() {
  if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function nextId(items: { id: number }[]): number {
  return items.reduce((max, it) => Math.max(max, it.id), 0) + 1
}

// ── Public API ──────────────────────────────────────────────────
export const store = {
  get criteria() {
    return state.criteria
  },
  get candidates() {
    return state.candidates
  },
  get matrix() {
    return state.matrix
  },

  get totalWeight() {
    return Math.round(state.criteria.reduce((s, c) => s + c.weight, 0) * 1000) / 1000
  },

  get filledCells() {
    let count = 0
    for (const c of state.candidates) {
      for (const cr of state.criteria) {
        const v = state.matrix[c.id]?.[cr.id]
        if (v !== undefined && v !== null) count++
      }
    }
    return count
  },

  get totalCells() {
    return state.candidates.length * state.criteria.length
  },

  get completeness() {
    return this.totalCells === 0 ? 0 : Math.round((this.filledCells / this.totalCells) * 100)
  },

  // ── Kriteria ──
  addCriteria(data: Omit<Criteria, 'id'>) {
    const id = nextId(state.criteria)
    state.criteria.push({ ...data, id })
    persist()
  },
  updateCriteria(id: number, data: Omit<Criteria, 'id'>) {
    const idx = state.criteria.findIndex((c) => c.id === id)
    if (idx !== -1) state.criteria[idx] = { ...data, id }
    persist()
  },
  deleteCriteria(id: number) {
    state.criteria = state.criteria.filter((c) => c.id !== id)
    for (const cid of Object.keys(state.matrix)) {
      delete state.matrix[Number(cid)][id]
    }
    persist()
  },

  // ── Karyawan ──
  employeeIdExists(employeeId: string, exceptId?: number): boolean {
    if (!employeeId) return false
    return state.candidates.some((c) => c.employeeId === employeeId && c.id !== exceptId)
  },
  addCandidate(data: Omit<Candidate, 'id'>) {
    const id = nextId(state.candidates)
    state.candidates.push({ ...data, id })
    state.matrix[id] = {}
    persist()
  },
  updateCandidate(id: number, data: Omit<Candidate, 'id'>) {
    const idx = state.candidates.findIndex((c) => c.id === id)
    if (idx !== -1) state.candidates[idx] = { ...data, id }
    persist()
  },
  deleteCandidate(id: number) {
    state.candidates = state.candidates.filter((c) => c.id !== id)
    delete state.matrix[id]
    persist()
  },

  // ── Penilaian ──
  setValue(candidateId: number, criteriaId: number, value: number) {
    if (!state.matrix[candidateId]) state.matrix[candidateId] = {}
    state.matrix[candidateId][criteriaId] = value
  },
  saveMatrix() {
    persist()
  },

  // ── TOPSIS ──
  compute(): { ready: boolean; message: string | null; result: TopsisOutput | null } {
    const { criteria, candidates, matrix } = state
    if (candidates.length < 2 || criteria.length < 2) {
      return { ready: false, message: 'Butuh minimal 2 karyawan dan 2 kriteria', result: null }
    }
    const totalNeeded = candidates.length * criteria.length
    if (this.filledCells < totalNeeded) {
      return {
        ready: false,
        message: `Penilaian belum lengkap. ${this.filledCells}/${totalNeeded} sel sudah diisi.`,
        result: null,
      }
    }
    const totalWeight = criteria.reduce((s, c) => s + c.weight, 0)
    if (Math.abs(totalWeight - 1) > 0.001) {
      return {
        ready: false,
        message: `Total bobot kriteria harus 1.00, saat ini: ${totalWeight.toFixed(3)}`,
        result: null,
      }
    }
    try {
      const result = calculateTopsis({
        candidates: candidates.map((c) => ({
          id: c.id,
          name: c.name,
          position: c.position,
          department: c.department,
        })),
        criteria: criteria.map((c) => ({ id: c.id, name: c.name, weight: c.weight, type: c.type })),
        matrix,
      })
      return { ready: true, message: null, result }
    } catch (e) {
      return { ready: false, message: String(e), result: null }
    }
  },

  topResult(): { name: string; closeness: number; rank: number } | null {
    const { result } = this.compute()
    if (!result || !result.results[0]) return null
    const r = result.results[0]
    return { name: r.name, closeness: r.closeness, rank: r.rank }
  },

  resetToSeed() {
    const seeded = seedData()
    state.criteria = seeded.criteria
    state.candidates = seeded.candidates
    state.matrix = seeded.matrix
    persist()
  },

  clearAll() {
    state.criteria = []
    state.candidates = []
    state.matrix = {}
    persist()
  },
}
