import { Router } from "express";
import { UserController } from "../controllers/user"
import { UserModel as UserPostgre } from "../models/postgre/users";

export const createUserRouter = (userModel: typeof UserPostgre) => {
  const userRouter = Router()
  const userController = new UserController(userModel)

  // ENDPOINTS
  userRouter.get('/protected', userController.protected);
  userRouter.get('/logout', userController.logOut);
  userRouter.post('/login', userController.login);
  userRouter.post('/register', userController.register);
  userRouter.patch('/update', userController.update);
  userRouter.post('/getmovil', userController.getMovil);
  userRouter.patch('/updatemovil', userController.updateMovil);

  return userRouter;
}