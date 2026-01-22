import { getUser, isAuth } from '../auth/utils.auth.ts'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { HttpResponse } from 'utils/http-response.util.ts'

export type AuthMiddlewareVariables = { userId: string }

export const isAuthUser = createMiddleware(async (c, next) => {
	if (c.req.method === 'OPTIONS') return await next()

	const sessToken = getCookie(c, '__session')
	const bearerToken = c.req.header('Authorization')?.replace('Bearer ', '')

	const token = sessToken || bearerToken
	if (!token) return HttpResponse.s401(c, 'Token not found. User must sign in.')

	try {
		const userId = await isAuth(token)
		const user = await getUser(userId)

		if (!user) return HttpResponse.s404(c, 'User not found.')
		c.set('userId', userId)
	} catch (error) {
		return HttpResponse.s401(c, 'Token not verified.')
	}

	return next()
})
