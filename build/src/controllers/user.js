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
    logOut = async (_req, res) => {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.send('Log out.');
    };
    protected = async (req, res) => {
        const token = req.cookies['access_token'];
        if (!token) {
            res.status(403).send('Access not authorized');
            return;
        }
        try {
            res.status(200).json((0, jws_1.JWTParse)(token));
        }
        catch {
            res.clearCookie('access_token');
            const ref_token = req.cookies['refresh_token'];
            if (!token) {
                res.status(403).send('Access not authorized');
                return;
            }
            try {
                const user = (0, jws_1.JWTMiddlewareInitial)(await this.userModel.refreshUser({ input: (0, jws_1.JWTParse)(ref_token) }));
                res.cookie('access_token', user, {
                    httpOnly: true, // ;a coockie solo se puede acceder en el servidor
                    // secure: true, //la coockie solo se puede acceder en https
                    secure: process.env['NODE_ENV'] === 'production', //la coockie solo se puede acceder en https
                    sameSite: 'strict', // la coockie entre múltiples dominios (con 'strict' solo se puede acceder desde el mismo dominio)
                    maxAge: 1000 * 60 * 60 // tiempo de duración de la cookie
                });
                res.status(200).json(user);
            }
            catch {
                res.status(401).send('Account expired');
                return;
            }
        }
    };
    getUser = async (req, res) => {
        const data = await this.userModel.getUser({ input: req.body });
        const user = (0, jws_1.JWTMiddlewareInitial)(data);
        const ref_user = (0, jws_1.JWTMiddlewareRefresh)(data?.id);
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
            res.cookie('refresh_token', ref_user, {
                httpOnly: true,
                // secure: true,
                secure: process.env['NODE_ENV'] === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
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
        let user;
        if (result.error) {
            res.status(422).json({ error: JSON.parse(result.error?.message) });
            return;
        }
        try {
            user = await this.userModel.register({ input: result.data });
            user ? res.status(201).send() : res.status(406).send();
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Server error' });
            return;
        }
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
