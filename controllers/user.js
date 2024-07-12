export class UserController {
  constructor({ userModel }){
    this.userModel = userModel
  }
  getAll = async(req, res) => {
    const users = await this.userModel.getAll()
    res.json(users)
  }
  getById = async(req, res) => {}
  create = async(req, res) => {}
  delete = async(req, res) => {}
  update = async(req, res) => {}
}