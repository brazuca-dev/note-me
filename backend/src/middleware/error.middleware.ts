import type { Context } from 'hono'
import type { BlankEnv, HTTPResponseError } from 'hono/types'
import { ApiError } from 'utils/api-error.util.ts'
import { HttpResponse } from 'utils/http-response.util.ts'

export const errorHandlerMiddleware = (
	err: Error | HTTPResponseError,
	c: Context<BlankEnv, any, {}>
) => {
  console.error(err)
    
  if (err instanceof ApiError)
		return HttpResponse.error(c, err.message, 501)

  if (err.name === 'ZodError')
		return HttpResponse.error(c, 'Invalid input data', 400)

	return HttpResponse.s500(c, 'Internal Server Error')
}
