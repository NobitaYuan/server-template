import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  createdAt: z.string(),
})

export const UpdateUserSchema = z.object({
  username: z.string().min(2).max(50).optional(),
})

export const UserListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(20),
})

export const UserListResponseSchema = z.object({
  items: z.array(UserSchema),
  total: z.number(),
  page: z.number(),
  size: z.number(),
})

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>
