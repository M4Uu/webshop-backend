 import { sign, verify } from 'jsonwebtoken'
import { SECRET_JWT_KEY } from '../env/config'
import { UserData } from '../interface/users'

export function JWTMiddlewareInitial(input: UserData | null) {
  if(!input) return null;
  return sign({
    user_id: input.user_id,
    user_name: input. user_name,
    email_address: input.email_address,
    first_name: input.first_name,
    last_name: input.last_name,
    pswd: input.pswd
  },
    SECRET_JWT_KEY,
    { expiresIn: '1h' }
  )
}

export function JWTMiddlewareRefresh(){}

export function JWTParse (input: any){
  return verify(input,SECRET_JWT_KEY) as object
}