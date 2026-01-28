import { z } from 'zod'
import type { ValidationTargets } from 'hono'
import { zValidator as zv } from '@hono/zod-validator'
import { BadRequestError } from './bad-request'

export const zValidator = <T extends z.ZodType, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T
) =>
  zv(target, schema, (result, _) => {
    if (!result.success) {
      console.error(result.error.message)
      console.dir(result.data)
      console.log(result.error.issues)
      throw new BadRequestError(result.error.message)
    }
  })