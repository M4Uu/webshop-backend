import { Router } from "express";
import { MovilController } from "../controllers/movil";

export const createMovilRouter = () => {
  const userRouter = Router()
  const userController = new MovilController()

  // ENDPOINTS
  userRouter.get('/listbanks', userController.listbanks)

  return userRouter
}