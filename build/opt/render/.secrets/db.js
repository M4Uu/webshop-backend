"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
// export const dbConfig = {
//   connectionString: "postgresql://neondb_owner:npg_pTJ4aSlGofb5@ep-flat-leaf-a59rqmvj-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
//   ssl: { rejectUnauthorized: false }
// };
exports.dbConfig = {
    connectionString: process.env['DB_STRING'],
    ssl: { rejectUnauthorized: false }
};
