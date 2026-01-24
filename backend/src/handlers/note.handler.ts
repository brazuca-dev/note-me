import { createFactory } from 'hono/factory'
import { zValidator } from '@hono/zod-validator'
import {
	CreateNoteSchema,
	UpdateNoteSchema,
	SyncNotesSchema,
	ToggleTagSchema,
} from 'validation/note.validation'
import { NoteService } from 'services/note.service'
import { HttpResponse } from 'utils/http-response.util'
import type { AuthMiddlewareVariables } from 'middleware/auth.middleware'
import {
	BooleanStateSchema,
	LastSyncSchema,
} from 'validation/params.validation'

const factory = createFactory<{ Variables: AuthMiddlewareVariables }>()

// -< Create note >-
const create = factory.createHandlers(
	zValidator('json', CreateNoteSchema),
    async c => {
		const validateNote = c.req.valid('json')
		const createdNoteId = await NoteService.create(validateNote)
		return HttpResponse.s201(c, { id: createdNoteId })
	}
)

// -< Update note >-
const update = factory.createHandlers(
	zValidator('json', UpdateNoteSchema),
	async c => {
		const owner = c.get('userId')
		const validateNote = c.req.valid('json')

		const id = await NoteService.update(owner, validateNote)
		return HttpResponse.s200(c, { id })
	}
)

// -< Sync notes >-
const sync = factory.createHandlers(
	zValidator('param', LastSyncSchema),
	zValidator('json', SyncNotesSchema),
	async c => {
		const owner = c.get('userId')
		const lastSync = c.req.valid('param')
		const validateNotesToSync = c.req.valid('json')

		const { data: notes } = await NoteService.sync(
			owner,
			validateNotesToSync,
			lastSync
		)
		return HttpResponse.s200(c, { notes })
	}
)

// -< Tag a note >-
const toggleTag = factory.createHandlers(
	zValidator('json', ToggleTagSchema),
	zValidator('param', BooleanStateSchema),
	async c => {
		const validateToggleTag = c.req.valid('json')
		const validateBooleanState = c.req.valid('param')

		const id = await NoteService.toggleTag(
			validateToggleTag,
			validateBooleanState
		)
		return HttpResponse.s200(c, { id })
	}
)

export const NoteHandler = {
	create,
	update,
	sync,
	toggleTag,
}
