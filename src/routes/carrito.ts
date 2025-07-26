import { Router } from "express";
import { CarritoController } from "../controllers/carrito";
import { CarritoModel } from "../models/postgre/carrito";


export const createCarritoRouter = (carritoModel: typeof CarritoModel) => {
  const carritoRouter = Router()
  const carritoController = new CarritoController(carritoModel)

  // ENDPOINTS
  carritoRouter.post('', carritoController.index);

  return carritoRouter;
}