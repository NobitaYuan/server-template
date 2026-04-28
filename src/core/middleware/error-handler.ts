import type { ErrorHandler } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { AppError } from '../errors/index.js'
import { getLogger } from '../../lib/logger.js'

export const errorHandler: ErrorHandler = async (err, c) => {
  const logger = getLogger()

  if (err instanceof AppError) {
    logger.warn({ err }, err.message)
    return c.json({ code: err.statusCode, message: err.message, data: null }, err.statusCode as ContentfulStatusCode)
  }

  logger.error({ err }, 'Unhandled error')
  return c.json({ code: 500, message: 'Internal server error', data: null }, 500 as ContentfulStatusCode)
}
