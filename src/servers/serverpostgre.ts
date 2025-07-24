import { UserModel } from "../models/postgre/users";
import { VentasModel } from "../models/postgre/ventas";
import { ProductosModel } from "../models/postgre/productos";
import { CategoriaModel } from "../models/postgre/categoria";

import { createUserRouter } from "../routes/user"
import { createToolkitController } from "../routes/toolkit";
import { createVentasRouter } from "../routes/ventas";
import { createProductosRouter } from "../routes/productos";
import { createCategoriaRouter } from "../routes/categoria";

import App from "../index";

export interface PropsModel {
  userModel: UserModel;
  ventasModel: VentasModel;
  productosModel: ProductosModel;
  categoriaModel: CategoriaModel;
}

export interface PropsRoutes {
  userRoute: typeof createUserRouter;
  ventasRoute: typeof createVentasRouter;
  toolkitRoute: typeof createToolkitController;
  productosRoute: typeof createProductosRouter;
  categoriaRoute: typeof createCategoriaRouter;
}

const propsModel: PropsModel = {
  userModel: UserModel,
  ventasModel: VentasModel,
  productosModel: ProductosModel,
  categoriaModel: CategoriaModel,
};

const propsRoutes: PropsRoutes = {
  userRoute: createUserRouter,
  ventasRoute: createVentasRouter,
  toolkitRoute: createToolkitController,
  productosRoute: createProductosRouter,
  categoriaRoute: createCategoriaRouter
};


App(propsModel, propsRoutes);