import z, { object } from 'zod'

const userSchema = z.object({
  cedula: z.number(),
  nombres: z.string(),
  nombre_usuario: z.string(),
  credencial: z.string(),
  localidad: z.string(),
  correo: z.string(),
  imagen_url: z.string(),
})


export function validateUser(input: typeof object) {
  return userSchema.safeParse(input)
}

export function validatePartialUser(input: typeof object) {
  return userSchema.partial().safeParse(input)
}