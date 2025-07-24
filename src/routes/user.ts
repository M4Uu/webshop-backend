import { Router } from "express";
import { UserController } from "../controllers/user"
import { UserModel } from "../models/postgre/users";

export const createUserRouter = (userModel: typeof UserModel) => {
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
  userRouter.post('/toggleadmin', userController.toggleAdmin);
  userRouter.post('/togglstatus', userController.toggleStatus);
  userRouter.post('/isactive', userController.isActive);

  userRouter.patch('/update', userController.update);
  userRouter.patch('/updatemovil', userController.updateMovil);

  return userRouter;
}