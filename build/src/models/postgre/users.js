"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.dbConfig = void 0;
exports.testConnection = testConnection;
const pg_1 = require("pg");
exports.dbConfig = {
    connectionString: 'postgresql://root:rIsvH82Fotd83O5MAfjudq6Xj4LLBKoN@dpg-d0a1oc1r0fns73e1otpg-a.oregon-postgres.render.com/webshop_db_hj94',
    ssl: {
        rejectUnauthorized: false
    }
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
class UserModel {
    // static async getAll() {
    //   const [users, tableInfo] = awaitw connection.query(
    //     'SELECT BIN_TO_UUID(user_id), user_name, email_address, first_name, last_name, pswd, created_ad FROM users;'
    //   )
    //   return users;
    // }
    static disconnect(connection) {
        connection.end(function (err) {
            if (err)
                throw err;
            console.log("Conexión cerrada");
        });
    }
    static async getUser({ input }) {
        const client = await pool.connect();
        try {
            const { email, password } = input;
            const query = `
        SELECT id::text, user_name, email_address, first_name, last_name, pswd, created_ad 
        FROM users 
        WHERE pswd = $1 AND email_address = $2;
      `;
            const result = await client.query(query, [password, email]);
            if (result.rows.length === 0)
                return null;
            return result.rows[0];
        }
        catch (error) {
            console.error('Error en getUser:', error);
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async refreshUser({ input }) {
        const client = await pool.connect();
        try {
            const { id } = input;
            const query = `
        SELECT id::text, user_name, email_address, first_name, last_name, pswd, created_ad 
        FROM users 
        WHERE id::text = $1;
      `;
            const result = await client.query(query, [id]);
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
    static async register({ input }) {
        const client = await pool.connect();
        try {
            const { user_name, email_address, first_name, last_name, pswd } = input;
            // Verificar si el usuario ya existe
            const verifyQuery = 'SELECT * FROM users WHERE user_name = $1';
            const verifyResult = await client.query(verifyQuery, [user_name]);
            if (verifyResult.rows.length > 0) {
                return null;
            }
            // Insertar nuevo usuario
            const insertQuery = `
        INSERT INTO users (user_name, email_address, first_name, last_name, pswd) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id::text, user_name, email_address, first_name, last_name, pswd, created_ad;
      `;
            const insertResult = await client.query(insertQuery, [
                user_name,
                email_address,
                first_name,
                last_name,
                pswd
            ]);
            return insertResult.rows[0];
        }
        catch (error) {
            console.error('Error en register:', error);
            throw new Error('Error creating user');
        }
        finally {
            client.release();
        }
    }
    // static async delete({ id } : any) {}
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
