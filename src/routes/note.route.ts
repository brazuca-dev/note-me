import "dotenv/config";
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger";
import type { JsonResponse } from "interfaces/json-response.interface.ts"
import { isAuthUser } from "middleware/auth.middleware.ts"
import { getNote, patchNote, postNote, type PatchNote, type PostNote } from "services/note.service.ts"

const note = new Hono()

note.use('/*', logger())

// Auth middleware for all note routes
// note.use('/*', isAuthUser)

note.use('/*', cors({
  origin: process.env.FRONT_END_URL,
  allowMethods: ['GET', 'POST', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization']
}))

note.post('/', async (c) => { // upload new note
  const noteToPost = await c.req.json<PostNote>()
  const [gid, error] = await postNote(noteToPost)
  
  if (error) return c.json<JsonResponse>({
    status: 500, message: error.message, data: []
  })
  
  return c.json<JsonResponse>({
    status: 201, message: 'success', data: { gid }
  })
})

note.patch('/:gid', async (c) => { // upload changes
  const noteToPatch = await c.req.json<PatchNote>()
  const [gid, error] = await patchNote(noteToPatch)
  
  if (error) return c.json<JsonResponse>({
    status: 500, message: error.message, data: []
  })
  
  return c.json<JsonResponse>({
    status: 201, message: 'success', data: { gid }
  })
})

note.get('/:gid?', async (c) => { // Download
  const [notes, error] = await getNote()
  
  if (error) return c.json<JsonResponse>({
    status: 500, message: error.message, data: []
  })

  return c.json<JsonResponse>({
    status: 201, message: 'success', data: notes
  })
})

export const NoteRoute: [string, Hono] = [ '/note', note ]
