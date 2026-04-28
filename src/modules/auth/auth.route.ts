import { createRoute } from '@hono/zod-openapi'
import { OpenAPIHono } from '@hono/zod-openapi'
import { RegisterSchema, LoginSchema, AuthResponseSchema } from './auth.schema.js'
import { apiSchema } from '../../lib/response.js'
import * as authService from './auth.service.js'

const authApp = new OpenAPIHono()

const registerRoute = createRoute({
  method: 'post',
  path: '/register',
  request: {
    body: {
      content: {
        'application/json': { schema: RegisterSchema },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': { schema: apiSchema(AuthResponseSchema) },
      },
      description: 'User registered successfully',
    },
  },
})

const loginRoute = createRoute({
  method: 'post',
  path: '/login',
  request: {
    body: {
      content: {
        'application/json': { schema: LoginSchema },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': { schema: apiSchema(AuthResponseSchema) },
      },
      description: 'Login successful',
    },
  },
})

authApp.openapi(registerRoute, async (c) => {
  const data = c.req.valid('json')
  const result = await authService.register(data)
  return c.json({ code: 201, message: 'ok', data: result }, 201)
})

authApp.openapi(loginRoute, async (c) => {
  const data = c.req.valid('json')
  const result = await authService.login(data)
  return c.json({ code: 200, message: 'ok', data: result }, 200)
})

export { authApp }
