import { db } from 'db/client.db'
import { tag } from 'db/tables.db'
import { and, eq, getTableColumns, gte, sql } from 'drizzle-orm'
import { ApiError } from 'utils/api-error.util'
import { HttpStatus } from 'utils/http-response.util'
import type { CreateTag, SyncTags, UpdateTag } from 'validation/tag.validation'
import type {
	IdentificatorOfRowAffected,
	IdentificatorOfRowsAffected,
	DataSync,
	RowCollection,
} from './_.service.interfaces'

const create = async (tagToCreate: CreateTag): IdentificatorOfRowAffected => {
	const [{ id }] = await db
		.insert(tag)
		.values(tagToCreate)
		.returning({ id: tag.id })

	if (!id)
		throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to create tag')

	return id
}

const read = async (
	owner: string,
	timestamp?: number
): RowCollection<typeof tag> => {
	const filters = [eq(tag.owner, owner)]
	if (timestamp) filters.push(gte(tag.updatedAt, timestamp))

	const results = await db
		.select()
		.from(tag)
		.where(and(...filters))

	if (results.length === 0)
		throw new ApiError(HttpStatus.NOT_FOUND, 'No notes found.')

	return results
}

const update = async (
	owner: string,
	tagToUpdate: UpdateTag
): IdentificatorOfRowAffected => {
	const [{ id }] = await db
		.update(tag)
		.set(tagToUpdate)
		.where(and(eq(tag.owner, owner), eq(tag.id, tagToUpdate.id)))
		.returning({ id: tag.id })

	if (!id)
		throw new ApiError(
			HttpStatus.NOT_FOUND,
			'Tag not found or you do not have permission.'
		)

	return id
}

const upsert = async (
	owner: string,
	tagToUpsert: CreateTag[]
): IdentificatorOfRowsAffected => {
	if (tagToUpsert.length === 0) return []

	const columns = getTableColumns(tag)

	const tags = await db
		.insert(tag)
		.values(tagToUpsert)
		.returning({ id: tag.id })
		.onConflictDoUpdate({
			target: tag.id,
			set: {
				title: sql`excluded.title`,
				status: sql`excluded.status`,
				updatedAt: sql`excluded.updated_at`,
			},
			setWhere: sql`${tag.owner} = ${owner} AND excluded.${sql.raw(columns.updatedAt.name)} >= ${tag.updatedAt}`,
		})

	if (tags.length === 0)
		throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to upsert tag')

	return tags
}

const sync = async (
	owner: string,
	tagsToSync: SyncTags,
	timestamp: number
): DataSync<typeof tag> => {
	const [tagsPushed, tagsToPull] = await Promise.all([
		await upsert(owner, tagsToSync),
		await read(owner, timestamp),
	])

	return {
		data: {
			pushed: tagsPushed,
			toPull: tagsToPull,
		},
	}
}

export const TagService = {
	create,
	read,
	update,
	sync,
}
