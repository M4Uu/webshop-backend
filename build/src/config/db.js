"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
exports.dbConfig = {
    connectionString: "postgresql://usuario:contraseña@host:5432/db?sslmode=require",
    ssl: { rejectUnauthorized: false }
};
