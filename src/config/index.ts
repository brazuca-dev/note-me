import { logger } from 'hono/logger'
import { defaultCors } from './cors.config'
import { isAuthUser } from 'middleware/auth.middleware'

export const RouteConfigs = [defaultCors(), logger(), isAuthUser]
