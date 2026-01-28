import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { BlankEnv, HTTPResponseError } from 'hono/types'
import { ApiError } from 'utils/api-error.util.ts'
import { BadRequestError } from 'utils/bad-request'
import { HttpResponse } from 'utils/http-response.util.ts'

export const errorHandlerMiddleware = (
	err: Error | HTTPResponseError,
	c: Context<BlankEnv, any, {}>
) => {
  if (err instanceof ApiError)
		return HttpResponse.error(c, err.message, 501)

  if (err instanceof BadRequestError)
    return HttpResponse.s400(c, err.message)

  if (err instanceof HTTPException)
		return HttpResponse.error(c, err.message, err.status)

	return HttpResponse.s500(c, 'Internal Server Error')
}
