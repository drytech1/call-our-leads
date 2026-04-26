import { pgTable, text, serial, timestamp, integer, decimal, boolean, varchar } from 'drizzle-orm/pg-core'

export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 50 }),
  zipCode: varchar('zip_code', { length: 20 }),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const deals = pgTable('deals', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  contactId: integer('contact_id').references(() => contacts.id).notNull(),
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  stage: varchar('stage', { length: 50 }).notNull(),
  expectedCloseDate: varchar('expected_close_date', { length: 50 }),
  notes: text('notes'),
  daysInStage: integer('days_in_stage').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
