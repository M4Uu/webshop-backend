import { Router } from "express";
import { PedidoController } from "../controllers/pedidos";
import { PedidoModel } from "../models/postgre/pedidos";

export const createPedidoRouter = (pedidoModel: typeof PedidoModel) => {
  const pedidoRouter = Router()
  const pedidoController = new PedidoController(pedidoModel)

  // ENDPOINTS
  pedidoRouter.get('', pedidoController.index);
  pedidoRouter.get('/prioridad', pedidoController.getPrioridad);
  pedidoRouter.post('/get', pedidoController.getByCedula);
  pedidoRouter.post('/id', pedidoController.getById);
  pedidoRouter.post('/create', pedidoController.create);
  pedidoRouter.post('/update', pedidoController.update);
  pedidoRouter.post('/updateAdmin', pedidoController.updateAdmin);
  pedidoRouter.post('/delete', pedidoController.delete);

  return pedidoRouter;
}