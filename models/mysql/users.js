import mysql from 'mysql2/promise'
const LOCAL_CONFIG = {
  host: 'Cruz-PC',
  user: 'root',
  port: 3306,
  password: 'Llsalnde1.',
  database: 'users_db'
}

const connection = await mysql.createConnection(
  process.env.DATABASE_URL ?? LOCAL_CONFIG
)
export class UserModel {
  // static async getAll() {
  //   const [users, tableInfo] = await connection.query(
  //     'SELECT BIN_TO_UUID(user_id), user_name, email_address, first_name, last_name, pswd, created_ad FROM users;'
  //   )
  //   return users;
  // }

  static async getUser({ input }){
    const {
      email,
      password
    } = input
    const [user, tableInfo] = await connection.query('SELECT BIN_TO_UUID(user_id), user_name, email_address, first_name, last_name, pswd, created_ad FROM users WHERE ? = pswd AND ? = email_address;',[password, email])
    
    if (user.length === 0) return null
    return user[0];
  }

  static async register({ input }){
    const {
      user_name,
      email_address,
      first_name,
      last_name,
      pswd
    } = input
    
    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{uuid}] = uuidResult

    const [timeResult] = await connection.query('SELECT NOW() time;')
    const [{time}] = timeResult;


    try{
      await connection.query(
        'INSERT INTO users (user_id ,user_name, email_address, first_name, last_name, pswd, created_ad ) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);',
        [uuid, user_name, email_address, first_name, last_name, pswd, time])
    }
    catch (err) {
      throw new Error('Error creating user')
    }

    const [newUser] = await connection.query('SELECT BIN_TO_UUID(user_id) user_id, user_name, email_address, first_name, last_name, pswd, created_ad FROM users WHERE user_id = UUID_TO_BIN(?)',[uuid])

    return newUser[0]
  }

  static async delete({ id }) {}
  static async upload({ input }) {
    const {
      user_id,
      user_name,
      email_address,
      first_name,
      last_name,
      pswd
    } = input

    try{
      await connection.query(
        `UPDATE users
          SET user_name = ?,
              email_address = ?,
              first_name = ?,
              last_name = ?,
              pswd = ?
          WHERE user_id = UUID_TO_BIN(?);`,
        [user_name, email_address, first_name, last_name, pswd, user_id])
    }
    catch (err) {
      throw new Error('Error creating user')
    }
    const [changedUser] = await connection.query('SELECT BIN_TO_UUID(user_id) user_id, user_name, email_address, first_name, last_name, pswd, created_ad FROM users WHERE user_id = UUID_TO_BIN(?)',[user_id])
    return changedUser[0]
  }
}
