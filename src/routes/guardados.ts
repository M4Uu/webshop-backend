import { Router } from "express";
import { GuardadosController } from "../controllers/guardados";
import { GuardadosModel } from "../models/postgre/guardados";


export const createGuardadosRouter = (carritoModel: typeof GuardadosModel) => {
  const guardadosRouter = Router()
  const guardadosController = new GuardadosController(carritoModel)

  // ENDPOINTS
  guardadosRouter.post('', guardadosController.index);

  return guardadosRouter;
}