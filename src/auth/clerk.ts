import "dotenv/config"
import { verifyToken, createClerkClient } from "@clerk/backend"

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY
})

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
      jwtKey: process.env.CLERK_JWT_KEY,
      authorizedParties: [process.env.FRONT_END_URL],
    })
      
    return userId
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    throw new Error(`[Invalid token]: ${message}`)
  }
}
