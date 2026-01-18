import { Hono } from 'hono'
import { RouteConfigs } from 'config'
import type { AuthMiddlewareVariables } from 'middleware/auth.middleware.ts'
import { TagHandler } from 'handlers/tag.handlers'

interface Variables extends AuthMiddlewareVariables {}

const tag = new Hono<{ Variables: Variables }>()

tag.use('/*', ...RouteConfigs)

tag.post('/', ...TagHandler.create)

export { tag as TagRoute }
