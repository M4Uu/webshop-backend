import mysql from 'mysql2/promise'
import { Uuid, Time, UserData } from '../../interface/users';

const LOCAL_CONFIG = {
  host: 'Cruz-PC',
  user: 'root',
  port: 3306,
  password: 'Llsalnde1.',
  database: 'users_db'
}

async function connect(){
  return await mysql.createConnection(LOCAL_CONFIG);
}

function disconnect(connection : any) {
  connection.end(function(err : any) {
    if(err) throw err;
    console.log("Conexión cerrada");
  })
}

export class UserModel {
  // static async getAll() {
  //   const [users, tableInfo] = awaitw connection.query(
  //     'SELECT BIN_TO_UUID(user_id), user_name, email_address, first_name, last_name, pswd, created_ad FROM users;'
  //   )
  //   return users;
  // }

  static async getUser({ input } : any){
    const connection = await connect()
    const { email, password } = input
    
    const [user, _tableInfo]: [UserData[], mysql.FieldPacket[]] = await connection.query('SELECT BIN_TO_UUID(user_id), user_name, email_address, first_name, last_name, pswd, created_ad FROM users WHERE ? = pswd AND ? = email_address;',[password, email])
    disconnect(connection)
    if (user[0] === undefined) return null
    return user[0];
  }

  static async register({ input } : any){
    const connection = await connect()
    const {
      user_name,
      email_address,
      first_name,
      last_name,
      pswd
    } = input
    
    const [uuidResult] : [Uuid[], mysql.FieldPacket[]] = await connection.query('SELECT UUID() AS uuid;')
    const uuid = uuidResult[0].uuid

    const [timeResult] : [Time[], mysql.FieldPacket[]] = await connection.query('SELECT NOW() time;')
    const time = timeResult[0].time

    try{
      await connection.query(
        'INSERT INTO users (user_id ,user_name, email_address, first_name, last_name, pswd, created_ad ) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);',
        [uuid, user_name, email_address, first_name, last_name, pswd, time])
    }
    catch (err) {
      throw new Error('Error creating user')
    }

    const [newUser]: [UserData[], mysql.FieldPacket[]] = await connection.query('SELECT BIN_TO_UUID(user_id) user_id, user_name, email_address, first_name, last_name, pswd, created_ad FROM users WHERE user_id = UUID_TO_BIN(?)',[uuid])
    disconnect(connection)
    return newUser[0]
  }

  // static async delete({ id } : any) {}
  static async upload({ input } : any) {
    const connection = await connect()
    const {
      user_id,
      user_name,
      email_address,
      first_name,
      last_name,
      pswd
    } = input
    
    try{
      await connection.execute(
        `UPDATE users
          SET user_name = ?,
              email_address = ?,
              first_name = ?,
              last_name = ?,
              pswd = ?
          WHERE user_id = UUID_TO_BIN(?);`,
        [user_name, email_address, first_name, last_name, pswd, user_id])
    } catch (err) {
      throw new Error('Error change user')
    }
    const [changedUser] = await connection.query('SELECT BIN_TO_UUID(user_id) user_id, user_name, email_address, first_name, last_name, pswd, created_ad FROM users WHERE user_id = UUID_TO_BIN(?)',[user_id])
    disconnect(connection)
    if(changedUser === undefined) return null
    return changedUser
  }
}
