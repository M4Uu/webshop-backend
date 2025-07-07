"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashCrypto = void 0;
const crypto_1 = require("crypto");
class hashCrypto {
    static hashPassword(password) {
        const salt = (0, crypto_1.randomBytes)(16).toString('hex');
        const hash = (0, crypto_1.scryptSync)(password, salt, 64).toString('hex');
        return `${salt}:${hash}`;
    }
    static verifyPassword(password, stored) {
        const [salt, key] = stored.split(':');
        const hash = (0, crypto_1.scryptSync)(password, salt, 64).toString('hex');
        return hash === key;
    }
}
exports.hashCrypto = hashCrypto;
//# sourceMappingURL=cryptohash.js.map