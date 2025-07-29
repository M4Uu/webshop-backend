import { Router } from "express";
import { ProductosController } from "../controllers/productos";
import { ProductosModel } from "../models/postgre/productos";

export const createProductosRouter = (productosModel: typeof ProductosModel) => {
  const productosRouter = Router()
  const productosController = new ProductosController(productosModel)

  // ENDPOINTS
  productosRouter.get('', productosController.index);

  productosRouter.post('/get', productosController.getProductoById);
  productosRouter.post('/catalogo', productosController.catalogo);
  productosRouter.post('/create', productosController.create);
  productosRouter.post('/update', productosController.update);
  productosRouter.post('/calificacion', productosController.calificacion);

  return productosRouter;
}