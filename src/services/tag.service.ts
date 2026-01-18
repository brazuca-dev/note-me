import { db } from 'db/client'
import { tag } from 'db/tables'
import { getTableColumns, sql } from 'drizzle-orm'
import { ApiError } from 'utils/api-error.util'
import { HttpStatus } from 'utils/http-response.util'
import type { CreateTag, SyncTags, UpdateTag } from 'validation/tag.validation'

const create = async (tagToCreate: CreateTag) => {
	const tags = await db
		.insert(tag)
		.values(tagToCreate)
		.returning({ id: tag.id })

	if (tags.length === 0)
		throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to create tag')

	return tags
}

const read = async (owner: string, timestamp?: number) => {}

const update = async (tagToUpdate: UpdateTag) => {}

const upsert = async (owner: string, ...tagToPost: SyncTags) => {
	if (tagToPost.length === 0) return []

	const columns = getTableColumns(tag)

	const tags = await db
		.insert(tag)
		.values(tagToPost)
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

export const TagService = {
	create,
	upsert,
}
