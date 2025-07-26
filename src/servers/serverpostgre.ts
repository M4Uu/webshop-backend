// Modelos
import { UserModel } from "../models/postgre/users";
import { VentasModel } from "../models/postgre/ventas";
import { ProductosModel } from "../models/postgre/productos";
import { CategoriaModel } from "../models/postgre/categoria";
import { CarritoModel } from "../models/postgre/carrito";
import { GuardadosModel } from "../models/postgre/guardados";
// Modelos

// Rutas
import { createUserRouter } from "../routes/user"
import { createToolkitRouter } from "../routes/toolkit";
import { createVentasRouter } from "../routes/ventas";
import { createProductosRouter } from "../routes/productos";
import { createCategoriaRouter } from "../routes/categoria";
import { createCarritoRouter } from "../routes/carrito";
import { createGuardadosRouter } from "../routes/guardados";
// Rutas

// App
import App from "../index";
// App

// Interfaces
export interface PropsModel {
  userModel: UserModel;
  ventasModel: VentasModel;
  productosModel: ProductosModel;
  categoriaModel: CategoriaModel;
  carritoModel: CarritoModel;
  guardadosModel: GuardadosModel
}

export interface PropsRoutes {
  userRoute: typeof createUserRouter;
  ventasRoute: typeof createVentasRouter;
  toolkitRoute: typeof createToolkitRouter;
  productosRoute: typeof createProductosRouter;
  categoriaRoute: typeof createCategoriaRouter;
  carritoRoute: typeof createCarritoRouter;
  guardadosRoute: typeof createGuardadosRouter;
}
// Interfaces

// Servidor PostgreSQL
const propsModel: PropsModel = {
  userModel: UserModel,
  ventasModel: VentasModel,
  productosModel: ProductosModel,
  categoriaModel: CategoriaModel,
  carritoModel: CarritoModel,
  guardadosModel: GuardadosModel
};

const propsRoutes: PropsRoutes = {
  userRoute: createUserRouter,
  ventasRoute: createVentasRouter,
  toolkitRoute: createToolkitRouter,
  productosRoute: createProductosRouter,
  categoriaRoute: createCategoriaRouter,
  carritoRoute: createCarritoRouter,
  guardadosRoute: createGuardadosRouter,
};
// Servidor PostgreSQL


App(propsModel, propsRoutes);