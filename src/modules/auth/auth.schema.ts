import { z } from 'zod'

export const RegisterSchema = z
  .object({
    username: z.string().min(2).max(50),
    password: z.string().min(6).max(100),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export const AuthResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    username: z.string(),
  }),
  accessToken: z.string(),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
