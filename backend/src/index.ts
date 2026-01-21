import { Hono } from 'hono'
import { NoteRoute } from './routes/note.route.ts'
import { TagRoute } from './routes/tag.route.ts'
import { env } from 'validation/env.validation.ts'
import { errorHandlerMiddleware } from 'middleware/error.middleware.ts'

const app = new Hono().basePath('/v1')

app.onError(errorHandlerMiddleware)

app.route('/note', NoteRoute)
app.route('/tag', TagRoute)

export default {
	port: env.PORT,
	fetch: app.fetch,
}
