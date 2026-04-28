import type { Context } from 'hono'
import { OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export function apiSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    code: z.number(),
    message: z.string(),
    data: dataSchema,
  })
}

export const errorSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.literal(null),
})

export function success<T>(c: Context, data: T, message = 'success') {
  return c.json({ code: 200, message, data } satisfies ApiResponse<T>, 200)
}

export function fail(c: Context, message: string, code = 400) {
  return c.json({ code, message, data: null } satisfies ApiResponse<null>, 200)
}

export function createRouteApp() {
  return new OpenAPIHono({
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json({ code: 400, message: 'Validation error', data: null }, 200)
      }
    },
  })
}
