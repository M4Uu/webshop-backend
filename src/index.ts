import express from "express";
import { corsMiddleware } from "./middleware/cors";
import cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv';

import { createUserRouter } from "./routes/user"
import { createToolkitController } from "./routes/toolkit";

import { UserModel } from "./models/postgre/users";


dotenv.config();

export default function App(userModel: typeof UserModel) {

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
  app.use('/api/users', createUserRouter(userModel));
  app.use('/api/toolkit', createToolkitController());


  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}