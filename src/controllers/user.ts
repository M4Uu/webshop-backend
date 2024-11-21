import { JWTMiddlewareInitial, JWTMiddlewareRefresh, JWTParse } from "../middleware/jws";
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

  logOut = async(_req: Request, res: Response) => {
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    res.send('Log out.')
  }

  protected = async(req: Request, res: Response) => {
    const token = req.cookies['access_token']

    if(!token){
      res.status(403).send('Access not authorized');
      return ;
    }
    try{
      res.status(200).json(JWTParse(token))
    }catch{
      res.clearCookie('access_token');
      const ref_token = req.cookies['refresh_token']
      if(!token){
        res.status(403).send('Access not authorized');
        return ;
      }
      try{
        const user = JWTMiddlewareInitial(await this.userModel.refreshUser({input: JWTParse(ref_token)}))
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
        res.status(200).json(user)
      }catch{
        res.status(401).send('Account expired')
        return ;
      }
    }
  }

  getUser = async(req : Request, res : Response) => { 
    const data = await this.userModel.getUser({input: req.body})
    const user = JWTMiddlewareInitial(data)
    const ref_user = JWTMiddlewareRefresh(data?.id)
    
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

        res.cookie('refresh_token',
          ref_user,
          {
            httpOnly: true,
            // secure: true,
            secure: process.env['NODE_ENV'] === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
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
    let user;
    if(result.error){
      res.status(422).json({ error: JSON.parse(result.error?.message as string) })
      return ;
    }
    try{
      user = await this.userModel.register({ input: result.data })
      user ? res.status(201).send() : res.status(406).send();
    }catch(err){
      console.log(err);
      res.status(500).json({ message: 'Server error' })
      return ;
    }
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