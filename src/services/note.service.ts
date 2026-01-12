import { db } from "db/client.ts"
import { note } from "db/schema.ts"
import { and, eq, gte, sql } from "drizzle-orm"
import { tryCatchWrapper } from "utils/try-catch-wrapper.util.ts"

const getNote = tryCatchWrapper(async (owner: string, timestamp?: number) => {
  if (timestamp) return await db
    .select()
    .from(note)
    .where(and(
        gte(note.updatedAt, timestamp), eq(note.owner, owner)
      ))

  return await db.select().from(note).where(eq(note.owner, owner))
})

type PostNote = typeof note.$inferInsert

const postNote = tryCatchWrapper(async (owner: string, ...noteToPost: PostNote[]) => {
  if (noteToPost.length === 0) return []
    
  const values = noteToPost.map(n => ({
    ...n, owner // Injetamos o dono real vindo da sessão/token
  }))

  const notes = await db
    .insert(note)
    .values(values)
    .returning({ id: note.id })
    .onConflictDoUpdate({
      target: note.id,
      set: {
        title: sql`excluded.title`,
        content: sql`excluded.content`,
        isPined: sql`excluded.is_pinned`,
        status: sql`excluded.status`,
        updatedAt: sql`excluded.updated_at`,
      },
      setWhere: sql`${note.owner} = ${owner} AND excluded.updated_at >= ${note.updatedAt}`
    })
   
   return notes // global id of the new notes
})

type PatchNote = Partial<typeof note.$inferSelect> & { id: string }

const patchNote = tryCatchWrapper(async (noteToPatch: PatchNote) => {
  const [{ gid }] = await db
    .update(note)
    .set(noteToPatch)
    .where(eq(note.id, noteToPatch.id))
    .returning({ gid: note.id })
   
   return gid // global id of the updated note
})

export { getNote, postNote, patchNote }

export type { PatchNote, PostNote }
