// Modelos
import { UserModel } from "../models/postgre/users";
import { VentasModel } from "../models/postgre/ventas";
import { ProductosModel } from "../models/postgre/productos";
import { CategoriaModel } from "../models/postgre/categoria";
import { CarritoModel } from "../models/postgre/carrito";
import { GuardadosModel } from "../models/postgre/guardados";
import { PedidoModel } from "../models/postgre/pedidos";
// Modelos

// Rutas
import { createUserRouter } from "../routes/user"
import { createToolkitRouter } from "../routes/toolkit";
import { createVentasRouter } from "../routes/ventas";
import { createProductosRouter } from "../routes/productos";
import { createCategoriaRouter } from "../routes/categoria";
import { createCarritoRouter } from "../routes/carrito";
import { createGuardadosRouter } from "../routes/guardados";
import { createPedidoRouter } from "../routes/pedido";
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
  guardadosModel: GuardadosModel;
  pedidosModel: PedidoModel;
}

export interface PropsRoutes {
  userRoute: typeof createUserRouter;
  ventasRoute: typeof createVentasRouter;
  toolkitRoute: typeof createToolkitRouter;
  productosRoute: typeof createProductosRouter;
  categoriaRoute: typeof createCategoriaRouter;
  carritoRoute: typeof createCarritoRouter;
  guardadosRoute: typeof createGuardadosRouter;
  pedidosRoute: typeof createPedidoRouter;
}
// Interfaces

// Servidor PostgreSQL
const propsModel: PropsModel = {
  userModel: UserModel,
  ventasModel: VentasModel,
  productosModel: ProductosModel,
  categoriaModel: CategoriaModel,
  carritoModel: CarritoModel,
  guardadosModel: GuardadosModel,
  pedidosModel: PedidoModel,
};

const propsRoutes: PropsRoutes = {
  userRoute: createUserRouter,
  ventasRoute: createVentasRouter,
  toolkitRoute: createToolkitRouter,
  productosRoute: createProductosRouter,
  categoriaRoute: createCategoriaRouter,
  carritoRoute: createCarritoRouter,
  guardadosRoute: createGuardadosRouter,
  pedidosRoute: createPedidoRouter
};
// Servidor PostgreSQL


App(propsModel, propsRoutes);