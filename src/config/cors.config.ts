import { cors } from 'hono/cors'
import type { MiddlewareHandler } from 'hono'
import { env } from 'validation/env.validation'

export const defaultCors = (): MiddlewareHandler =>
	cors({
		origin: env.FRONT_END_URL,
		allowMethods: ['GET', 'POST', 'PATCH', 'PUT'],
		allowHeaders: ['Content-Type', 'Authorization'],
		exposeHeaders: ['Content-Length'],
		maxAge: 600,
		credentials: true,
	})
