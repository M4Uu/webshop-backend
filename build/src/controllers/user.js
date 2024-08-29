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
const jws_js_1 = require("../middleware/jws.js");
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
    getUser = async (req, res) => {
        const result = schema.validateUser(req.body);
        if (req.query["error"]) {
            res.status(400).json({ error: JSON.parse(result.error?.message) });
            return;
        }
        const users = await this.userModel.getUser({ input: req.query });
        res.status(200)
            .json(users)
            .cookie('access_token', () => users && (0, jws_js_1.JWTMiddlewareInitial)(users), {
            httpOnly: true, // ;a coockie solo se puede acceder en el servidor
            secure: process.env['NODE_ENV'] === 'production', //la coockie solo se puede acceder en https
            sameSite: 'strict', // la coockie solo sse puede acceder en el mismo dominio
            maxAge: 1000 * 60 * 60 // tiempo de duración de la cookie
        });
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
