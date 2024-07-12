import express, { json } from "express";
import { createUserRouter } from "./routes/user.js"

export function App({ userModel }) {
  const app = express()
  const port = process.env.PORT ?? 1234

  app.use(json())
  app.disable('x-powered-by')
  // app.use(corsMiddleware())

  app.use('/', createUserRouter({ userModel }))

  app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port} !`)
  })
}