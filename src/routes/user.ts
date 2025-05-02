import { Router } from "express";
import { UserController } from "../controllers/user"
import { UserModel } from "../models/mysql/users";
import { UserModel as UserPostgre } from "../models/postgre/users";

export const createUserRouter = ( userModel : typeof UserModel | UserPostgre) => {
  const userRouter = Router()
  const userController = new UserController(userModel)

  // ENDPOINTS
  userRouter.get('/protected', userController.protected)
  userRouter.get('/logout', userController.logOut)
  userRouter.post('/login', userController.login)
  userRouter.post('/register', userController.register)
  userRouter.patch('/upload', userController.upload)

  return userRouter
}