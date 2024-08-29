import express from "express";
import { createUserRouter } from "./src/routes/user"
import { corsMiddleware } from "./src/middleware/cors";
import { UserModel } from "./src/models/mysql/users";
import cookieParser from 'cookie-parser'

export function App(userModel : typeof UserModel) {
  const app = express()
  const port = process.env["PORT"] ?? 1234

  app.disable('x-powered-by')
  
  app.use(cookieParser())
  app.use(express.json())
  app.use(corsMiddleware())
  app.use('/users', createUserRouter(userModel))

  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    })
}