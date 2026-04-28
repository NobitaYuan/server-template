import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { Scalar } from '@scalar/hono-api-reference'
import { errorHandler } from './core/middleware/error-handler.js'
import { requestLogger } from './core/middleware/request-logger.js'
import { authApp } from './modules/auth/index.js'
import { userApp } from './modules/user/index.js'

const app = new OpenAPIHono()

// Global middleware
app.use('*', cors())
app.use('*', requestLogger)
app.onError(errorHandler)

// Default hook to handle Zod validation errors
app.openAPIRegistry.registerComponent('securitySchemes', 'BearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
})

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }))

// ==================== Routes ====================

// Mount modules under /api/v1
const api = new OpenAPIHono()
api.route('/auth', authApp)
api.route('/users', userApp)

app.route('/api/v1', api)

// ==================== OpenAPI ====================

// OpenAPI spec (with global security)
app.doc('/api/v1/openapi.json', {
  openapi: '3.1.0',
  info: { title: 'Server Template API', version: '1.0.0' },
  security: [{ BearerAuth: [] }],
})

// Scalar API documentation UI
app.get(
  '/api/v1/doc',
  Scalar({
    url: '/api/v1/openapi.json',
    pageTitle: 'API Documentation',
  }),
)

export { app }
