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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const jws_1 = require("../middleware/jws");
const schema = __importStar(require("../schema/user"));
class UserController {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    logOut = async (_req, res) => {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.status(200).json({
            status: {
                statusCode: 200,
                message: 'Log out.'
            }
        });
    };
    protected = async (req, res) => {
        const token = req.cookies['access_token'];
        if (!token) {
            res.status(403).json({
                status: {
                    statusCode: 403,
                    message: 'Access not authorized (Not Coockies)'
                }
            });
            return;
        }
        try {
            res.status(200).json({
                payload: (0, jws_1.JWTParse)(token),
                status: {
                    statusCode: 200,
                    message: 'Account current'
                }
            });
        }
        catch {
            res.clearCookie('access_token');
            const ref_token = req.cookies['refresh_token'];
            if (!token) {
                res.status(403).json({
                    status: {
                        statusCode: 403,
                        message: 'Access not authorized'
                    }
                });
                return;
            }
            try {
                const user = (0, jws_1.JWTMiddlewareInitial)(await this.userModel.refreshUser({ input: (0, jws_1.JWTParse)(ref_token) }));
                res.cookie('access_token', user, {
                    httpOnly: true, // ;a coockie solo se puede acceder en el servidor
                    // secure: true, //la coockie solo se puede acceder en https
                    secure: process.env['NODE_ENV'] === 'production', //la coockie solo se puede acceder en https
                    sameSite: 'none', // la coockie entre múltiples dominios (con 'strict' solo se puede acceder desde el mismo dominio)
                    maxAge: 1000 * 60 * 60 // tiempo de duración de la cookie
                });
                res.status(200).json({
                    payload: user,
                    status: {
                        statusCode: 200,
                        message: 'Account current'
                    }
                });
            }
            catch {
                res.status(401).json({
                    status: {
                        statusCode: 401,
                        message: 'Account expired'
                    }
                });
                return;
            }
        }
    };
    login = async (req, res) => {
        const data = await this.userModel.getUser(req.body);
        if (!data) {
            res.status(401).json({
                status: {
                    statusCode: 401,
                    message: 'Correo o contraseña inválidos'
                }
            });
            return;
        }
        const user = (0, jws_1.JWTMiddlewareInitial)(data);
        const ref_user = (0, jws_1.JWTMiddlewareRefresh)(data.cedula);
        try {
            res.cookie('access_token', user, {
                httpOnly: true, // ;a coockie solo se puede acceder en el servidor
                secure: true, //la coockie solo se puede acceder en https
                // secure: process.env['NODE_ENV'] === 'production', //la coockie solo se puede acceder en https
                sameSite: 'none', // la coockie entre múltiples dominios (con 'none' solo se puede acceder desde el mismo dominio)
                maxAge: 1000 * 60 * 60 // tiempo de duración de la cookie
            });
            res.cookie('refresh_token', ref_user, {
                httpOnly: true,
                secure: true,
                // secure: process.env['NODE_ENV'] === 'production',
                sameSite: 'none',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            res.status(200).json({
                status: {
                    user: user,
                    statusCode: 200,
                    message: 'Login Success'
                }
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                status: {
                    statusCode: 500,
                    message: 'Server_error'
                }
            });
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
            user = await this.userModel.register(result.data);
            user ?
                res.status(201).json({
                    status: {
                        user: user,
                        statusCode: 201,
                        message: 'Usuario registrado correctamente'
                    }
                })
                : res.status(406).json({
                    status: {
                        statusCode: 406,
                        message: 'Error al registarar'
                    }
                });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({
                status: {
                    statusCode: 500,
                    message: 'Server error'
                }
            });
            return;
        }
    };
    delete = async (_req, res) => {
        res.status(201).json({
            status: {
                statusCode: 200,
                message: 'Este endpoint aún no se ha hecho, pero al menos manda un mensaje.'
            }
        });
    };
    upload = async (req, res) => {
        const result = schema.validatePartialUser(req.body);
        if (result.error) {
            res.status(400).json({ error: JSON.parse(result.error?.message) });
            return;
        }
        await this.userModel.upload({ input: result.data });
        res.status(201).json({
            status: {
                statusCode: 201,
                message: 'Datos cambiados'
            }
        });
        return;
    };
}
exports.UserController = UserController;
//# sourceMappingURL=user.js.map