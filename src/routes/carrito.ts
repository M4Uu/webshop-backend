import { Router } from "express";
import { CarritoController } from "../controllers/carrito";
import { CarritoModel } from "../models/postgre/carrito";


export const createCarritoRouter = (carritoModel: typeof CarritoModel) => {
  const carritoRouter = Router()
  const carritoController = new CarritoController(carritoModel)

  // ENDPOINTS
  carritoRouter.post('', carritoController.index);
  carritoRouter.post('/insertar', carritoController.insertar);
  carritoRouter.post('/eliminar', carritoController.eliminar);
  carritoRouter.post('/mascantidad', carritoController.aumentarCantidad);
  carritoRouter.post('/menoscantidad', carritoController.disminuirCantidad);
  carritoRouter.post('/vendido', carritoController.vendido);

  return carritoRouter;
}