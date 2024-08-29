import { Router } from "express";
import { UserController } from "../controllers/user"
import { UserModel } from "../models/mysql/users";

export const createUserRouter = ( userModel : typeof UserModel) => {
  const userRouter = Router()
  const userController = new UserController(userModel)

  // ENDPOINTS
  // userRouter.get('/', userController.getAll)
  userRouter.get('/protected', userController.protected)
  userRouter.post('/login', userController.getUser)
  userRouter.post('/register', userController.register)
  userRouter.patch('/upload', userController.upload)

  return userRouter
}