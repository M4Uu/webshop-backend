import { Router } from "express";
import { PedidoController } from "../controllers/pedidos";
import { PedidoModel } from "../models/postgre/pedidos";

export const createPedidoRouter = (pedidoModel: typeof PedidoModel) => {
  const pedidoRouter = Router()
  const pedidoController = new PedidoController(pedidoModel)

  // ENDPOINTS
  pedidoRouter.get('', pedidoController.index);

  return pedidoRouter;
}