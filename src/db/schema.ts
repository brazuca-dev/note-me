import { int, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core"
import { identifierColumns, metaDataColumns, timeColumns } from "./columns-helpers.ts"

const note = sqliteTable("note", {
  ...identifierColumns,
  title: text().notNull(),
  content: text(),
  isPined:
    int('is_pinned', { mode: 'boolean' })
    .default(false)
    .notNull(),
  ...metaDataColumns,
  ...timeColumns
})

const tag = sqliteTable("tag", {
  ...identifierColumns,
  title: text().notNull(),
  ...metaDataColumns,
  ...timeColumns
})

const noteTag = sqliteTable("note_tag", {
  gid: identifierColumns.gid,
  note: int().notNull(),
  tag: int().notNull(),
  owner: metaDataColumns.owner,
  ...timeColumns
})

export { note, tag, noteTag }
