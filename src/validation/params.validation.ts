import { z } from 'zod'

export const LastSyncSchema = z.string().regex(/^\d+$/).transform(Number)

export const BooleanStateSchema = z.boolean()
