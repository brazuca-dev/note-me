import { db } from "db/client.ts"
import { note } from "db/schema.ts"
import { eq } from "drizzle-orm"
import { tryCatchWrapper } from "utils/try-catch-wrapper.util.ts"

export const getNote = tryCatchWrapper(async (gid?: number) => {
  if (gid) return await db.select().from(note)
    .where(eq(note.gid, gid))

  return await db.select().from(note)
})

export type PostNote = typeof note.$inferInsert

export const postNote = tryCatchWrapper(async (noteToPost: PostNote) => {
   const [{ gid }] = await db
    .insert(note)
    .values(noteToPost)
    .returning({ gid: note.gid })
   
   return gid // global id of the new note
})

export type PatchNote = Partial<typeof note.$inferSelect> & { gid: number }

export const patchNote = tryCatchWrapper(async (noteToPatch: PatchNote) => {
  const [{ gid }] = await db
    .update(note)
    .set(noteToPatch)
    .where(eq(note.gid, noteToPatch.gid))
    .returning({ gid: note.gid })
   
   return gid // global id of the updated note
})
