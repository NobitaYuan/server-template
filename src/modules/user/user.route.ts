import { createRoute } from '@hono/zod-openapi'
import { OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { UserSchema, UpdateUserSchema, UserListQuerySchema, UserListResponseSchema } from './user.schema.js'
import { apiSchema } from '../../lib/response.js'
import * as userService from './user.service.js'
import { authMiddleware } from '../../core/middleware/auth.js'

const userApp = new OpenAPIHono()

const listRoute = createRoute({
  method: 'get',
  path: '/',
  request: {
    query: UserListQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: apiSchema(UserListResponseSchema) } },
      description: 'User list',
    },
  },
})

const getRoute = createRoute({
  method: 'get',
  path: '/{id}',
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: apiSchema(UserSchema) } },
      description: 'User detail',
    },
  },
})

const updateRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: { 'application/json': { schema: UpdateUserSchema } },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: apiSchema(UserSchema) } },
      description: 'User updated',
    },
  },
})

const deleteRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      content: {
        'application/json': { schema: apiSchema(z.literal(null)) },
      },
      description: 'User deleted',
    },
  },
})

// All user routes require authentication
userApp.use('*', authMiddleware)

userApp.openapi(listRoute, async (c) => {
  const { page, size } = c.req.valid('query')
  const result = await userService.listUsers(page, size)
  return c.json({ code: 200, message: 'ok', data: result })
})

userApp.openapi(getRoute, async (c) => {
  const { id } = c.req.valid('param')
  const user = await userService.getUser(id)
  return c.json({ code: 200, message: 'ok', data: user })
})

userApp.openapi(updateRoute, async (c) => {
  const { id } = c.req.valid('param')
  const data = c.req.valid('json')
  const user = await userService.updateUser(id, data)
  return c.json({ code: 200, message: 'ok', data: user })
})

userApp.openapi(deleteRoute, async (c) => {
  const { id } = c.req.valid('param')
  await userService.deleteUser(id)
  return c.json({ code: 200, message: 'ok', data: null })
})

export { userApp }
