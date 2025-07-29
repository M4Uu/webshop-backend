import express from "express";
import { corsMiddleware } from "./middleware/cors";
import cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv';

import { PropsRoutes } from "./servers/serverpostgre";


dotenv.config();

export default function App(propsModel: any, propsRoutes: PropsRoutes) {

  const app = express()
  app.use(express.json())
  app.use(corsMiddleware())

  const port = process.env["PORT"] || 3312;

  app.disable('x-powered-by')
  app.use(cookieParser())

  // Rutas para cronjobs y revisión de vida
  app.get("/api", (__req, res) => {
    res.json({
      status: "API funcionando",
      message: "Bienvenido a mi API",
      endpoints: {
        users: "/users"
      }
    });
  });
  app.get('/health', (__req, res) => {
    res.status(200).json({
      status: 'OK',
      memory: process.memoryUsage(),
      uptime: process.uptime()
    });
  });

  // Rutas reales
  app.use('/api/users', propsRoutes.userRoute(propsModel.userModel));
  app.use('/api/ventas', propsRoutes.ventasRoute(propsModel.ventasModel));
  app.use('/api/productos', propsRoutes.productosRoute(propsModel.productosModel));
  app.use('/api/categoria', propsRoutes.categoriaRoute(propsModel.categoriaModel));
  app.use('/api/carrito', propsRoutes.carritoRoute(propsModel.carritoModel));
  app.use('/api/guardados', propsRoutes.guardadosRoute(propsModel.guardadosModel));
  app.use('/api/pedidos', propsRoutes.pedidosRoute(propsModel.pedidosModel));

  app.use('/api/toolkit', propsRoutes.toolkitRoute());


  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}