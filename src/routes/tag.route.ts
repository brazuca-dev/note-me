import { Hono } from 'hono'
import { RouteSettings } from './_route.config'
import type { AuthMiddlewareVariables } from 'middleware/auth.middleware.ts'
import { TagHandler } from 'handlers/tag.handlers'

const tag = new Hono<{ Variables: AuthMiddlewareVariables }>()

tag.use('/*', ...RouteSettings)

tag.post('/', ...TagHandler.create)
tag.patch('/', ...TagHandler.update)
tag.put('/sync/:lastSync', ...TagHandler.update)

export { tag as TagRoute }
