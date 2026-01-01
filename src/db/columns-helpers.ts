import { int, text } from "drizzle-orm/sqlite-core"

const timeColumns = {
  createdAt: int().notNull(),
  updatedAt: int().notNull()
}

const metaDataColumns = {
  owner: int().notNull(), // global user id
  status: text({ enum: ['default', 'trashed'] }).default('default').notNull()
}

const identifierColumns = {
  gid: int().primaryKey({ autoIncrement: true }), // global id
  cid: int().notNull(), // client id
}

export { timeColumns, metaDataColumns, identifierColumns }
