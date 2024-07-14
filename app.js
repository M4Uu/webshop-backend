import express, { json } from "express";
import { createUserRouter } from "./routes/user.js"
import { corsMiddleware } from "./middleware/cors.js";

export function App({ userModel }) {
  const app = express()
  const port = process.env.PORT ?? 1234

  app.disable('x-powered-by')

  app.use(json())
  app.use(corsMiddleware())
  app.use('/users', createUserRouter({ userModel }))

  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}