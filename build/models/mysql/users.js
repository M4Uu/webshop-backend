"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const LOCAL_CONFIG = {
    host: 'Cruz-PC',
    user: 'root',
    port: 3306,
    password: 'Llsalnde1.',
    database: 'users_db'
};
async function connect() {
    return await promise_1.default.createConnection(LOCAL_CONFIG);
}
function JSONparse(queryResult) {
    return JSON.parse(JSON.stringify(queryResult).replace(/[{}"'link:]/gi, ""));
}
class UserModel {
    // static async getAll() {
    //   const [users, tableInfo] = await connection.query(
    //     'SELECT BIN_TO_UUID(user_id), user_name, email_address, first_name, last_name, pswd, created_ad FROM users;'
    //   )
    //   return users;
    // }
    static async getUser({ input }) {
        const connection = await connect();
        const { email, password } = input;
        const [results, _tableInfo] = await connection.query('SELECT BIN_TO_UUID(user_id), user_name, email_address, first_name, last_name, pswd, created_ad FROM users WHERE ? = pswd AND ? = email_address;', [password, email]);
        const user = JSONparse(results);
        if (user.length === 0)
            return null;
        return user[0];
    }
    static async register({ input }) {
        const connection = await connect();
        const { user_name, email_address, first_name, last_name, pswd } = input;
        const [uuidResult] = await connection.query('SELECT UUID() uuid;');
        const [{ uuid }] = JSONparse(uuidResult);
        const [timeResult] = await connection.query('SELECT NOW() time;');
        const [{ time }] = JSONparse(timeResult);
        try {
            await connection.query('INSERT INTO users (user_id ,user_name, email_address, first_name, last_name, pswd, created_ad ) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);', [uuid, user_name, email_address, first_name, last_name, pswd, time]);
        }
        catch (err) {
            throw new Error('Error creating user');
        }
        const [newUser] = await connection.query('SELECT BIN_TO_UUID(user_id) user_id, user_name, email_address, first_name, last_name, pswd, created_ad FROM users WHERE user_id = UUID_TO_BIN(?)', [uuid]);
        return JSONparse(newUser)[0];
    }
    // static async delete({ id } : any) {}
    static async upload({ input }) {
        const connection = await connect();
        const { user_id, user_name, email_address, first_name, last_name, pswd } = input;
        try {
            await connection.query(`UPDATE users
          SET user_name = ?,
              email_address = ?,
              first_name = ?,
              last_name = ?,
              pswd = ?
          WHERE user_id = UUID_TO_BIN(?);`, [user_name, email_address, first_name, last_name, pswd, user_id]);
        }
        catch (err) {
            throw new Error('Error creating user');
        }
        const [changedUser] = await connection.query('SELECT BIN_TO_UUID(user_id) user_id, user_name, email_address, first_name, last_name, pswd, created_ad FROM users WHERE user_id = UUID_TO_BIN(?)', [user_id]);
        return JSONparse(changedUser)[0];
    }
}
exports.UserModel = UserModel;
