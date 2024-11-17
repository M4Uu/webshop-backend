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
function disconnect(connection) {
    connection.end(function (err) {
        if (err)
            throw err;
        console.log("Conexión cerrada");
    });
}
class UserModel {
    // static async getAll() {
    //   const [users, tableInfo] = awaitw connection.query(
    //     'SELECT BIN_TO_UUID(user_id), user_name, email_address, first_name, last_name, pswd, created_ad FROM users;'
    //   )
    //   return users;
    // }
    static async getUser({ input }) {
        const connection = await connect();
        const { email, password } = input;
        const [user, _tableInfo] = await connection.query('SELECT BIN_TO_UUID(id) As id, user_name, email_address, first_name, last_name, pswd, created_ad FROM users WHERE ? = pswd AND ? = email_address;', [password, email]);
        disconnect(connection);
        if (user[0] === undefined)
            return null;
        return user[0];
    }
    static async refreshUser({ input }) {
        const connection = await connect();
        const { id } = input;
        const [user, _tableInfo] = await connection.query('SELECT BIN_TO_UUID(user_id) As user_id, user_name, email_address, first_name, last_name, pswd, created_ad FROM users WHERE ? = BIN_TO_UUID(user_id) ;', [id]);
        disconnect(connection);
        if (user[0] === undefined)
            return null;
        return user[0];
    }
    static async register({ input }) {
        const connection = await connect();
        const { user_name, email_address, first_name, last_name, pswd } = input;
        const [uuidResult] = await connection.query('SELECT UUID() AS uuid;');
        const uuid = uuidResult[0].uuid;
        const [timeResult] = await connection.query('SELECT NOW() time;');
        const time = timeResult[0].time;
        const [VerifyUser] = await connection.query('SELECT * FROM users WHERE user_name = ?', [user_name]);
        if (VerifyUser[0]) {
            disconnect(connection);
            return null;
        }
        else {
            try {
                await connection.query('INSERT INTO users (id ,user_name, email_address, first_name, last_name, pswd, created_ad ) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);', [uuid, user_name, email_address, first_name, last_name, pswd, time]);
            }
            catch (err) {
                throw new Error('Error creating user');
            }
            const [newUser] = await connection.query('SELECT BIN_TO_UUID(id) id, user_name, email_address, first_name, last_name, pswd, created_ad FROM users WHERE id = UUID_TO_BIN(?)', [uuid]);
            disconnect(connection);
            return newUser[0];
        }
    }
    // static async delete({ id } : any) {}
    static async upload({ input }) {
        const connection = await connect();
        const { user_id, user_name, email_address, first_name, last_name, pswd } = input;
        try {
            await connection.execute(`UPDATE users
          SET user_name = ?,
              email_address = ?,
              first_name = ?,
              last_name = ?,
              pswd = ?
          WHERE id = UUID_TO_BIN(?);`, [user_name, email_address, first_name, last_name, pswd, user_id]);
        }
        catch (err) {
            throw new Error('Error change user');
        }
        const [changedUser] = await connection.query('SELECT BIN_TO_UUID(id) id, user_name, email_address, first_name, last_name, pswd, created_ad FROM users WHERE id = UUID_TO_BIN(?)', [user_id]);
        disconnect(connection);
        if (changedUser === undefined)
            return null;
        return changedUser;
    }
}
exports.UserModel = UserModel;
