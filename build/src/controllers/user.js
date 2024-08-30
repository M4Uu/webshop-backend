"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const jws_1 = require("../middleware/jws");
const schema = __importStar(require("../schema/user"));
class UserController {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    // getAll = async(req, res) => {
    //   const users = await this.userModel.getAll()
    //   res.status(200).json(users)
    // }
    protected = async (req, res) => {
        const token = req.cookies['access_token'];
        if (!token) {
            res.status(403).send('Access not authorized');
            return;
        }
        try {
            res.status(200).json((0, jws_1.JWTParse)(token));
        }
        catch (error) {
            res.status(401).send('Access not authorized');
            return;
        }
    };
    getUser = async (req, res) => {
        const user = (0, jws_1.JWTMiddlewareInitial)(await this.userModel.getUser({ input: req.body }));
        try {
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.cookie('access_token', user, {
                httpOnly: true, // ;a coockie solo se puede acceder en el servidor
                // secure: true, //la coockie solo se puede acceder en https
                secure: process.env['NODE_ENV'] === 'production', //la coockie solo se puede acceder en https
                sameSite: 'strict', // la coockie entre múltiples dominios (con 'strict' solo se puede acceder desde el mismo dominio)
                maxAge: 1000 * 60 * 60 // tiempo de duración de la cookie
            });
            res.status(200).send();
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Server error' });
            return;
        }
    };
    register = async (req, res) => {
        const result = schema.validateUser(req.body);
        if (result.error) {
            res.status(422).json({ error: JSON.parse(result.error?.message) });
            return;
        }
        const newUser = await this.userModel.register({ input: result.data });
        res.status(201).json(newUser);
    };
    delete = async (_req, _res) => { };
    upload = async (req, res) => {
        const result = schema.validatePartialUser(req.body);
        if (result.error) {
            res.status(400).json({ error: JSON.parse(result.error?.message) });
            return;
        }
        const ChangedUser = await this.userModel.upload({ input: result.data });
        res.status(201).json(ChangedUser);
    };
}
exports.UserController = UserController;
