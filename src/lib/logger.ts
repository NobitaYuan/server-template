import pino from 'pino'
import { getConfig } from '../core/config/index.js'

let _logger: pino.Logger | null = null

export function getLogger(): pino.Logger {
  if (_logger) return _logger

  const config = getConfig()

  _logger = pino({
    level: config.LOG_LEVEL,
    transport: config.NODE_ENV === 'development' ? { target: 'pino-pretty', options: { colorize: true } } : undefined,
  })

  return _logger
}
