import { Hono } from 'hono'
import { NoteRoute } from './routes/note.route.ts'

const app = new Hono().basePath('/v1')

app.route('/note', NoteRoute)

app.get('/', c =>  c.text(`Welcome to Proxy Note Me!`))

export default {
  port: 3000,
  fetch: app.fetch,
}
