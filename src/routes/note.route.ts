import "dotenv/config";
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger";
import { isAuthUser, type AuthMiddlewareVariables } from "middleware/auth.middleware.ts"
import { getNote, patchNote, postNote, type PatchNote, type PostNote } from "services/note.service.ts"
import { HttpResponse } from "utils/http-response.ts";

interface Variables extends AuthMiddlewareVariables {}

const note = new Hono<{ Variables: Variables }>()

note.use('/*', cors({
  origin: process.env.FRONT_END_URL,
  allowMethods: ['GET', 'POST', 'PATCH', 'PUT'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true
}))

note.use('/*', logger())
note.use('/*', isAuthUser)

// >- upload new note -<
note.post('/', async (c) => {
  const owner = c.get('userId')
  const noteToPost = await c.req.json<PostNote>()
  
  console.log(`Uploading note for user ${owner}`)  
  
  const [gid, error] = await postNote(owner, noteToPost)
  if (error) return HttpResponse.s500(c, 'Note not upload.')
  
  return HttpResponse.s201(c, { gid })
})

// >- upload changes -<
note.patch('/:id', async (c) => {
  const noteToPatch = await c.req.json<PatchNote>()
  const [gid, error] = await patchNote(noteToPatch)
  
  if (error) return HttpResponse.s500(c, 'Note not updated.')
  return HttpResponse.s200(c, { gid })
})

// >- sync notes -<
note.put('/sync/:lastSync', async (c) => {
  const owner = c.get('userId')
    
  const { lastSync } = c.req.param()
  const { notes: notesToPush } = await c.req.json<{ notes: [] }>()
  
  const [_, postNoteError] = await postNote(owner, ...notesToPush)
  console.log(`[Post note error] => ${postNoteError?.message}`)
  if (postNoteError) return HttpResponse.s500(c, 'No notes pushed.')
  
  const [notesToPull, getNoteError] = await getNote(owner, Number(lastSync))
  if (getNoteError) return HttpResponse.s500(c, 'No notes pulled.')
  
  return HttpResponse.s200(c, { notes: notesToPull || [] })
})

export { note as NoteRoute }
