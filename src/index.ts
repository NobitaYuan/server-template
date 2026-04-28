import { serve } from '@hono/node-server'
import { getConfig } from './core/config/index.js'
import { initDb } from './core/db/index.js'
import { getLogger } from './lib/logger.js'
import { getLocalIps } from './lib/utils.js'
import { app } from './app.js'

const config = getConfig()
const logger = getLogger()

initDb()
logger.info('Database initialized')

const ip = getLocalIps()[0] ?? 'localhost'

serve({ fetch: app.fetch, port: config.PORT }, (info) => {
  logger.info(`Server running at:`)
  logger.info(`  Local:   http://localhost:${info.port}`)
  logger.info(`  Network: http://${ip}:${info.port}`)
  logger.info(`API docs at http://${ip}:${info.port}/api/v1/doc`)
})
