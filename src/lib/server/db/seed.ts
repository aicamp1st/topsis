import { db, ensureSchema } from './index'
import { assessments, candidates, criteria } from './schema'

await ensureSchema()

await db.delete(assessments)
await db.delete(candidates)
await db.delete(criteria)

const insertedCriteria = await db
  .insert(criteria)
  .values([
    { name: 'Kedisiplinan', weight: 0.25, type: 'benefit', description: 'Tingkat kedisiplinan karyawan dalam bekerja' },
    { name: 'Prestasi Kerja', weight: 0.30, type: 'benefit', description: 'Pencapaian target dan kualitas hasil kerja' },
    { name: 'Kerjasama Tim', weight: 0.20, type: 'benefit', description: 'Kemampuan bekerja sama dengan rekan kerja' },
    { name: 'Inisiatif', weight: 0.15, type: 'benefit', description: 'Kemampuan mengambil inisiatif dan inovasi' },
    { name: 'Absensi (Hari Absent)', weight: 0.10, type: 'cost', description: 'Jumlah hari tidak masuk kerja (semakin sedikit semakin baik)' },
  ])
  .returning()

const insertedCandidates = await db
  .insert(candidates)
  .values([
    { name: 'Andi Prasetyo', position: 'Staff Accounting', department: 'Keuangan', employeeId: 'EMP-001' },
    { name: 'Budi Santoso', position: 'Staff Marketing', department: 'Pemasaran', employeeId: 'EMP-002' },
    { name: 'Citra Dewi', position: 'Staff IT', department: 'Teknologi', employeeId: 'EMP-003' },
    { name: 'Dian Kusuma', position: 'Staff HR', department: 'SDM', employeeId: 'EMP-004' },
    { name: 'Eko Wijaya', position: 'Staff Operasional', department: 'Operasional', employeeId: 'EMP-005' },
  ])
  .returning()

const matrix: Record<number, number[]> = {
  [insertedCandidates[0].id]: [8, 7, 8, 7, 2],
  [insertedCandidates[1].id]: [7, 9, 7, 8, 1],
  [insertedCandidates[2].id]: [9, 8, 9, 9, 0],
  [insertedCandidates[3].id]: [8, 7, 9, 7, 3],
  [insertedCandidates[4].id]: [7, 8, 8, 6, 2],
}

const assessmentValues = insertedCandidates.flatMap((c) =>
  insertedCriteria.map((cr, j) => ({
    candidateId: c.id,
    criteriaId: cr.id,
    value: matrix[c.id][j],
  })),
)

await db.insert(assessments).values(assessmentValues)

console.log('✓ Seed berhasil! Data contoh sudah dimasukkan.')
process.exit(0)
