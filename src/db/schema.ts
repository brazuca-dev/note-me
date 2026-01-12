import { int, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core"

// -!- Helper columns
const status = text({ enum: ['active', 'trashed'] }).default('active').notNull()

const id = text().primaryKey()
const owner = text().notNull()

const timeColumns = {
  createdAt: int('created_at').notNull(),
  updatedAt: int('updated_at').notNull()
}

// -!- Schema
export const note = sqliteTable("note", {
  id,
  owner,                         // ID do usuário (Clerk)
  title: text().notNull(),
  content: text(),
  isPined: int('is_pinned', { mode: 'boolean' }).default(false).notNull(),
  status,
  ...timeColumns
})

export const tag = sqliteTable("tag", {
  id,
  owner,                         // Cada usuário tem suas próprias tags
  title: text().notNull(),
  status,
  ...timeColumns
})

export const noteTag = sqliteTable("note_tag", {
  noteId: text('note_id').notNull().references(() => note.id),
  tagId: text('tag_id').notNull().references(() => tag.id),
  owner,
  ...timeColumns
}, (table) => ([
  // A chave primária aqui é a combinação da nota com a tag
  primaryKey({ columns: [table.noteId, table.tagId] })
]))
