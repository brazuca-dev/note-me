import { int, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core'

// -< Helper columns >-
const status = text({ enum: ['active', 'trashed'] })
	.default('active')
	.notNull()

const id = text().primaryKey()
const owner = text().notNull()

const timeColumns = {
	createdAt: int('created_at').notNull(),
	updatedAt: int('updated_at').notNull(),
}

// -< Tables >-
export const note = sqliteTable('note', {
	id,
	title: text().notNull(),
	content: text().notNull(),
	owner,
	isPined: int('is_pinned', { mode: 'boolean' }).default(false).notNull(),
	status,
	...timeColumns,
})

export const tag = sqliteTable('tag', {
	id,
	title: text().notNull(),
	owner,
	status,
	...timeColumns,
})

export const noteTag = sqliteTable(
	'note_tag',
	{
		noteId: text('note_id')
			.notNull()
			.references(() => note.id),
		tagId: text('tag_id')
			.notNull()
			.references(() => tag.id),
		owner,
		...timeColumns,
	},
	table => [primaryKey({ columns: [table.noteId, table.tagId] })]
)
