import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { z } from 'zod'

export interface ApiResponse<T> {
  code: number
  message: string
  data: T | null
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

export function success<T>(c: Context, data: T, message = 'ok', status: ContentfulStatusCode = 200) {
  return c.json<ApiResponse<T>>({ code: status, message, data }, status)
}

export function fail(c: Context, message: string, status: ContentfulStatusCode = 400) {
  return c.json<ApiResponse<null>>({ code: status, message, data: null }, status)
}
