"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = require("../schema/user");
class UserController {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    // getAll = async(req, res) => {
    //   const users = await this.userModel.getAll()
    //   res.status(200).json(users)
    // }
    getUser = async (req, res) => {
        const result = (0, user_1.validateUser)(req.body);
        if (req.query["error"]) {
            res.status(400).json({ error: JSON.parse(result.error?.message) });
            return;
        }
        const users = await this.userModel.getUser({ input: req.query });
        res.status(200).json(users);
    };
    register = async (req, res) => {
        const result = (0, user_1.validateUser)(req.body);
        if (result.error) {
            res.status(422).json({ error: JSON.parse(result.error?.message) });
            return;
        }
        const newUser = await this.userModel.register({ input: result.data });
        res.status(201).json(newUser);
    };
    delete = async (_resreq, _res) => { };
    upload = async (req, res) => {
        const result = (0, user_1.validateUser)(req.body);
        if (result.error) {
            res.status(400).json({ error: JSON.parse(result.error?.message) });
            return;
        }
        const ChangedUser = await this.userModel.upload({ input: result.data });
        res.status(201).json(ChangedUser);
    };
}
exports.UserController = UserController;
