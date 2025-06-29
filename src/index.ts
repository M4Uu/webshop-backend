import express from "express";
import { createUserRouter } from "./routes/user"
import { corsMiddleware } from "./middleware/cors";
import { UserModel } from "./models/mysql/users";
import { UserModel as UserPostgre } from "./models/postgre/users";
import cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv';

dotenv.config();

export default function App(userModel: typeof UserModel | UserPostgre) {

  const app = express()
  app.use(express.json())
  app.use(corsMiddleware())

  const port = process.env["PORT"] || 3312;

  // Carga las variables ANTES de usarlas
  app.disable('x-powered-by')
  app.use(cookieParser())

  app.get("/api", (__req, res) => {
    res.json({
      status: "API funcionando",
      message: "Bienvenido a mi API",
      endpoints: {
        users: "/users"
      }
    });
  });

  app.use('/api/users', createUserRouter(userModel))

  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}