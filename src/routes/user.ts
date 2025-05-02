import { Router } from "express";
import { UserController } from "../controllers/user"
import { UserModel } from "../models/mysql/users";

export const createUserRouter = ( userModel : typeof UserModel) => {
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