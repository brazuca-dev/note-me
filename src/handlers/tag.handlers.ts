import { zValidator } from '@hono/zod-validator'
import { createFactory } from 'hono/factory'
import type { AuthMiddlewareVariables } from 'middleware/auth.middleware'
import { TagService } from 'services/tag.service'
import { HttpResponse } from 'utils/http-response.util'
import { CreateTagSchema } from 'validation/tag.validation'

const factory = createFactory<{ Variables: AuthMiddlewareVariables }>()

// -< Create note >-
const create = factory.createHandlers(
	zValidator('json', CreateTagSchema),
	async c => {
		const validateNote = c.req.valid('json')
		const createdTagId = await TagService.create(validateNote)
		return HttpResponse.s201(c, { id: createdTagId })
	}
)

export const TagHandler = {
	create,
}
