import { createFactory } from 'hono/factory'
import { zValidator } from '@hono/zod-validator'
import {
	CreateNoteSchema,
	UpdateNoteSchema,
	SyncNotesSchema,
} from 'validation/note.validation'
import { NoteService } from 'services/note.service'
import { HttpResponse } from 'utils/http-response.util'
import type { AuthMiddlewareVariables } from 'middleware/auth.middleware'
import { LastSyncSchema } from 'validation/params.validation'

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
		const data = c.req.valid('json')

		const id = await NoteService.update(owner, data)
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
		const notesToPush = c.req.valid('json')

		const notesPushed = await NoteService.upsert(owner, notesToPush)
		const notesToPull = await NoteService.read(owner, lastSync)

		return HttpResponse.s200(c, {
			notes: {
				pushed: notesPushed,
				toPull: notesToPull,
			},
		})
	}
)

export const NoteHandler = {
	create,
	update,
	sync,
}
