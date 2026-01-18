import { db } from 'db/client'
import { note } from 'db/tables'
import { and, eq, getTableColumns, gte, sql } from 'drizzle-orm'
import { ApiError } from 'utils/api-error.util'
import { HttpStatus } from 'utils/http-response.util'
import type {
	CreateNote,
	SyncNotes,
	UpdateNote,
} from 'validation/note.validation'

const create = async (noteToCreate: CreateNote) => {
	const result = await db
		.insert(note)
		.values(noteToCreate)
		.returning({ id: note.id })

	if (result.length === 0)
		throw new ApiError(
			HttpStatus.INTERNAL_SERVER_ERROR,
			'Failed to create note.'
		)
	return result[0].id
}

const read = async (owner: string, timestamp?: number) => {
	const filters = [eq(note.owner, owner)]

	if (timestamp) filters.push(gte(note.updatedAt, timestamp))

	const results = await db
		.select()
		.from(note)
		.where(and(...filters))

	if (results.length === 0)
		throw new ApiError(HttpStatus.NOT_FOUND, 'No notes found.')

	return results
}

const upsert = async (owner: string, noteToUpsert: SyncNotes) => {
	if (noteToUpsert.length === 0) return []

	const columns = getTableColumns(note)

	const results = await db
		.insert(note)
		.values(noteToUpsert)
		.onConflictDoUpdate({
			target: note.id,
			set: {
				title: sql.raw(`excluded.${columns.title.name}`),
				content: sql.raw(`excluded.${columns.content.name}`),
				isPined: sql.raw(`excluded.${columns.isPined.name}`),
				status: sql.raw(`excluded.${columns.status.name}`),
				updatedAt: sql.raw(`excluded.${columns.updatedAt.name}`),
			},
			setWhere: sql`${note.owner} = ${owner} AND excluded.${sql.raw(columns.updatedAt.name)} >= ${note.updatedAt}`,
		})
		.returning({ id: note.id })

	if (results.length === 0)
		throw new ApiError(
			HttpStatus.INTERNAL_SERVER_ERROR,
			'Failed to upsert notes.'
		)
	return results
}

const update = async (owner: string, noteToUpdate: UpdateNote) => {
	const result = await db
		.update(note)
		.set(noteToUpdate)
		.where(and(eq(note.owner, owner), eq(note.id, noteToUpdate.id)))
		.returning({ id: note.id })

	if (result.length === 0)
		throw new ApiError(
			HttpStatus.NOT_FOUND,
			'Note not found or you do not have permission.'
		)

	return result[0].id
}

export const NoteService = {
	create,
	read,
	upsert,
	update,
}
