"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.dbConfig = void 0;
exports.testConnection = testConnection;
const pg_1 = require("pg");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.dbConfig = {
    connectionString: process.env['DB_STRING'],
    ssl: { rejectUnauthorized: false }
};
const pool = new pg_1.Pool(exports.dbConfig);
async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('Conexión exitosa a PostgreSQL');
        client.release();
        return true;
    }
    catch (error) {
        console.error('Error de conexión:', error);
        return false;
    }
}
async function comparePassword(password, storedHash) {
    try {
        const isMatch = await bcryptjs_1.default.compare(password, storedHash);
        return isMatch;
    }
    catch (error) {
        return false;
    }
}
class UserModel {
    static disconnect(connection) {
        connection.end(function (err) {
            if (err)
                throw err;
            console.log("Conexión cerrada");
        });
    }
    static async getUser(input) {
        const client = await pool.connect();
        try {
            const query = `
        SELECT cedula, credencial, nombres, nombre_usuario, localidad, correo, imagen_url
        FROM "wp_usuarios"
        WHERE correo = $1;
      `;
            const result = (await client.query(query, [input.correo]));
            const user = result.rows[0];
            const validatePassword = await comparePassword(input.credencial, user.credencial);
            if (validatePassword) {
                delete user.credencial;
                return user;
            }
            return null;
        }
        catch (error) {
            console.error('Error en getUser:', error);
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async refreshUser(input) {
        const client = await pool.connect();
        try {
            const query = `
        SELECT cedula, nombres, nombre_usuario, localidad, correo, imagen_url
        FROM users
        WHERE cedula = $1;
      `;
            const result = await client.query(query, [input.cedula]);
            if (result.rows.length === 0)
                return null;
            return result.rows[0];
        }
        catch (error) {
            console.error('Error en refreshUser:', error);
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async register(input) {
        // const SALT_ROUNDS = 5;
        const client = await pool.connect();
        try {
            const verifyResult = await client.query('SELECT * FROM "wp_usuarios" WHERE cedula = $1', [input.cedula]);
            if (verifyResult.rows.length > 0) {
                return null;
            }
            const insertQuery = `
        INSERT INTO "wp_usuarios" (cedula, nombres, nombre_usuario, credencial, localidad, correo, imagen_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING cedula, nombres, nombre_usuario, correo;
      `;
            try {
                // const hashedPassword = await bcrypt.hash(input.credencial, SALT_ROUNDS);
                const insertResult = await client.query(insertQuery, [
                    input.cedula,
                    input.nombres,
                    input.nombre_usuario,
                    input.credencial,
                    input.localidad,
                    input.correo,
                    input.imagen_url
                ]);
                return insertResult.rows[0];
            }
            catch (hashError) {
                console.error('Error hashing password:', hashError);
                throw new Error('Password hashing failed');
            }
        }
        catch (error) {
            console.error('Error en register:', error);
            throw new Error('Error creating user');
        }
        finally {
            client.release();
        }
    }
    static async upload({ input }) {
        const client = await pool.connect();
        try {
            const { user_id, user_name, email_address, first_name, last_name, pswd } = input;
            const updateQuery = `
        UPDATE users
        SET user_name = $1,
            email_address = $2,
            first_name = $3,
            last_name = $4,
            pswd = $5
        WHERE id::text = $6
        RETURNING id::text, user_name, email_address, first_name, last_name, pswd, created_ad;
      `;
            const updateResult = await client.query(updateQuery, [
                user_name,
                email_address,
                first_name,
                last_name,
                pswd,
                user_id
            ]);
            if (updateResult.rows.length === 0)
                return null;
            return updateResult.rows[0];
        }
        catch (error) {
            console.error('Error en upload:', error);
            throw new Error('Error updating user');
        }
        finally {
            client.release();
        }
    }
    static async delete({ id }) {
        const client = await pool.connect();
        try {
            const deleteQuery = 'DELETE FROM users WHERE id::text = $1 RETURNING id::text;';
            const deleteResult = await client.query(deleteQuery, [id]);
            if (deleteResult.rows.length === 0)
                return false;
            return true;
        }
        catch (error) {
            console.error('Error en delete:', error);
            throw new Error('Error deleting user');
        }
        finally {
            client.release();
        }
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=users.js.map