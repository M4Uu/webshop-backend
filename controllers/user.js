import { validateUser, validatePartialUser } from "../schema/user.js"

export class UserController {
  constructor({ userModel }){
    this.userModel = userModel
  }

  // getAll = async(req, res) => {
  //   const users = await this.userModel.getAll()
  //   res.status(200).json(users)
  // }

  getUser = async(req, res) => {
    if(req.query.error){
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const users = await this.userModel.getUser({input: req.query})
    res.status(200).json(users)
  }

  register = async(req, res) => {
    // Se deben validar los datos de entrada
    const result = validateUser(req.body)
    if(result.error){
      return res.status(422).json({ error: JSON.parse(result.error.message) })
    }
    const newUser = await this.userModel.register({ input: result.data })

    res.status(201).json(newUser)

  }
  delete = async(req, res) => {}
  upload = async(req, res) => {
    const result = validateUser(req.body)
    if(result.error){
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const ChangedUser = await this.userModel.upload({ input: result.data })

    res.status(201).json(ChangedUser)
  }
}