"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_JWT_KEY = void 0;
_a = process.env.SECRET_JWT_KEY, exports.SECRET_JWT_KEY = _a === void 0 ? 'this-is-an-awesome-secret-key-mucho-mas-largo-y-muy-seguro' : _a;
