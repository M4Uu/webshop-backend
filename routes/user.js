import { Router } from "express";
import { UserController } from "../controllers/user.js"

export const createUserRouter = ({ userModel }) => {
  const userRouter = Router()
  const userController = new UserController({ userModel })

  // ENDPOINTS
  // userRouter.get('/', userController.getAll)
  userRouter.get('/login', userController.getUser)
  userRouter.post('/register', userController.register)
  userRouter.patch('/upload', userController.upload)

  return userRouter
}