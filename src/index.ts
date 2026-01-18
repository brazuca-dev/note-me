import { Hono } from 'hono'
import { NoteRoute } from './routes/note.route.ts'
import { TagRoute } from './routes/tag.route.ts'
import { ApiError } from 'utils/api-error.util.ts'
import { HttpResponse } from 'utils/http-response.util.ts'
import { env } from 'validation/env.validation.ts'

const app = new Hono().basePath('/v1')

app.onError((err, c) => {
	if (err instanceof ApiError) {
		return HttpResponse.error(c, err.message, err.statusCode as any)
	}
	if (err.name === 'ZodError') {
		return HttpResponse.error(c, 'Invalid input data', 400)
	}
	return HttpResponse.s500(c, 'Internal Server Error')
})

app.route('/note', NoteRoute)
app.route('/tag', TagRoute)

export default {
	port: env.PORT,
	fetch: app.fetch,
}
