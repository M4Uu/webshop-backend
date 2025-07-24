import { sign, verify } from 'jsonwebtoken'
import { SECRET_JWT_KEY } from '../env/config'
// import { UserData } from '../interface/users'

export function JWTMiddlewareInitial(input: any) {
  if (!input) return null;
  return sign({
    cedula: input.cedula,
    correo: input.correo,
    imagen_url: input.imagen_url,
    localidad: input.localidad,
    nombre_usuario: input.nombre_usuario,
    nombres: input.nombres,
    estado: input.estado
  },
    SECRET_JWT_KEY,
    { expiresIn: '1h' }
  )
}

export function JWTMiddlewareRefresh(cedula: number) {
  if (!cedula) return null;
  return sign({
    cedula: cedula
  },
    SECRET_JWT_KEY,
    { expiresIn: '30d' }
  )
}

export function JWTParse(input: any) {
  return verify(input, SECRET_JWT_KEY) as object
}