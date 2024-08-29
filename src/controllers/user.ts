import { JWTMiddlewareInitial, JWTParse } from "../middleware/jws";
import { UserModel } from "../models/mysql/users"
import * as schema from "../schema/user"
import { Request, Response } from "express"

export class UserController {
  private userModel : typeof UserModel;
  constructor(userModel : typeof UserModel){
    this.userModel = userModel
  }

  // getAll = async(req, res) => {
  //   const users = await this.userModel.getAll()
  //   res.status(200).json(users)
  // }

  protected = async(req: Request, res: Response) => {
    const token = req.cookies['access_token']

    if(!token){
      res.status(403).send('Access not authorized');
      return ;
    }
    try{
      res.status(200).json(JWTParse(token))
    }catch(error){
      res.status(401).send('Access not authorized')
      return ;
    }
  }

  getUser = async(req : Request, res : Response) => {
    const user = JWTMiddlewareInitial(await this.userModel.getUser({input: req.body}))
    
    try{
      if(!user) {
        res.status(404).json({ message: 'User not found' });
        return ;
      }

      res.cookie('access_token',
          user,
          {
            httpOnly: true, // ;a coockie solo se puede acceder en el servidor
            // secure: true, //la coockie solo se puede acceder en https
            secure: process.env['NODE_ENV'] === 'production', //la coockie solo se puede acceder en https
            sameSite: 'strict', // la coockie entre múltiples dominios (con 'strict' solo se puede acceder desde el mismo dominio)
            maxAge: 1000 * 60 * 60 // tiempo de duración de la cookie
          }
        )
      res.status(200).send()
    }catch(error){
      console.log(error);
      res.status(500).json({ message: 'Server error' });
      return ;
    }
  }

  register = async(req : Request, res : Response) => {
    const result = schema.validateUser(req.body)
    if(result.error){
      res.status(422).json({ error: JSON.parse(result.error?.message as string) })
      return ;
    }
    const newUser = await this.userModel.register({ input: result.data })

    res.status(201).json(newUser)
  }


  delete = async(_req : Request, _res : Response) => {}

  upload = async(req : Request, res : Response) => {
    const result = schema.validatePartialUser(req.body)
    if(result.error){
      res.status(400).json({ error: JSON.parse(result.error?.message as string) })
      return ;
    }
    const ChangedUser = await this.userModel.upload({ input: result.data })

    res.status(201).json(ChangedUser)
  }
}