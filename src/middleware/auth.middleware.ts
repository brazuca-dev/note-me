import { createClerkClient, verifyToken } from '@clerk/backend'
import { createMiddleware } from 'hono/factory'

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

export const isAuthUser = createMiddleware(async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  if (!token) return c.text('Unauthorized', 401)

  const { sub: userId } = await verifyToken(token, { jwtKey: process.env.CLERK_JWT_KEY })
  
  const user = await clerkClient.users.getUser(userId)
  if (!user) return c.text('Unauthorized', 401)
  
  return await next()
})
