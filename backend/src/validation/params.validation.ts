import { z } from 'zod'

export const LastSyncSchema = z.object({
    lastSync: z.coerce.number()
})
export const BooleanStateSchema = z.boolean()
