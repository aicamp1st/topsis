import { integer, real, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'

export const criteria = sqliteTable('criteria', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  weight: real('weight').notNull(),
  type: text('type', { enum: ['benefit', 'cost'] }).notNull().default('benefit'),
  description: text('description').default(''),
})

export const candidates = sqliteTable('candidates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  position: text('position').notNull(),
  department: text('department').notNull(),
  employeeId: text('employee_id').unique(),
})

export const assessments = sqliteTable(
  'assessments',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    candidateId: integer('candidate_id')
      .notNull()
      .references(() => candidates.id, { onDelete: 'cascade' }),
    criteriaId: integer('criteria_id')
      .notNull()
      .references(() => criteria.id, { onDelete: 'cascade' }),
    value: real('value').notNull().default(0),
  },
  (t) => [unique().on(t.candidateId, t.criteriaId)],
)

export type Criteria = typeof criteria.$inferSelect
export type NewCriteria = typeof criteria.$inferInsert
export type Candidate = typeof candidates.$inferSelect
export type NewCandidate = typeof candidates.$inferInsert
export type Assessment = typeof assessments.$inferSelect
export type NewAssessment = typeof assessments.$inferInsert
