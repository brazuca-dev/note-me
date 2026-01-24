import { logger } from 'hono/logger'
import { isAuthUser } from '../middleware/auth.middleware'
import { cors } from 'hono/cors'
import { env } from '../validation/env.validation'

const _cors = cors({
	origin: env.FRONT_END_URL,
	allowMethods: ['GET', 'POST', 'PATCH', 'PUT'],
	allowHeaders: ['Content-Type', 'Authorization'],
	exposeHeaders: ['Content-Length'],
	maxAge: 600,
	credentials: true,
})

export const RouteSettings = [_cors, isAuthUser, logger()]
