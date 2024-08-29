"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = validateUser;
exports.validatePartialUser = validatePartialUser;
const zod_1 = __importDefault(require("zod"));
const userSchema = zod_1.default.object({
    user_id: zod_1.default.string().optional(),
    user_name: zod_1.default.string(),
    email_address: zod_1.default.string(),
    first_name: zod_1.default.string(),
    last_name: zod_1.default.string(),
    pswd: zod_1.default.string()
});
function validateUser(input) {
    return userSchema.safeParse(input);
}
function validatePartialUser(input) {
    return userSchema.partial().safeParse(input);
}
