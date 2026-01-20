import { Hono } from 'hono'
import { RouteSettings } from './_route.config'
import type { AuthMiddlewareVariables } from 'middleware/auth.middleware'
import { NoteHandler } from 'handlers/note.handler'

const note = new Hono<{ Variables: AuthMiddlewareVariables }>()

note.use('/*', ...RouteSettings)

note.post('/', ...NoteHandler.create)
note.patch('/', ...NoteHandler.update)
note.put('/sync/:lastSync', ...NoteHandler.sync)
note.post('/tag/:state', ...NoteHandler.toggleTag)

export { note as NoteRoute }
