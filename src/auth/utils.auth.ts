import { clerkClient } from './client.auth'
import { verifyToken } from '@clerk/backend'
import { env } from 'validation/env.validation'

export const getUser = async (userId: string) => {
	try {
		return await clerkClient.users.getUser(userId)
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Unknown error'
		throw new Error(`[User not found]: ${message}`)
	}
}

export const isAuth = async (token: string) => {
	try {
		const { sub: userId } = await verifyToken(token, {
			jwtKey: env.CLERK_JWT_KEY,
			authorizedParties: [env.FRONT_END_URL],
		})

		return userId
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Unknown error'
		throw new Error(`[Invalid token]: ${message}`)
	}
}
