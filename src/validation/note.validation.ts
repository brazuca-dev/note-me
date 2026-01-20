import { z } from 'zod'
import { note, noteTag } from 'db/tables'
import type { InferInsertModel } from 'drizzle-orm'
import { createUpdateSchema } from 'drizzle-zod'
import { createInsertSchema } from 'drizzle-zod'

export const CreateNoteSchema = createInsertSchema(note)

export const UpdateNoteSchema = createUpdateSchema(note, {
	id: z.nanoid(),
	owner: z.string().startsWith('user_'),
}).required({ id: true })

export const SyncNotesSchema = createInsertSchema(note, {
	id: z.nanoid(),
	owner: z.string().startsWith('user_'),
}).array()

export const ToggleTagSchema = createInsertSchema(noteTag)

export type CreateNote = InferInsertModel<typeof note>
export type UpdateNote = Partial<CreateNote> & { id: string }
export type SyncNotes = CreateNote[]

export type ToggleTag = InferInsertModel<typeof noteTag>
