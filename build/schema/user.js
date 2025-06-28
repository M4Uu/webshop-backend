"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = validateUser;
exports.validatePartialUser = validatePartialUser;
const zod_1 = __importDefault(require("zod"));
const userSchema = zod_1.default.object({
    cedula: zod_1.default.number(),
    nombres: zod_1.default.string(),
    nombre_usuario: zod_1.default.string(),
    password: zod_1.default.string(),
    localidad: zod_1.default.string(),
    correo: zod_1.default.string(),
    imagen_url: zod_1.default.string(),
});
function validateUser(input) {
    return userSchema.safeParse(input);
}
function validatePartialUser(input) {
    return userSchema.partial().safeParse(input);
}
//# sourceMappingURL=user.js.map