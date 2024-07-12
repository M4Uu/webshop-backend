import mysql from 'mysql2/promise'

const LOCAL_CONFIG = {
  host: 'Cruz-PC',
  user: 'root',
  port: '3306',
  password: 'Llsalnde1.',
  database: 'users_db'
}

const connectionString = process.env.DATABASE_URL ?? LOCAL_CONFIG;

const connection = await mysql.createConnection(connectionString)

export class UserModel {
  static async getAll() {
    const [users, tableInfo] = await connection.query(
      'SELECT BIN_TO_UUID(user_id), user_name, email_address, first_name, last_name, pswd, created_ad FROM users;'
    )
    return users;
  }
  static async getById({ id }) {}
  static async delete({ id }) {}
  static async upload({ id, input }) {}
}