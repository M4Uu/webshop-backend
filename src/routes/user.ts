import { Router } from "express";
import { UserController } from "../controllers/user"
import { UserModel as UserPostgre } from "../models/postgre/users";

export const createUserRouter = (userModel: typeof UserPostgre) => {
  const userRouter = Router()
  const userController = new UserController(userModel)

  // ENDPOINTS
  userRouter.get('/getusers', userController.getUsers);
  userRouter.get('/protected', userController.protected);
  userRouter.get('/logout', userController.logOut);

  userRouter.post('/login', userController.login);
  userRouter.post('/register', userController.register);
  userRouter.post('/getmovil', userController.getMovil);
  userRouter.post('/getroles', userController.getRoles);

  userRouter.patch('/update', userController.update);
  userRouter.patch('/updatemovil', userController.updateMovil);

  return userRouter;
}