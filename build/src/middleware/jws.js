"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTMiddlewareInitial = JWTMiddlewareInitial;
exports.JWTMiddlewareRefresh = JWTMiddlewareRefresh;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../env/config");
function JWTMiddlewareInitial(input) {
    return (0, jsonwebtoken_1.sign)({
        user_id: input.user_id,
        user_name: input.user_name,
        email_address: input.email_address,
        first_name: input.first_name,
        last_name: input.last_name,
        pswd: input.pswd
    }, config_1.SECRET_JWT_KEY, { expiresIn: '1h' });
}
function JWTMiddlewareRefresh() { }
