import { zValidator } from '@hono/zod-validator'
import { createFactory } from 'hono/factory'
import type { AuthMiddlewareVariables } from 'middleware/auth.middleware'
import { TagService } from 'services/tag.service'
import { HttpResponse } from 'utils/http-response.util'
import { LastSyncSchema } from 'validation/params.validation'
import {
	CreateTagSchema,
	SyncTagsSchema,
	UpdateTagSchema,
} from 'validation/tag.validation'

const factory = createFactory<{ Variables: AuthMiddlewareVariables }>()

// -< Create note >-
const create = factory.createHandlers(
	zValidator('json', CreateTagSchema),
	async c => {
		const validateTag = c.req.valid('json')
		const createdTagId = await TagService.create(validateTag)
		return HttpResponse.s201(c, { id: createdTagId })
	}
)

// -< Get note >-
const update = factory.createHandlers(
	zValidator('json', UpdateTagSchema),
	async c => {
		const owner = c.get('userId')
		const validateTag = c.req.valid('json')

		const id = await TagService.update(owner, validateTag)
		return HttpResponse.s200(c, { id })
	}
)

// -< Sync a tag >-
const sync = factory.createHandlers(
	zValidator('param', LastSyncSchema),
	zValidator('json', SyncTagsSchema),
	async c => {
		const owner = c.get('userId')
		const lastSync = c.req.valid('param')
		const validateTagsToSync = c.req.valid('json')

		const { data: tags } = await TagService.sync(
			owner,
			validateTagsToSync,
			lastSync
		)
		return HttpResponse.s200(c, { tags })
	}
)

export const TagHandler = {
	create,
	update,
	sync,
}
