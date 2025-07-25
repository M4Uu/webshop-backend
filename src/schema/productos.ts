import z, { object } from 'zod'

const productoSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  descripcion: z.string(),
  precio: z.number(),
  existencias: z.number(),
  calificacion: z.number(),
  imagen_url: z.string(),
  categoria_id: z.number(),
})


export function validateProducto(input: typeof object) {
  return productoSchema.safeParse(input)
}

export function validatePartialProducto(input: typeof object) {
  return productoSchema.partial().safeParse(input)
}