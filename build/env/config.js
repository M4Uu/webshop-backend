"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_STRING = exports.SECRET_JWT_KEY = void 0;
_a = process.env, _b = _a.SECRET_JWT_KEY, exports.SECRET_JWT_KEY = _b === void 0 ? 'this-is-an-awesome-secret-key-mucho-mas-largo-y-muy-seguro' : _b, _c = _a.DB_STRING, exports.DB_STRING = _c === void 0 ? 'postgresql://neondb_owner:npg_1lB2SjPqAcKE@ep-solitary-darkness-a51xyuhr.us-east-2.aws.neon.tech/webshop_db?sslmode=require' : _c;
//# sourceMappingURL=config.js.map