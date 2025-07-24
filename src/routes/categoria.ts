import { Router } from "express";
import { CategoriaController } from "../controllers/categoria";
import { CategoriaModel } from "../models/postgre/categoria";

export const createCategoriaRouter = (categoriaModel: typeof CategoriaModel) => {
  const categoriaRouter = Router()
  const categoriaController = new CategoriaController(categoriaModel)

  // ENDPOINTS
  categoriaRouter.get('', categoriaController.index);

  return categoriaRouter;
}