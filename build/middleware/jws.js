"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTMiddlewareInitial = JWTMiddlewareInitial;
exports.JWTMiddlewareRefresh = JWTMiddlewareRefresh;
exports.JWTParse = JWTParse;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../env/config");
// import { UserData } from '../interface/users'
function JWTMiddlewareInitial(input) {
    if (!input)
        return null;
    return (0, jsonwebtoken_1.sign)({
        cedula: input.cedula,
        correo: input.correo,
        imagen_url: input.imagen_url,
        localidad: input.localidad,
        nombre_usuario: input.nombre_usuario,
        nombres: input.nombres
    }, config_1.SECRET_JWT_KEY, { expiresIn: '1h' });
}
function JWTMiddlewareRefresh(cedula) {
    if (!cedula)
        return null;
    return (0, jsonwebtoken_1.sign)({
        cedula: cedula
    }, config_1.SECRET_JWT_KEY, { expiresIn: '30d' });
}
function JWTParse(input) {
    return (0, jsonwebtoken_1.verify)(input, config_1.SECRET_JWT_KEY);
}
//# sourceMappingURL=jws.js.map