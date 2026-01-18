import { Hono } from 'hono'
import { RouteConfigs } from 'config'
import type { AuthMiddlewareVariables } from 'middleware/auth.middleware'
import { NoteHandler } from 'handlers/note.handler'

const note = new Hono<{ Variables: AuthMiddlewareVariables }>()

note.use('/*', ...RouteConfigs)

note.post('/', ...NoteHandler.create)
note.patch('/', ...NoteHandler.update)
note.put('/sync/:lastSync', ...NoteHandler.sync)

export { note as NoteRoute }
