import express from "express";
import { createUserRouter } from "./src/routes/user"
import { corsMiddleware } from "./src/middleware/cors";
import { UserModel } from "./src/models/mysql/users";
import { UserModel as UserPostgre } from "./src/models/postgre/users";
import cookieParser from 'cookie-parser'

export function App(userModel: typeof UserModel | UserPostgre) {

  const app = express()
  const port = process.env["PORT"] || 1234

  // Carga las variables ANTES de usarlas
  app.disable('x-powered-by')

  app.use(cookieParser())
  app.use(express.json())
  app.use(corsMiddleware())

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