import z, { object } from 'zod'

const userSchema = z.object({
  user_id: z.string().optional(),
  user_name: z.string(),
  email_address: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  pswd: z.string()
})


export function validateUser(input : typeof object) {
  return userSchema.safeParse(input)
}

export function validatePartialUser(input : typeof object) {
  return userSchema.partial().safeParse(input)
}