"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../models/postgre/users");
const index_1 = __importDefault(require("../index"));
(0, index_1.default)(users_1.UserModel);
//# sourceMappingURL=serverpostgre.js.map