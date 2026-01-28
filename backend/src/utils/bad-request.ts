import { HTTPException } from "hono/http-exception"

export class BadRequestError extends HTTPException {
  constructor(message: string) {
    super(400, { message })
  }
}