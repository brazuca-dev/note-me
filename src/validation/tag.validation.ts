import { z } from 'zod'
import { tag } from 'db/tables.db'
import type { InferInsertModel } from 'drizzle-orm'
import { createUpdateSchema } from 'drizzle-zod'
import { createInsertSchema } from 'drizzle-zod'

export const CreateTagSchema = createInsertSchema(tag)

export const UpdateTagSchema = createUpdateSchema(tag, {
	id: z.nanoid(),
	owner: z.string().startsWith('user_'),
}).required({ id: true })

export const SyncTagsSchema = createInsertSchema(tag, {
	id: z.nanoid(),
	owner: z.string().startsWith('user_'),
}).array()

export type CreateTag = InferInsertModel<typeof tag>
export type UpdateTag = Partial<CreateTag> & { id: string }
export type SyncTags = CreateTag[]
