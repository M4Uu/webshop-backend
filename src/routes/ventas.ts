import { Router } from "express";
import { VentasController } from "../controllers/ventas";
import { VentasModel } from "../models/postgre/ventas";

export const createVentasRouter = (ventasModel: typeof VentasModel) => {
  const ventasRouter = Router()
  const ventasController = new VentasController(ventasModel)

  // ENDPOINTS
  ventasRouter.get('', ventasController.index);

  return ventasRouter;
}