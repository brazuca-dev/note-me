import { db } from 'db/client'
import { note, noteTag } from 'db/tables'
import { and, eq, getTableColumns, gte, sql } from 'drizzle-orm'
import { ApiError } from 'utils/api-error.util'
import { HttpStatus } from 'utils/http-response.util'
import type {
	CreateNote,
	SyncNotes,
	ToggleTag,
	UpdateNote,
} from 'validation/note.validation'
import type {
	IdentificatorOfRowAffected,
	IdentificatorOfRowsAffected,
	DataSync,
	RowCollection,
  CompoundIdentificatorsOfRowAffected,
} from './_.service.interfaces'

const create = async (noteToCreate: CreateNote): IdentificatorOfRowAffected => {
	const [{ id }] = await db
		.insert(note)
		.values(noteToCreate)
		.returning({ id: note.id })

	if (!id)
		throw new ApiError(
			HttpStatus.INTERNAL_SERVER_ERROR,
			'Failed to create note.'
		)
	return id
}

const read = async (
	owner: string,
	timestamp?: number
): RowCollection<typeof note> => {
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

const update = async (
	owner: string,
	noteToUpdate: UpdateNote
): IdentificatorOfRowAffected => {
	const [{ id }] = await db
		.update(note)
		.set(noteToUpdate)
		.where(and(eq(note.owner, owner), eq(note.id, noteToUpdate.id)))
		.returning({ id: note.id })

	if (!id)
		throw new ApiError(
			HttpStatus.NOT_FOUND,
			'Note not found or you do not have permission.'
		)

	return id
}

const upsert = async (
	owner: string,
	noteToUpsert: CreateNote[]
): IdentificatorOfRowsAffected => {
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

const sync = async (
	owner: string,
	notesToSync: SyncNotes,
	timestamp: number
): DataSync<typeof note> => {
	const [notesPushed, notesToPull] = await Promise.all([
		await upsert(owner, notesToSync),
		await read(owner, timestamp),
	])

	return {
		data: {
			pushed: notesPushed,
			toPull: notesToPull,
		},
	}
}

const toggleTag = async (
	noteTagToToggle: ToggleTag,
	state: boolean
): CompoundIdentificatorsOfRowAffected<{ noteId: string, tagId: string }> => {
  const identificatorsReturning = { noteId: noteTag.noteId, tagId: noteTag.tagId }
    
	const [response] = state
		? await db
				.insert(noteTag)
				.values(noteTagToToggle)
				.returning(identificatorsReturning)
		: await db
				.delete(noteTag)
				.where(
					and(
						eq(noteTag.owner, noteTagToToggle.owner),
						eq(noteTag.noteId, noteTagToToggle.noteId),
						eq(noteTag.tagId, noteTagToToggle.tagId)
					)
				)
				.returning(identificatorsReturning)

	return response
}

export const NoteService = {
	create,
	read,
	update,
	sync,
	toggleTag,
}
