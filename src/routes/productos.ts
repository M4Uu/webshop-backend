import { Router } from "express";
import { ProductosController } from "../controllers/productos";
import { ProductosModel } from "../models/postgre/productos";

export const createProductosRouter = (productosModel: typeof ProductosModel) => {
  const productosRouter = Router()
  const productosController = new ProductosController(productosModel)

  // ENDPOINTS
  productosRouter.get('', productosController.index);
  productosRouter.get('/get/:id', productosController.getProductoById);

  return productosRouter;
}